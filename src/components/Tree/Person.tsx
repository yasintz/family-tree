import React from 'react';
import cx from 'classnames';

type PersonProps = {
  name: string;
  gender: 0 | 1;
  className?: string;
  onClick: () => void;
};
const genderClass = ['m', 'f'];
const Person: React.FC<PersonProps> = ({
  className,
  name,
  gender,
  onClick,
}) => {
  return (
    <div onClick={onClick} className={cx(genderClass[gender], className)}>
      {name}
    </div>
  );
};

export default Person;
