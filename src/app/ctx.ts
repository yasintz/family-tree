import React from 'react';
import { MetadataType, PersonType } from '../types';
import useData from './data';

type ContextType = ReturnType<typeof useData> & {
  showCreatePersonModal: () => void;
  showPersonSelector: (v: {
    cb?: (person: PersonType) => void;
    person?: PersonType;
  }) => void;
  treeDepth: number;
};

export const AppContext = React.createContext<ContextType>({
  createPerson: () => ({} as PersonType),
  createRelation: () => 0,
  person: [],
  relation: [],
  showCreatePersonModal: () => 0,
  updatePerson: () => 0,
  showPersonSelector: () => 0,
  treeDepth: 3,
  metadata: [],
  createMetadata: () => ({} as MetadataType),
  updateMetadata: () => 0,
  deletePerson: () => 0,
  store: {} as any,
});
