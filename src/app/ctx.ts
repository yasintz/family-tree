import React from 'react';
import { PersonType } from '../types';
import useData from './data';

type ContextType = ReturnType<typeof useData> & {
  showCreatePersonModal: () => void;
  showPersonSelector: (v: {
    cb?: (person: PersonType) => void;
    person?: PersonType;
  }) => void;
  treeDepth: number;
  isDTree: boolean;
};

export const AppContext = React.createContext<ContextType>(
  {} as unknown as ContextType
);
