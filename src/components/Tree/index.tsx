// reference: https://jwcooney.com/2016/08/21/example-pure-css-family-tree-markup/
import React, { useContext, useMemo, useState } from 'react';
import { getPersonTreeByDepth } from '../../helper/builder';
import { PersonTree, PersonType } from '../../types';
import { AppContext } from '../../app/ctx';
import Person from './Person';
import Portal from '../Portal';
import TreeSizeCalc from './TreeSizeCalc';

type TreeProps = {
  person: PersonTree;
  onClick: (person: PersonType) => void;
};

const Tree: React.FC<TreeProps> = ({ person, onClick }) => {
  return (
    <li>
      <div className="tree-wrapper">
        <Person
          personName={person.name}
          gender={person.gender}
          onClick={() => onClick(person)}
        />
        {person.partners.map((pr) => (
          <Person
            personName={pr.name}
            gender={pr.gender}
            onClick={() => onClick(pr)}
            className="inactive-partner"
            key={`${person.id}Partner${pr.id}`}
          />
        ))}
      </div>
      {person.children.length ? (
        <ul>
          {person.children.map((child) => (
            <Tree
              person={child}
              onClick={onClick}
              key={`${person.id}Child${child.id}`}
            />
          ))}
        </ul>
      ) : undefined}
    </li>
  );
};

const Comp = ({
  person,
  onClick,
}: {
  person: PersonType;
  onClick: (person: PersonType) => void;
}) => {
  const { person: personList, relation, treeDepth } = useContext(AppContext);

  const personTree = useMemo(
    () => getPersonTreeByDepth(person, treeDepth, personList, relation),
    [person, personList, relation, treeDepth]
  );

  const [size, setSize] = useState({
    width: 0,
    height: 0,
  });

  const el = (
    <ul>
      <Tree person={personTree} onClick={onClick} />
    </ul>
  );

  return (
    <>
      <div
        className="tree"
        style={{
          minWidth: size.width,
          minHeight: size.height,
        }}
      >
        {el}
      </div>
      <Portal>
        <TreeSizeCalc
          deps={[person, personList, relation, treeDepth]}
          setSize={setSize}
        >
          {el}
        </TreeSizeCalc>
      </Portal>
    </>
  );
};

export default Comp;
