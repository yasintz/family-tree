import React from 'react';
import { PersonType } from '../types';
import useData from './data';

type ContextType = ReturnType<typeof useData> & {
  showRelationModal: (person: PersonType) => void;
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
  showRelationModal: () => 0,
  showCreatePersonModal: () => 0,
  updatePerson: () => 0,
  showPersonSelector: () => 0,
  treeDepth: 3,
});
