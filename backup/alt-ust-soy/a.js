const _ = require('lodash');
const temp1 = require('./mehmet.json');

const uniqueId = 'Cilt-Hane-Birey Sıra No';

const uid = () => Math.random().toString(36).substring(2, 12);

const turkishToEnglish = (val) => {
  return val
    .replace(/Ğ/g, 'G')
    .replace(/ğ/g, 'g')
    .replace(/Ü/g, 'U')
    .replace(/ü/g, 'u')
    .replace(/Ş/g, 'S')
    .replace(/ş/g, 's')
    .replace(/İ/g, 'I')
    .replace(/ı/g, 'i')
    .replace(/Ö/g, 'O')
    .replace(/ö/g, 'o')
    .replace(/Ç/g, 'C')
    .replace(/ç/g, 'c');
};

function convert(element) {
  element.name = `${element['Adı']}`;
  element.idn = turkishToEnglish(element.name.split(' ').join(''));
  element.birth = ((element['Doğum Yeri ve Tarihi'] || '').split('\n')[1] || '')
    .trim()
    .replace('-', '');

  element.death = ((element['Durumu'] || '').split('\n')[1] || '')
    .trim()
    .replace('-', '');

  element.gender = element.C === 'E' ? 0 : 1;

  element.id = `${element.idn}_${element.gender}_${uid()}`;
  return element;
}

function getRelationsByNode(relation, node, list) {
  const ek = node.C === 'K' ? 'nin' : 'nın';
  const motherKey = `${relation}${ek} Annesi`;
  const fatherKey = `${relation}${ek} Babası`;
  node.mother = list[motherKey];
  node.father = list[fatherKey];

  if (!node.mother) {
    list[motherKey] = convert({
      Adı: node['Ana Adı'],
      C: 'K',
      Soyadı: '',
    });
    node.mother = list[motherKey];
  }
  if (!node.father) {
    list[fatherKey] = convert({
      C: 'E',
      Adı: node['Baba Adı'],
      Soyadı: '',
    });
    node.father = list[fatherKey];
  }
}

const converted = temp1.map(convert);
const byUnique = _.groupBy(converted, uniqueId);
const result = converted.reduce((acc, cur) => {
  cur.id = byUnique[cur[uniqueId]][0].id;
  acc[cur['Yakınlık Derecesi']] = cur;
  return acc;
}, {});

Object.keys(result).forEach((r) => getRelationsByNode(r, result[r], result));

const person = [];
const relation = [];
const metadata = [];

_.uniqBy(Object.values(result), 'id').forEach((p) => {
  person.push({
    id: p.id,
    gender: p.gender,
    name: p.name,
  });

  if (p.mother) {
    relation.push({
      id: `parent-${p.mother.id}-${p.id}`,
      main: p.mother.id,
      second: p.id,
      type: 'parent',
    });
  }
  if (p.father) {
    relation.push({
      id: `parent-${p.father.id}-${p.id}`,
      main: p.father.id,
      second: p.id,
      type: 'parent',
    });
  }

  if (p.father && p.mother) {
    relation.push({
      id: `partner-${p.father.id}-${p.mother.id}`,
      main: p.father.id,
      second: p.mother.id,
      type: 'partner',
    });
  }

  if (p.birth) {
    metadata.push({
      personId: p.id,
      id: `birthdate_${uid()}`,
      key: 'birthdate',
      value: p.birth,
    });
  }

  if (p.death) {
    metadata.push({
      personId: p.id,
      id: `dateofdeath_${uid()}`,
      key: 'date of death',
      value: p.death,
    });
  }
  if (p['Soyadı']) {
    metadata.push({
      personId: p.id,
      id: `surname_${uid()}`,
      key: 'surname',
      value: p['Soyadı'],
    });
  }
  metadata.push({
    personId: p.id,
    id: `surname_${uid()}`,
    key: 'cilt',
    value: p[uniqueId],
  });
});

console.log(
  JSON.stringify({
    person: person.filter(
      (p) =>
        relation.filter((r) => r.main === p.id || r.second === p.id).length > 0
    ),
    relation,
    metadata,
  })
);
