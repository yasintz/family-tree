// reference: https://jwcooney.com/2016/08/21/example-pure-css-family-tree-markup/
import React, { useContext, useEffect, useMemo, useState } from 'react';
import ReactDOMServer from 'react-dom/server';
import builder from '../../helper/builder';
import { PersonType, RelationType } from '../../types';
import cx from 'classnames';
import style from './Tree.module.scss';
import { AppContext } from '../../app/ctx';

type TreeProps = {
  person: PersonType;
  personList: PersonType[];
  relation: RelationType[];
  onClick: (person: PersonType) => void;
  depth: number;
};

const genderClass = ['male', 'female'];

const PersonRenderer = ({
  person,
  className,
  onClick,
}: {
  person: PersonType;
  className?: string;
  onClick: () => void;
}) => {
  return (
    <div
      onClick={() => onClick()}
      className={cx(genderClass[person.gender], className)}
    >
      {person.name}
    </div>
  );
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
      <div className="w">
        <PersonRenderer person={person} onClick={() => onClick(person)} />
        {buildedPerson.partners.map((pr) => (
          <PersonRenderer
            person={pr}
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

  // const builded = useMemo(() => builder(person, personList, relation), [
  //   person,
  //   personList,
  //   relation,
  // ]);
  // const { parents } = builded;

  // const anyParent = parents[0];

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

  useEffect(() => {
    const element = (
      <div>
        <ul>
          <li>
            <div className="w">
              <div className="f">Parent</div>
            </div>
            {el}
          </li>
        </ul>
      </div>
    );

    const str = ReactDOMServer.renderToString(element);
    const domItem = document.createElement('div');
    domItem.classList.add(style.sizeWrapper, 'tree');
    domItem.innerHTML = str;
    document.body.appendChild(domItem);

    const div = domItem.children[0];

    const ul = div.children[0];
    const li = ul.children[0];

    const width = div.clientWidth + 50;
    const height = li.clientHeight + 50;

    setSize({ width, height });

    document.body.removeChild(domItem);
    // eslint-disable-next-line
  }, [person, personList, relation, treeDepth]);

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
