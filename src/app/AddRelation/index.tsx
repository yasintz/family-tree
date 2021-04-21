import React, { useContext, useState } from 'react';
import style from './AddRelation.module.scss';
import { Person, RelationType } from '../../types';
import TypeSelector from '../TypeSelector';
import { AppContext } from '../ctx';
import { popupHoc } from '../../components/Popup';

type AddRelationProps = {
  person?: Person;
  onClose: () => void;
};

type PersonSelectorBoxProps = {
  person?: Person;
  setPerson: (p: Person) => void;
  base: Person;
};

const PersonSelectorBox: React.FC<PersonSelectorBoxProps> = ({
  person,
  setPerson,
  base,
}) => {
  const ctx = useContext(AppContext);
  return (
    <div
      className={style.personSelector}
      onClick={() => ctx.showPersonSelector({ cb: setPerson, person: base })}
    >
      {person?.name || ``}
    </div>
  );
};

type LineItem = {
  type: RelationType;
  main?: Person;
  extra?: Person;
  id: string;
};

type OnLinChange = (value: Partial<LineItem>) => void;

type LineProps = {
  onChange: OnLinChange;
  line: LineItem;
  onRemove: () => void;
  base: Person;
};

const Line: React.FC<LineProps> = ({
  onChange,
  onRemove,
  line: { type, main, extra },
  base,
}) => {
  const isPartner = type === 'partner';
  const hasExtra = !isPartner;

  function cb<T extends keyof LineItem>(name: T) {
    return (val: LineItem[T]) => onChange({ [name]: val });
  }

  return (
    <div>
      <span>{base.name}</span>
      <TypeSelector val={type} onChange={cb('type')} />{' '}
      {isPartner ? 'with ' : 'of '}
      <PersonSelectorBox base={base} person={main} setPerson={cb('main')} />
      {hasExtra && (
        <>
          {' '}
          with
          <PersonSelectorBox
            base={base}
            person={extra}
            setPerson={cb('extra')}
          />
        </>
      )}
      <button onClick={onRemove}>X</button>
    </div>
  );
};

type PersonRendererProps = {
  person: Person;
  onGenerate: (lines: LineItem[]) => void;
};

const PersonRenderer: React.FC<PersonRendererProps> = ({
  person,
  onGenerate,
}) => {
  const ctx = useContext(AppContext);
  const [lines, setLine] = useState<LineItem[]>([
    {
      type: 'parent',
      id: '1',
    },
  ]);
  return (
    <div className={style.personRenderer}>
      <span>{person.name}</span>
      <div className={style.lines}>
        {lines.map((line, index) => (
          <Line
            key={line.id}
            base={person}
            line={line}
            onRemove={() =>
              setLine((prev) => prev.filter((i) => i.id !== line.id))
            }
            onChange={(partial) =>
              setLine((prev) => {
                const newVal = { ...line, ...partial };
                const copy = Array.from(prev);
                copy[index] = newVal;
                return copy;
              })
            }
          />
        ))}
      </div>
      <div>
        <button onClick={() => ctx.showPersonSelector({ person })}>
          Detail
        </button>
        <button
          onClick={() => {
            onGenerate(lines);
            setLine([{ type: 'parent', id: '1' }]);
          }}
        >
          Generate
        </button>
        <button
          onClick={() =>
            setLine((prev) => [
              ...prev,
              {
                id: Math.random().toString(),
                type: 'parent',
              },
            ])
          }
        >
          Add
        </button>
      </div>
    </div>
  );
};

const AddRelation: React.FC<AddRelationProps> = ({ person }) => {
  const { createRelation } = useContext(AppContext);

  const handleGenerate = (lines: LineItem[]) => {
    if (person) {
      const args = (lines.filter((i) => i.main) as {
        main: Person;
        type: RelationType;
        extra?: Person;
      }[]).reduce((acc, cur) => {
        acc.push({
          type: cur.type,
          main: person?.id,
          second: cur.main.id,
        });
        if (cur.extra) {
          if (cur.type === 'children') {
            acc.push({
              type: cur.type,
              main: person.id,
              second: cur.extra.id,
            });
          } else {
            acc.push({
              type: cur.type,
              main: cur.extra.id,
              second: cur.main.id,
            });
          }
        }
        return acc;
      }, [] as { type: RelationType; main: string; second: string }[]);

      createRelation(...args);
    }
  };

  return (
    <div className={style.container}>
      {person && <PersonRenderer onGenerate={handleGenerate} person={person} />}
    </div>
  );
};

export default popupHoc(AddRelation, (prop) => ({
  open: !!prop.person,
  onClose: prop.onClose,
}));
