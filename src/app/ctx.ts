import React from 'react';
import { Person } from '../types';
import useData from './data';

type ContextType = ReturnType<typeof useData> & {
  showRelationModal: (person: Person) => void;
  showCreatePersonModal: () => void;
  setPersonForTree: (person: Person) => void;
  showPersonSelector: (v: {
    cb: (person: Person) => void;
    person?: Person;
  }) => void;
};

export const AppContext = React.createContext<ContextType>({
  createPerson: () => ({} as Person),
  createRelation: () => 0,
  person: [],
  relation: [],
  showRelationModal: () => 0,
  showCreatePersonModal: () => 0,
  updatePerson: () => 0,
  showPersonSelector: () => 0,
  setPersonForTree: () => 0,
});
