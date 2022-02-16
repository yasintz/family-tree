import React from 'react';
import { RelationValueType } from '../types';

type TypeSelectorProps = {
  onChange: (v: RelationValueType) => void;
  val: RelationValueType;
};

const TypeSelector: React.FC<TypeSelectorProps> = ({ onChange, val }) => {
  return (
    <select
      onChange={(e) => onChange(e.target.value as RelationValueType)}
      value={val}
    >
      <option value="partner">Partner</option>
      <option value="parent">Parent</option>
      <option value="children">Children</option>
    </select>
  );
};

export default TypeSelector;
