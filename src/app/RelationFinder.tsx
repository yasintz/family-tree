import React, { useEffect, useMemo, useRef, useState } from 'react';
import style from './app.module.scss';
import { Person, Relation } from '../types';

type RelationFinderProps = {
  personList: Person[];
  relation: Relation[];

  mainPerson: Person;
  onSelect: (person: Person) => void;
};

function builder(person: Person, personList: Person[], relation: Relation[]) {
  const getPersonById = (id: string) =>
    personList.find((i) => i.id === id) as Person;
  const _getParents = () => {
    return relation
      .filter((r) => r.type === 'parent' && r.second === person.id)
      .map((r) => getPersonById(r.main));
  };

  const _getChildrenByParent = (parentId: string) => {
    return relation
      .filter((r) => r.type === 'parent' && r.main === parentId)
      .map((i) => getPersonById(i.second));
  };

  return {
    parents: _getParents(),
    children: _getChildrenByParent(person.id),
    partners: relation
      .filter(
        (i) =>
          i.type === 'partner' &&
          (i.main === person.id || i.second === person.id)
      )
      .map((r) => (r.main === person.id ? r.second : r.main))
      .map((i) => getPersonById(i)),

    siblings: _getParents()
      .reduce(
        (acc, cur) => (acc.push(..._getChildrenByParent(cur.id)), acc),
        [] as Person[]
      )
      .filter((i) => i.id !== person.id),
  };
}

const RenderPersonList: React.FC<{
  personList: Person[];
  title: string;
  onClick: (person: Person) => void;
}> = ({ personList, title, onClick }) => {
  if (personList.length === 0) {
    return null;
  }
  return (
    <div className={style.personList}>
      <h3>{title}</h3>
      <div>
        {personList.map((person) => (
          <div onClick={() => onClick(person)} key={person.id + title}>
            {person.name}
          </div>
        ))}
      </div>
    </div>
  );
};

const PersonRelation = ({
  person,
  personList,
  relation,
  onClick,
}: {
  person: Person;
  personList: Person[];
  relation: Relation[];
  onClick: (person: Person) => void;
}) => {
  const builded = useMemo(() => builder(person, personList, relation), [
    person,
    relation,
    personList,
  ]);

  return (
    <div className={style.listContainer}>
      <RenderPersonList
        personList={personList}
        title="All Persons"
        onClick={onClick}
      />
      <RenderPersonList
        personList={builded.children}
        title="Children"
        onClick={onClick}
      />
      <RenderPersonList
        personList={builded.parents}
        title="Parents"
        onClick={onClick}
      />
      <RenderPersonList
        personList={builded.siblings}
        title="Sibling"
        onClick={onClick}
      />
      <RenderPersonList
        personList={builded.partners}
        title="Sibling"
        onClick={onClick}
      />
    </div>
  );
};

const RelationFinder: React.FC<RelationFinderProps> = ({
  personList,
  relation,
  mainPerson,
  onSelect,
}) => {
  const [stack, setStack] = useState<Person[]>([]);
  const stackRef = useRef<HTMLDivElement>();
  const lastPerson = stack[stack.length - 1];
  const handleClick = (person: Person) => {
    setStack((prev) => [...prev.filter((i) => i.id !== person.id), person]);
    setTimeout(() => {
      if (stackRef.current) {
        stackRef.current.scrollTo({
          left: stackRef.current.scrollWidth + 10,
          behavior: 'smooth',
        });
      }
    });
  };

  useEffect(() => {
    if (lastPerson) {
      onSelect(lastPerson);
    }
  }, [onSelect, lastPerson]);

  return (
    <div className={style.relationFinder}>
      <div className={style.stackList} ref={stackRef as any}>
        {stack.map((p, index) => (
          <div
            onClick={() =>
              setStack((prev) => {
                const copy = Array.from(prev);
                copy.splice(index, 1);
                return copy;
              })
            }
            key={p.id + 'stack'}
          >
            {p.name}
          </div>
        ))}
      </div>

      <PersonRelation
        onClick={handleClick}
        person={lastPerson || mainPerson}
        personList={personList}
        relation={relation}
      />
    </div>
  );
};

export default RelationFinder;
