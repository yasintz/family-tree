import { useEffect, useState } from 'react';
import { Gender, Person, Relation, RelationType, Store } from '../types';
import throttle from 'lodash.throttle';
const uid = () => Math.random().toString(36).substr(2);

const db = {
  get: () =>
    fetch('https://api.npoint.io/ae8995c6924d92c556f8').then(
      (i) => i.json() as Promise<Store>
    ),
  set: throttle(
    (store: Store) =>
      fetch('https://api.npoint.io/ae8995c6924d92c556f8', {
        method: 'post',
        headers: {
          Accept: 'application/json, text/plain, */*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(store),
      }).then((res) => res.json()),
    1000
  ),
};

const getPromise = db.get();

function useData() {
  const [person, setPerson] = useState<Person[]>([]);
  const [relation, setRelation] = useState<Relation[]>([]);

  const createPerson = (name: string, gender: Gender) => {
    const newPerson = {
      name,
      gender,
      id: `${name.split(' ').join('')}_${gender}_${uid()}`,
    };

    setPerson((prev) => [newPerson, ...prev]);

    return newPerson;
  };

  const updatePerson = (id: string, newPerson: Partial<Person>) =>
    setPerson((prev) => {
      const prs = prev.findIndex((p) => p.id === id);

      if (prs === -1) {
        return prev;
      }

      const prevPerson = prev[prs];
      const newItem = {
        ...prevPerson,
        ...newPerson,
        id,
      };

      const arrayCopy = Array.from(prev);
      arrayCopy[prs] = newItem;

      return arrayCopy;
    });
  type RelationParam = { type: RelationType; main: string; second: string };

  const handleRelation = ({ main, second, type }: RelationParam) => {
    const d: Relation = {
      type: type as any,
      main,
      second,
      id: '',
    };

    const mapp: Record<RelationType, Relation> = {
      children: {
        type: 'parent',
        main: second,
        id: '',
        second: main,
      },
      parent: d,
      partner: d,
    };

    const newRelation = mapp[type];
    newRelation.id = `${newRelation.type}-${newRelation.main}-${newRelation.second}`;
    return newRelation;
  };

  const createRelation = (...args: Array<RelationParam>) => {
    setRelation((prev) => [
      ...prev,
      ...args
        .filter((i) => i.main !== i.second)
        .map(handleRelation)
        .filter((rel) => prev.findIndex((a) => a.id === rel.id) === -1),
    ]);
  };

  useEffect(() => {
    getPromise.then((store) => {
      setPerson(store.person);
      setRelation(store.relation);
    });
  }, []);

  useEffect(() => {
    const store = {
      person,
      relation,
    };
    getPromise.then(() => db.set(store));
  }, [person, relation]);

  return {
    person,
    relation,
    createPerson,
    createRelation,
    updatePerson,
  };
}

export default useData;
