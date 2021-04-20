import { useEffect, useState } from 'react';
import { Gender, Relation, RelationType, Store } from '../types';
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

  const createPerson = (name: string, gender: Gender) =>
    setPerson((prev) => [
      {
        name,
        gender,
        id: uid(),
      },
      ...prev,
    ]);

  const createRelation = (type: RelationType, main: string, second: string) => {
    const id = uid();
    const d = {
      type: type as any,
      main,
      id,
      second,
    };

    const mapp: Record<RelationType, Relation> = {
      children: {
        type: 'parent',
        main: second,
        id,
        second: main,
      },
      parent: d,
      partner: d,
    };

    setRelation((prev) => [mapp[type], ...prev]);
  };

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify({ person, relation }));
  }, [person, relation]);

  return {
    person,
    relation,
    createPerson,
    createRelation,
  };
}

export default useData;
