// reference: https://jwcooney.com/2016/08/21/example-pure-css-family-tree-markup/
import React, { useContext, useEffect, useMemo, useState } from 'react';
import ReactDOMServer from 'react-dom/server';
import builder from '../../helper/builder';
import { Person, Relation } from '../../types';
import cx from 'classnames';
import Portal from '../Portal';
import style from './Tree.module.scss';
import { AppContext } from '../../app/ctx';

type TreeProps = {
  person: Person;
  personList: Person[];
  relation: Relation[];
};

const genderClass = ['m', 'f'];

const PersonRenderer = ({
  person,
  className,
}: {
  person: Person;
  className?: string;
}) => (
  <div className={cx(genderClass[person.gender], className)}>{person.name}</div>
);

const TreeRecursive: React.FC<TreeProps> = ({
  person,
  personList,
  relation,
}) => {
  const buildedPerson = useMemo(() => builder(person, personList, relation), [
    person,
    personList,
    relation,
  ]);

  return (
    <li>
      <div className="w">
        <PersonRenderer person={person} />
        {buildedPerson.partners.map((pr) => (
          <PersonRenderer
            person={pr}
            className="pr"
            key={`${person.id}Partner${pr.id}`}
          />
        ))}
      </div>
      {buildedPerson.children.length ? (
        <ul>
          {buildedPerson.children.map((child) => (
            <TreeRecursive
              person={child}
              personList={personList}
              relation={relation}
              key={`${person.id}Child${child.id}`}
            />
          ))}
        </ul>
      ) : undefined}
    </li>
  );
};

export default ({ person }: { person: Person }) => {
  const { person: personList, relation } = useContext(AppContext);

  const props = {
    personList,
    relation,
    person,
  };

  const [size, setSize] = useState({
    width: 0,
    height: 0,
  });
  const el = (
    <ul>
      <TreeRecursive {...props} />
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

    const domItem = document.createElement('div');
    domItem.classList.add(style.sizeWrapper, 'tree');
    domItem.innerHTML = ReactDOMServer.renderToString(element);
    document.body.appendChild(domItem);

    const div = domItem.children[0];
    const ul = div.children[0];
    const li = ul.children[0];
    const width = div.clientWidth;
    const height = li.clientHeight;

    setSize({ width, height });

    document.body.removeChild(domItem);
  }, [props.person, props.personList, props.relation]);

  return (
    <div className="tree" style={size}>
      {el}
    </div>
  );
};
