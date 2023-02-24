import React, { useEffect, useRef } from 'react';
import dTree, { personTreeToDTree } from '../../helper/dtree';
import { generateId } from '../../helper/generate-id';
import { PersonTreeType, StoreType } from '../../types';

type DTreeProps = {
  person: PersonTreeType;
  store: StoreType;
  depth: number;
};

const DTree = ({ person, store, depth }: DTreeProps) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) {
      return;
    }

    Array.from(ref.current.children).forEach((child) => {
      child.remove();
    });

    const child = document.createElement('div');
    child.id = generateId(5, 'a');

    ref.current.appendChild(child);

    dTree.init([personTreeToDTree(person, store, depth)], {
      target: `#${child.id}`,
    });
  }, [person, person.name, store, depth]);

  return <div ref={ref} />;
};

export default DTree;
