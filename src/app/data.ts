import { useEffect, useState } from 'react';
import {
  Gender,
  PersonType,
  RelationType,
  RelationValueType,
  StoreType,
} from '../types';
import throttle from 'lodash/throttle';
import turkishToEnglish from '../helper/tr-to-eng';
const uid = () => Math.random().toString(36).substr(2);

const params = new URLSearchParams(window.location.search);
const url = params.get('api') || 'https://api.npoint.io/ae8995c6924d92c556f8';

const db = {
  get: () => fetch(url).then((i) => i.json() as Promise<StoreType>),
  set: throttle(
    (store: StoreType) =>
      fetch(url, {
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

let isFetched = false;
function useData() {
  const [person, setPerson] = useState<PersonType[]>([]);
  const [relation, setRelation] = useState<RelationType[]>([]);

  const createPerson = (name: string, gender: Gender) => {
    const newPerson = {
      name,
      gender,
      id: `${turkishToEnglish(name.split(' ').join(''))}_${gender}_${uid()}`,
    };

    setPerson((prev) => [newPerson, ...prev]);

    return newPerson;
  };

  const updatePerson = (id: string, newPerson: Partial<PersonType>) =>
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
  type RelationParam = {
    type: RelationValueType;
    main: string;
    second: string;
  };

  const handleRelation = ({ main, second, type }: RelationParam) => {
    const d: RelationType = {
      type: type as any,
      main,
      second,
      id: '',
    };

    const mapp: Record<RelationValueType, RelationType> = {
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
      setTimeout(() => {
        isFetched = true;
      }, 1000);
    });
  }, []);

  useEffect(() => {
    if (!isFetched) {
      return;
    }
    const store = {
      person,
      relation,
    };
    db.set(store);
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
