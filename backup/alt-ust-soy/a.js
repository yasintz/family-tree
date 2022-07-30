const _ = require('lodash');
const { turkishToEnglish, uid } = require('./lib');

const temp1 = require('./yildiz.json');

const getHashById = (str) => {
  getHashById.store = getHashById.store || {};

  getHashById.store[str] = getHashById.store[str] || uid();

  return getHashById.store[str];
};

function convert(obj) {
  Object.assign(obj, {
    cilt: obj['Cilt-Hane-Birey Sıra No'] || Math.random(),
    gender: obj.C === 'E' ? 0 : 1,
    degree: obj['Yakınlık Derecesi'],
    name: obj['Adı'],
    surname: obj['Soyadı'],
    fatherName: obj['Baba Adı'],
    motherName: obj['Ana Adı'],
    place: (obj['İl-İlçe-Mahalle/Köy'] || '').split('\n').join(''),
  });

  obj.birth = ((obj['Doğum Yeri ve Tarihi'] || '').split('\n')[1] || '')
    .trim()
    .replace('-', '');

  obj.death = ((obj['Durumu'] || '').split('\n')[1] || '')
    .trim()
    .replace('-', '');

  if (obj.surname === '-') {
    obj.surname = '';
  }

  const idn = turkishToEnglish(obj.name.split(' ').join(''));
  obj.id = `${idn}_${obj.gender}_${getHashById(obj.cilt)}`;
  return obj;
}

function relationFatherAndMotherToUser({ user, degreeMap, users }) {
  const ek = user.gender === 1 ? 'nin' : 'nın';
  const motherId = degreeMap[`${user.degree}${ek} Annesi`];
  const fatherId = degreeMap[`${user.degree}${ek} Babası`];
  user.mother = users.find((user) => user.id === motherId);
  user.father = users.find((user) => user.id === fatherId);

  const newUsers = [];

  if (!user.mother) {
    const newMother = convert({
      Adı: user.motherName,
      C: 'K',
      Soyadı: '',
    });

    user.mother = newMother;
    newUsers.push(newMother);
  }
  if (!user.father) {
    const newFather = convert({
      C: 'E',
      Adı: user.fatherName,
      Soyadı: user.surname,
    });
    user.father = newFather;
    newUsers.push(newFather);
  }

  return newUsers;
}

function main() {
  const converted = temp1.map(convert);
  const users = Object.keys(_.groupBy(converted, 'id')).map((id) =>
    converted.find((u) => u.id === id)
  );
  const degreeMap = converted.reduce((acc, cur) => {
    acc[cur.degree] = cur.id;
    return acc;
  }, {});

  users.forEach((user) => {
    const newUsers = relationFatherAndMotherToUser({
      user,
      degreeMap,
      users,
    });

    users.push(...newUsers);
  });

  const person = [];
  const relation = [];
  const metadata = [];

  users.forEach((user) => {
    person.push({
      id: user.id,
      gender: user.gender,
      name: user.name,
    });

    if (user.mother) {
      relation.push({
        id: `parent-${user.mother.id}-${user.id}`,
        main: user.mother.id,
        second: user.id,
        type: 'parent',
      });
    }
    if (user.father) {
      relation.push({
        id: `parent-${user.father.id}-${user.id}`,
        main: user.father.id,
        second: user.id,
        type: 'parent',
      });
    }

    if (user.father && user.mother) {
      const relationId = `partner-${user.father.id}-${user.mother.id}`;
      if (!relation.find((r) => r.id === relationId)) {
        relation.push({
          id: `partner-${user.father.id}-${user.mother.id}`,
          main: user.father.id,
          second: user.mother.id,
          type: 'partner',
        });
      }
    }

    if (user.birth) {
      metadata.push({
        personId: user.id,
        id: `birthdate_${uid()}`,
        key: 'birthdate',
        value: user.birth,
      });
    }

    if (user.death) {
      metadata.push({
        personId: user.id,
        id: `dateofdeath_${uid()}`,
        key: 'date of death',
        value: user.death,
      });
    }
    if (user.surname) {
      metadata.push({
        personId: user.id,
        id: `surname_${uid()}`,
        key: 'surname',
        value: user.surname,
      });
    }
    if (user.place) {
      metadata.push({
        personId: user.id,
        id: `place_${uid()}`,
        key: 'place',
        value: user.place,
      });
    }

    metadata.push({
      personId: user.id,
      id: `cilt_${uid()}`,
      key: 'cilt',
      value: user.cilt,
    });
  });

  console.log(
    JSON.stringify(
      {
        person,
        relation,
        metadata,
      }
      // null,
      // 2
    )
  );
}
main();
