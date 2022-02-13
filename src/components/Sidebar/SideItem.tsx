import * as React from 'react';
import { PersonType } from '../../types';
import style from './Sidebar.module.scss';
import cx from 'classnames';

type SideItemProps = {
  onClick: () => void;
} & PersonType;

const SideItem: React.FC<SideItemProps> = ({ gender, name, onClick }) => {
  return (
    <div
      onClick={onClick}
      className={cx(style.item, {
        [style.female]: gender === 1,
        [style.male]: gender === 0,
      })}
    >
      <span>{name}</span>
    </div>
  );
};

export default SideItem;
