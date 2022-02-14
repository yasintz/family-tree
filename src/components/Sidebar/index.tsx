import React, { useState } from 'react';
import { PersonType } from '../../types';
import style from './Sidebar.module.scss';
import SideItem from './SideItem';

type SidebarProps = {
  person: PersonType[];
  onClick: (person: PersonType) => void;
  onCreatePersonClick: () => void;
};

const Sidebar: React.FC<SidebarProps> = ({
  person,
  onClick,
  onCreatePersonClick,
}) => {
  const [search, setSearch] = useState('');
  return (
    <div className={style.container}>
      <div className={style.createPerson} onClick={onCreatePersonClick}>
        Create Person
      </div>

      <input value={search} onChange={(e) => setSearch(e.target.value)} />
      <div className={style.listContainer}>
        {person
          .filter((i) =>
            !search
              ? true
              : i.name.toLowerCase().indexOf(search.toLowerCase()) > -1
          )
          .map((p) => (
            <SideItem {...p} onClick={() => onClick(p)} key={p.id} />
          ))}
      </div>
    </div>
  );
};

export default Sidebar;
