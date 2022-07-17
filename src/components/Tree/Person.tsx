import React from 'react';
import cx from 'classnames';
import styled from 'styled-components';

const StyledPerson = styled.div<{ $highlight?: boolean }>`
  ${(props) =>
    props.$highlight ? `background-color: #68cd4f !important;` : ''}
`;

type PersonProps = {
  id: string;
  gender: 0 | 1;
  personName: string;
  className?: string;
  onClick: () => void;
  highlight?: boolean;
};

const genderClass = ['male', 'female'];

const Person: React.FC<PersonProps> = ({
  personName,
  className,
  gender,
  highlight,
  onClick,
}) => {
  return (
    <StyledPerson
      onClick={onClick}
      className={cx(genderClass[gender], className)}
      $highlight={highlight}
    >
      {personName}
    </StyledPerson>
  );
};

export default Person;
