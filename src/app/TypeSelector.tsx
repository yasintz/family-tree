import React from 'react';
import { RelationType } from '../types';

type TypeSelectorProps = {
  onChange: (v: RelationType) => void;
  val: RelationType;
  hideText?: boolean;
};

const TypeSelector: React.FC<TypeSelectorProps> = ({
  onChange,
  val,
  hideText,
}) => {
  return (
    <label>
      {!hideText && <>Type:&nbsp;</>}
      <select
        onChange={(e) => onChange(e.target.value as RelationType)}
        value={val}
      >
        <option value="partner">Partner</option>
        <option value="parent">Parent</option>
        <option value="children">Children</option>
      </select>
    </label>
  );
};

export default TypeSelector;
