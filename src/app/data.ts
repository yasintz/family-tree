import uniqBy from 'lodash/uniqBy';
import { useEffect, useMemo, useState } from 'react';
import { MetadataType, PersonType, RelationType, StoreType } from '../types';
import throttle from 'lodash/throttle';

import { useActions } from './data/useActions';

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
  const personState = useState<PersonType[]>([]);
  const relationState = useState<RelationType[]>([]);
  const metadataState = useState<MetadataType[]>([]);

  const {
    createPerson,
    createRelation,
    updatePerson,
    createMetadata,
    updateMetadata,
    deletePerson,
  } = useActions({
    personState,
    relationState,
    metadataState,
  });
  // const [store, setStore]= useState<StoreType>({
  //   person:[],
  //   metadata: [],
  //   relation: []
  // })

  const [person, setPerson] = personState;
  const [relation, setRelation] = relationState;
  const [metadata, setMetadata] = metadataState;
  const store: StoreType = useMemo(
    () => ({
      person,
      relation,
      metadata,
    }),
    [metadata, person, relation]
  );

  useEffect(() => {
    getPromise.then((store) => {
      setPerson(store.person);
      setRelation(uniqBy(store.relation, (r) => r.type + r.main + r.second));
      setMetadata(store.metadata);
      setTimeout(() => {
        isFetched = true;
      }, 1000);
    });
  }, [setMetadata, setPerson, setRelation]);

  useEffect(() => {
    if (!isFetched) {
      return;
    }

    db.set(store);
  }, [store]);

  return {
    store,
    person,
    relation,
    metadata,
    createPerson,
    createRelation,
    updatePerson,
    createMetadata,
    updateMetadata,
    deletePerson,
  };
}

export default useData;
