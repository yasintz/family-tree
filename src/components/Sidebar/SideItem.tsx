import * as React from 'react';
import { Person } from '../../types';
import style from './Sidebar.module.scss';
import cx from 'classnames';
import Icon from '../Icon';

type SideItemProps = {
  onClick: () => void;
  onRelationClick: () => void;
  onEdit: () => void;
  onShowDetail: () => void;
} & Person;

const SideItem: React.FC<SideItemProps> = ({
  gender,
  name,
  onClick,
  onRelationClick,
  onEdit,
  onShowDetail,
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
          name="HardDrive"
          size={20}
          className={style.itemAction}
          onClick={(e) => (e.stopPropagation(), onShowDetail())}
        />
        <Icon
          name="Edit"
          size={20}
          className={style.itemAction}
          onClick={(e) => (e.stopPropagation(), onEdit())}
        />
        <Icon
          name="Share2"
          size={20}
          className={style.itemAction}
          onClick={(e) => (e.stopPropagation(), onRelationClick())}
        />
      </div>
    </div>
  );
};

export default SideItem;
