import React, { useEffect, useRef } from 'react';
import dTree, { personTreeToDTree } from '../../helper/dtree';
import { generateId } from '../../helper/generate-id';
import { PersonTreeType, PersonType, StoreType } from '../../types';

type DTreeProps = {
  person: PersonTreeType;
  store: StoreType;
  depth: number;
  onClick?: (person: PersonType) => void;
};

const DTree = ({ person, store, depth, onClick }: DTreeProps) => {
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
      callbacks: {
        // @ts-ignore
        nodeClick: (name, extra) => {
          const id = extra.id;
          const clickedPerson = store.person.find((i) => i.id === id);
          if (clickedPerson) {
            onClick?.(clickedPerson);
          }
        },
      },
    });
  }, [person, person.name, store, depth, onClick]);

  return <div ref={ref} className="dtree-container" />;
};

export default DTree;
