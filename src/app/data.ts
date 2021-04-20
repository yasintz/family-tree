import { useEffect, useState } from 'react';
import { Gender, Person, Relation, RelationType, Store } from '../types';
const uid = () => Math.random().toString(36).substr(2);

const empty = {
  person: [],
  relation: [],
};

const key = '__ft__';
const persist = JSON.parse(localStorage.getItem(key) || JSON.stringify(empty));

localStorage.setItem(key, JSON.stringify(persist));
const initialState: Store = persist;

function useData() {
  const [person, setPerson] = useState(initialState.person);
  const [relation, setRelation] = useState(initialState.relation);

  const createPerson = (name: string, gender: Gender) => {
    const newPerson = {
      name,
      gender,
      id: uid(),
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

  const createRelation = (type: RelationType, main: string, second: string) => {
    if (main === second) {
      return;
    }

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
    newRelation.id = `${newRelation.type}${newRelation.main}${newRelation.second}`;

    setRelation((prev) =>
      prev.findIndex((el) => el.id === newRelation.id) > -1
        ? prev
        : [...prev, newRelation]
    );
  };

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify({ person, relation }));
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
