import React, { useState } from 'react';
import Popup from '../components/Popup';
import Sidebar from '../components/Sidebar';
import Tree from '../components/Tree';
import { Person } from '../types';
import AddRelation from './AddRelation/index';
import RelationFinder from './RelationDetail';
import style from './app.module.scss';
import CreatePerson from './CreatePerson';
import { AppContext } from './ctx';
import useData from './data';

type AppProps = {};

const App: React.FC<AppProps> = () => {
  const [personForRelation, setPersonForRelation] = useState<Person>();
  const [personForUpdate, setPersonForUpdate] = useState<Person>();
  const [showCreatePersonPopup, setShowCreatePersonPopup] = useState(false);
  const [personForTree, setPersonForTree] = useState<Person>();
  const [personForAction, setPersonForAction] = useState<Person>();
  const [personForDetail, setPersonForDetail] = useState<Person>();
  const {
    relation,
    person,
    createPerson,
    createRelation,
    updatePerson,
  } = useData();
  const [personSelector, setPersonSelector] = useState<{
    cb?: (v: Person) => void;
    person?: Person;
  }>();

  const actions = [
    {
      text: 'Open',
      handler: () => {
        setPersonForDetail(undefined);
        setPersonForTree(personForAction);
      },
    },
    {
      text: 'Relation',
      handler: () => setPersonForRelation(personForAction),
    },
    {
      text: 'Edit',
      handler: () => setPersonForUpdate(personForAction),
    },
    {
      text: 'Detail',
      handler: () => {
        setPersonForDetail(personForAction);
        setPersonForTree(undefined);
      },
    },
  ];

  return (
    <AppContext.Provider
      value={{
        relation,
        person,
        createPerson,
        createRelation,
        showRelationModal: setPersonForRelation,
        updatePerson,
        showCreatePersonModal: () => setShowCreatePersonPopup(true),
        showPersonSelector: setPersonSelector,
        setPersonForTree,
        treeDepth: 3,
      }}
    >
      <div className={style.container}>
        <div className={style.sidebar}>
          <Sidebar
            person={person}
            onClick={(person) => {
              setPersonForAction(person);
              if (!personForTree) {
                setPersonForDetail(person);
              }
            }}
            onCreatePersonClick={() => setShowCreatePersonPopup(true)}
          />
        </div>
        <div className={style.actionSidebar}>
          {personForAction && (
            <>
              <h5>{personForAction.name}</h5>

              <div>
                {actions.map((n) => (
                  <button onClick={n.handler} key={n.text}>
                    {n.text}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
        <div className={style.treeContainer}>
          {personForDetail && (
            <div className={style.relationDetail}>
              <RelationFinder
                mainPerson={personForDetail}
                onSelect={setPersonForAction}
                renderAllPerson={false}
              />
            </div>
          )}
          {!personForDetail && personForTree && (
            <Tree person={personForTree} onClick={setPersonForAction} />
          )}
        </div>
      </div>
      <AddRelation
        person={personForRelation}
        onClose={() => setPersonForRelation(undefined)}
      />
      <Popup
        open={showCreatePersonPopup}
        onClose={() => setShowCreatePersonPopup(false)}
      >
        <CreatePerson
          onSubmit={(name, gender) => {
            createPerson(name, gender);
            setShowCreatePersonPopup(false);
          }}
        />
      </Popup>
      <Popup
        open={!!personForUpdate}
        onClose={() => setPersonForUpdate(undefined)}
      >
        {personForUpdate && (
          <CreatePerson
            onSubmit={(name, gender) => {
              updatePerson(personForUpdate.id, { name, gender });
              setPersonForUpdate(undefined);
            }}
            name={personForUpdate.name}
            gender={personForUpdate.gender}
          />
        )}
      </Popup>
      <Popup
        open={!!personSelector}
        onClose={() => setPersonSelector(undefined)}
      >
        <div style={{ width: 900, height: 400 }}>
          <RelationFinder
            mainPerson={personSelector?.person}
            onSelect={personSelector?.cb}
            renderAllPerson
          />
        </div>
      </Popup>
    </AppContext.Provider>
  );
};

export default App;
