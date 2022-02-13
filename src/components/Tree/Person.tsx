import React from 'react';
import cx from 'classnames';

type PersonProps = {
  gender: 0 | 1;
  personName: string;
  className?: string;
  onClick: () => void;
};

const genderClass = ['male', 'female'];

const Person: React.FC<PersonProps> = ({
  onClick,
  personName,
  className,
  gender,
}) => {
  return (
    <div onClick={onClick} className={cx(genderClass[gender], className)}>
      {personName}
    </div>
  );
};

export default Person;
