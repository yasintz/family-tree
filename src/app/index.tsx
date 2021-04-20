import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import Tree from '../components/Tree';
import { Person } from '../types';
import AddRelation from './AddRelation';
import style from './app.module.scss';
import CreatePerson from './CreatePerson';
import useData from './data';

type AppProps = {};

const App: React.FC<AppProps> = (props) => {
  const [personForRelation, setPersonForRelation] = useState<Person>();
  const [showCreatePersonPopup, setShowCreatePersonPopup] = useState(false);
  const { relation, person, createPerson, createRelation } = useData();

  return (
    <div className={style.container}>
      <div className={style.sidebar}>
        <Sidebar
          person={person}
          onRelationClick={setPersonForRelation}
          onOpen={() => 0}
          onCreatePersonClick={() => setShowCreatePersonPopup(true)}
        />
      </div>
      <div className={style.treeContainer}>
        <Tree />
      </div>

      <AddRelation
        person={personForRelation}
        onClose={() => setPersonForRelation(undefined)}
        personList={person}
        relation={relation}
        createRelation={(type, second) =>
          personForRelation &&
          createRelation(type, personForRelation.id, second.id)
        }
      />
      <CreatePerson
        open={showCreatePersonPopup}
        onClose={() => setShowCreatePersonPopup(false)}
        onPersonCreate={(name, gender) => (
          createPerson(name, gender), setShowCreatePersonPopup(false)
        )}
      />
    </div>
  );
};

export default App;
