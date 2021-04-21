import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import style from './RelationFinder.module.scss';
import { Person } from '../../types';
import cx from 'classnames';
import builder from '../../helper/builder';
import { AppContext } from '../ctx';

type RelationFinderProps = {
  mainPerson?: Person;
  onSelect?: (person: Person) => void;
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
  person?: Person;
  onClick: (person: Person) => void;
  renderAllPerson: boolean;
}) => {
  const [search, setSearch] = useState('');
  const { person: personList, relation, showCreatePersonModal } = useContext(
    AppContext
  );
  const builded = useMemo(
    () => (person ? builder(person, personList, relation) : null),
    [person, relation, personList]
  );

  return (
    <div className={style.listContainer}>
      {renderAllPerson && (
        <div className={style.allPerson}>
          <div>
            <button onClick={() => showCreatePersonModal()}>
              Create Person
            </button>
          </div>
          <div>
            <input value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <RenderPersonList
            personList={personList.filter((i) =>
              !search
                ? true
                : i.name.toLowerCase().indexOf(search.toLowerCase()) > -1
            )}
            title="All Persons"
            onClick={onClick}
          />
        </div>
      )}
      {builded && (
        <>
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
        </>
      )}
    </div>
  );
};

const RelationFinder: React.FC<RelationFinderProps> = ({
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
    if (lastPerson && onSelect) {
      onSelect(lastPerson);
    }
  }, [onSelect, lastPerson]);

  return (
    <div className={cx(style.relationFinder)}>
      <div className={style.stackList} ref={stackRef as any}>
        {stack.map((p, index) => (
          <div
            onDoubleClick={() =>
              setStack((prev) => {
                const copy = Array.from(prev);
                copy.splice(index, 1);
                return copy;
              })
            }
            onClick={onSelect ? () => handleClick(p) : undefined}
            key={p.id + 'stack'}
          >
            {p.name}
          </div>
        ))}
      </div>

      <PersonRelation
        renderAllPerson={!!onSelect}
        onClick={handleClick}
        person={lastPerson || mainPerson}
      />
    </div>
  );
};

export default RelationFinder;
