import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import style from './app.module.scss';
import { Person } from '../types';
import cx from 'classnames';
import builder from '../helper/builder';
import { AppContext } from './ctx';

type RelationFinderProps = {
  mainPerson: Person;
  onSelect: (person: Person) => void;
  preview?: boolean;
};

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
  onClick,
  renderAllPerson,
}: {
  person: Person;
  onClick: (person: Person) => void;
  renderAllPerson: boolean;
}) => {
  const { person: personList, relation } = useContext(AppContext);
  const builded = useMemo(() => builder(person, personList, relation), [
    person,
    relation,
    personList,
  ]);

  return (
    <div className={style.listContainer}>
      {renderAllPerson && (
        <RenderPersonList
          personList={personList}
          title="All Persons"
          onClick={onClick}
        />
      )}
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
        title="Partner"
        onClick={onClick}
      />
    </div>
  );
};

const RelationFinder: React.FC<RelationFinderProps> = ({
  mainPerson,
  onSelect,
  preview,
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
    <div
      className={cx(
        style.relationFinder,
        preview && style.relationFinderPreview
      )}
    >
      {!preview && (
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
      )}

      <PersonRelation
        onClick={preview ? () => 0 : handleClick}
        person={lastPerson || mainPerson}
        renderAllPerson={!preview}
      />
    </div>
  );
};

export default RelationFinder;
