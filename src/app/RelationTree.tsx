import React, { useContext, useMemo, useRef, useState } from 'react';
import styled from 'styled-components';
import Tree from '../components/Tree';
import builder from '../helper/builder';
import { PersonTreeType, PersonType } from '../types';
import { AppContext } from './ctx';
import _ from 'lodash';
import style from './RelationDetail/RelationDetail.module.scss';

const StyledRelationTreeContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const StyledWrapper = styled.div`
  width: 100%;
  overflow: scroll;
  height: 100%;
`;

type PersonRelationProps = {
  person: PersonType;
  onClick?: (person: PersonType) => void;
};

const PersonRelation: React.FC<PersonRelationProps> = ({ person, onClick }) => {
  const { person: personList, relation } = useContext(AppContext);

  const builded = useMemo(
    () => builder(person, personList, relation),
    [person, relation, personList]
  );

  const parent = builded.parents[0];

  const personAsChild = useMemo<PersonTreeType>(
    () => ({
      ...person,
      highlight: true,
      children: builded.children.map((child) => ({
        ...child,
        children: [],
        partners: [],
      })),
      partners: builded.partners,
    }),
    [builded.children, builded.partners, person]
  );
  const tree = useMemo<PersonTreeType>(
    () => ({
      ...(parent || person),
      highlight: !parent,
      partners: parent
        ? builded.parents.filter((p) => p.id !== parent.id)
        : builded.partners,

      children: _.sortBy(
        [
          ...(parent ? builded.siblings : builded.children).map((c) => ({
            ...c,
            children: [],
            partners: [],
          })),
          ...(parent ? [personAsChild] : []),
        ],
        'name'
      ),
    }),
    [
      builded.children,
      builded.parents,
      builded.partners,
      builded.siblings,
      parent,
      person,
      personAsChild,
    ]
  );

  return <Tree person={tree} onClick={onClick} />;
};

type RelationTreeProps = {
  mainPerson: PersonType;
  onSelect: (person: PersonType) => void;
};

const RelationTree: React.FC<RelationTreeProps> = ({
  mainPerson,
  onSelect,
}) => {
  const [stack, setStack] = useState<PersonType[]>([mainPerson]);
  const stackRef = useRef<HTMLDivElement>(null);

  const lastPerson = stack[stack.length - 1];

  const handleClick = (person: PersonType) => {
    setStack((prev) => [...prev.filter((i) => i.id !== person.id), person]);
    onSelect(person);
    setTimeout(() => {
      if (stackRef.current) {
        stackRef.current.scrollTo({
          left: stackRef.current.scrollWidth + 10,
          behavior: 'smooth',
        });
      }
    });
  };

  return (
    <StyledRelationTreeContainer>
      <div className={style.stackList} ref={stackRef}>
        {stack.map((p, index) => (
          <div onClick={() => handleClick(p)} key={p.id + 'stack'}>
            {p.name}
            {index > 0 && (
              <span
                onClick={(e) => {
                  e.stopPropagation();
                  setStack((prev) => {
                    const copy = Array.from(prev);
                    copy.splice(index, 1);
                    return copy;
                  });
                }}
              >
                x
              </span>
            )}
          </div>
        ))}
      </div>

      <StyledWrapper>
        <PersonRelation person={lastPerson} onClick={handleClick} />
      </StyledWrapper>
    </StyledRelationTreeContainer>
  );
};

export default RelationTree;
