// reference: https://jwcooney.com/2016/08/21/example-pure-css-family-tree-markup/
import React, { useContext, useEffect, useMemo, useState } from 'react';
import ReactDOMServer from 'react-dom/server';
import builder from '../../helper/builder';
import { Person, Relation } from '../../types';
import cx from 'classnames';
import style from './Tree.module.scss';
import { AppContext } from '../../app/ctx';

type ClickType = 'open' | 'edit';
type TreeProps = {
  person: Person;
  personList: Person[];
  relation: Relation[];
  onClick: (person: Person, type: ClickType) => void;
  depth: number;
};

const genderClass = ['m', 'f'];

const PersonRenderer = ({
  person,
  className,
  onClick,
}: {
  person: Person;
  className?: string;
  onClick: (type: ClickType) => void;
}) => {
  const [showButtons, setShowButtons] = useState(false);
  return (
    <div
      onClick={() => setShowButtons((prev) => !prev)}
      className={cx(genderClass[person.gender], className)}
    >
      {!showButtons && person.name}

      {showButtons && (
        <>
          <button onClick={(e) => (e.stopPropagation(), onClick('open'))}>
            Open
          </button>

          <button onClick={(e) => (e.stopPropagation(), onClick('edit'))}>
            Edit
          </button>
        </>
      )}
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
  const buildedPerson = useMemo(() => builder(person, personList, relation), [
    person,
    personList,
    relation,
  ]);

  return (
    <li>
      <div className="w">
        <PersonRenderer person={person} onClick={(t) => onClick(person, t)} />
        {buildedPerson.partners.map((pr) => (
          <PersonRenderer
            person={pr}
            onClick={(t) => onClick(pr, t)}
            className="pr"
            key={`${person.id}Partner${pr.id}`}
          />
        ))}
      </div>
      {buildedPerson.children.length && depth < 1 ? (
        <ul>
          {buildedPerson.children.map((child) => (
            <TreeRecursive
              person={child}
              personList={personList}
              relation={relation}
              onClick={onClick}
              key={`${person.id}Child${child.id}`}
              depth={depth + 1}
            />
          ))}
        </ul>
      ) : undefined}
    </li>
  );
};

export default ({ person }: { person: Person }) => {
  const {
    person: personList,
    relation,
    showRelationModal,
    setPersonForTree,
  } = useContext(AppContext);

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
        onClick={(p, type) => {
          switch (type) {
            case 'edit':
              showRelationModal(p);
              return;
            case 'open':
              setPersonForTree(p);
              return;
          }
        }}
        depth={0}
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
  }, [person, personList, relation]);

  return (
    <div
      className="tree"
      style={{
        minWidth: size.width,
        minHeight: size.height,
        transform: 'translateX(11%)',
      }}
    >
      {el}
    </div>
  );
};
