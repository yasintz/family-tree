import React, { useState } from 'react';
import { PersonTreeType, PersonType } from '../../types';
import Person from './Person';
import Portal from '../Portal';
import TreeSizeCalc from './TreeSizeCalc';

type PersonTreeProps = {
  person: PersonTreeType;
  onClick: (person: PersonType) => void;
  child?: boolean;
};

const PersonTree: React.FC<PersonTreeProps> = ({ person, onClick, child }) => {
  const content = (
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
            <PersonTree
              person={child}
              onClick={onClick}
              key={`${person.id}Child${child.id}`}
              child
            />
          ))}
        </ul>
      ) : undefined}
    </li>
  );

  if (child) {
    return content;
  }

  return <ul>{content}</ul>;
};

type TreeProps = {
  person: PersonTreeType;
  onClick: (person: PersonType) => void;
};

const Tree: React.FC<TreeProps> = ({ person, onClick }) => {
  const [size, setSize] = useState({
    width: 0,
    height: 0,
  });

  const el = <PersonTree person={person} onClick={onClick} />;

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
        <TreeSizeCalc deps={[person]} setSize={setSize}>
          {el}
        </TreeSizeCalc>
      </Portal>
    </>
  );
};

export default Tree;
