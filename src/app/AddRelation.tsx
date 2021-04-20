import React, { useContext, useState } from 'react';
import cx from 'classnames';
import style from './app.module.scss';
import { Person, RelationType } from '../types';
import { popupHoc } from '../components/Popup';
import RelationFinder from './RelationFinder';
import { AppContext } from './ctx';
import CreatePerson from './CreatePerson';
import TypeSelector from './TypeSelector';

type AddRelationProps = {
  person?: Person;
  onClose: () => void;
};

const AddRelation: React.FC<AddRelationProps> = ({ person }) => {
  const { createRelation, createPerson } = useContext(AppContext);
  const [selectedRelation, setSelectedRelation] = useState<Person>();
  const [relationType, setRelationType] = useState<RelationType>('partner');
  if (!person) {
    return null;
  }
  return (
    <div className={style.addRelationContent}>
      <div className={style.addRelationContentTop}>
        <div>
          <div>Person: {person.name}</div>
          <br />
          <div>Relation: {selectedRelation?.name}</div>
          <br />
          <TypeSelector val={relationType} onChange={setRelationType} />
          <br />
          <br />
          <button
            disabled={!selectedRelation}
            onClick={() =>
              selectedRelation &&
              createRelation(relationType, person.id, selectedRelation.id)
            }
          >
            Create Relation
          </button>
          <br />
          <br />
          {person.name} {selectedRelation?.name || '$'} 'nin {relationType}'i
        </div>
        <div>
          <CreatePerson
            onSubmit={(name, gender) =>
              setSelectedRelation(createPerson(name, gender))
            }
          />
        </div>
      </div>

      <RelationFinder onSelect={() => 0} mainPerson={person} preview />

      <RelationFinder onSelect={setSelectedRelation} mainPerson={person} />
    </div>
  );
};

export default popupHoc(AddRelation, (prop) => ({
  open: !!prop.person,
  onClose: prop.onClose,
}));
