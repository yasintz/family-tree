import * as React from 'react';
import { Person } from '../../types';
import style from './Sidebar.module.scss';
import cx from 'classnames';
import Icon from '../Icon';

type SideItemProps = {
  onClick: () => void;
  onRelationClick: () => void;
  onEdit: () => void;
} & Person;

const SideItem: React.FC<SideItemProps> = ({
  gender,
  name,
  onClick,
  onRelationClick,
  onEdit,
}) => {
  return (
    <div
      onClick={onClick}
      className={cx(style.item, {
        [style.female]: gender === 1,
        [style.male]: gender === 0,
      })}
    >
      <span>{name}</span>
      <div>
        <Icon
          name="Edit"
          size={24}
          className={style.itemAction}
          onClick={onEdit}
        />
        <Icon
          name="Share2"
          size={24}
          className={style.itemAction}
          onClick={onRelationClick}
        />
      </div>
    </div>
  );
};

export default SideItem;
