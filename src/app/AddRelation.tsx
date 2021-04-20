import React, { useState } from 'react';
import style from './app.module.scss';
import { Person, Relation, RelationType } from '../types';
import { popupHoc } from '../components/Popup';
import RelationFinder from './RelationFinder';

type AddRelationProps = {
  person?: Person;
  onClose: () => void;
  relation: Relation[];
  personList: Person[];
  createRelation: (type: RelationType, person: Person) => void;
};

const AddRelation: React.FC<AddRelationProps> = ({
  person,
  relation,
  personList,
  createRelation,
}) => {
  const [selectedRelation, setSelectedRelation] = useState<Person>();
  const [relationType, setRelationType] = useState<RelationType>('partner');
  if (!person) {
    return null;
  }
  return (
    <div className={style.addRelationContent}>
      <div>
        <div>Person: {person.name}</div>
        <br />
        <div>Relation: {selectedRelation?.name}</div>
        <br />
        <label>
          Type:&nbsp;
          <select
            onChange={(e) => setRelationType(e.target.value as RelationType)}
          >
            <option value="partner">Partner</option>
            <option value="parent">Parent</option>
            <option value="children">Children</option>
          </select>
        </label>
        <br />
        <br />
        <button
          disabled={!selectedRelation}
          onClick={() =>
            selectedRelation && createRelation(relationType, selectedRelation)
          }
        >
          Create Relation
        </button>
        <br />
        {person.name} {selectedRelation?.name}'nin {relationType}'i
      </div>

      <RelationFinder
        onSelect={setSelectedRelation}
        personList={personList}
        relation={relation}
        mainPerson={person}
      />
    </div>
  );
};

export default popupHoc(AddRelation, (prop) => ({
  open: !!prop.person,
  onClose: prop.onClose,
}));
