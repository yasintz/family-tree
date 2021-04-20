import React from 'react';
import { Person } from '../../types';
import style from './Sidebar.module.scss';
import SideItem from './SideItem';

type SidebarProps = {
  person: Person[];
  onRelationClick: (person: Person) => void;
  onOpen: (person: Person) => void;
  onEdit: (person: Person) => void;
  onCreatePersonClick: () => void;
};

const Sidebar: React.FC<SidebarProps> = ({
  person,
  onOpen,
  onRelationClick,
  onCreatePersonClick,
  onEdit,
}) => {
  return (
    <div className={style.container}>
      <div className={style.createPerson} onClick={onCreatePersonClick}>
        Create Person
      </div>
      <div className={style.listContainer}>
        {person.map((p) => (
          <SideItem
            {...p}
            onClick={() => onOpen(p)}
            onEdit={() => onEdit(p)}
            onRelationClick={() => onRelationClick(p)}
            key={p.id}
          />
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
