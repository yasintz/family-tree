// reference: https://jwcooney.com/2016/08/21/example-pure-css-family-tree-markup/
import React, { useContext, useMemo, useState } from 'react';
import builder from '../../helper/builder';
import { PersonType, RelationType } from '../../types';
import { AppContext } from '../../app/ctx';
import Person from './Person';
import useTree from './useTree';

type TreeProps = {
  person: PersonType;
  personList: PersonType[];
  relation: RelationType[];
  onClick: (person: PersonType) => void;
  depth: number;
};

const TreeRecursive: React.FC<TreeProps> = ({
  person,
  personList,
  relation,
  onClick,
  depth,
}) => {
  const buildedPerson = useMemo(
    () => builder(person, personList, relation),
    [person, personList, relation]
  );

  return (
    <li>
      <div className="tree-wrapper">
        <Person
          personName={person.name}
          gender={person.gender}
          onClick={() => onClick(person)}
        />
        {buildedPerson.partners.map((pr) => (
          <Person
            personName={pr.name}
            gender={pr.gender}
            onClick={() => onClick(pr)}
            className="inactive-partner"
            key={`${person.id}Partner${pr.id}`}
          />
        ))}
      </div>
      {buildedPerson.children.length && depth > 0 ? (
        <ul>
          {buildedPerson.children.map((child) => (
            <TreeRecursive
              person={child}
              personList={personList}
              relation={relation}
              onClick={onClick}
              key={`${person.id}Child${child.id}`}
              depth={depth - 1}
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

  const [size, setSize] = useState({
    width: 0,
    height: 0,
  });
  const el = (
    <ul>
      <TreeRecursive
        personList={personList}
        relation={relation}
        person={person}
        onClick={onClick}
        depth={treeDepth}
      />
    </ul>
  );
  useTree(el, setSize, [person, personList, relation, treeDepth]);

  return (
    <div
      className="tree"
      style={{
        minWidth: size.width,
        minHeight: size.height,
      }}
    >
      {el}
    </div>
  );
};

export default Comp;
