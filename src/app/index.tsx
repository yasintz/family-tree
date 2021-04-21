import React, { useEffect, useState } from 'react';
import { hh } from '../helper/transformForYFiles';
import Popup from '../components/Popup';
import Sidebar from '../components/Sidebar';
import Tree from '../components/Tree';
import builder from '../helper/builder';
import { Person } from '../types';
import AddRelation from './AddRelation/index';
import RelationFinder from './AddRelation/RelationFinder';
import style from './app.module.scss';
import CreatePerson from './CreatePerson';
import { AppContext } from './ctx';
import useData from './data';

type AppProps = {};

function usePersist<S>(
  key: string,
  initialState: S
): [S, React.Dispatch<React.SetStateAction<S>>] {
  const persist = localStorage.getItem(key);
  const [state, setState] = useState(
    persist ? JSON.parse(persist) : initialState
  );

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(state));
  }, [state, key]);

  return [state, setState];
}

const App: React.FC<AppProps> = () => {
  const [showSidebar] = usePersist('showSidebar', true);
  const [personForRelation, setPersonForRelation] = useState<Person>();
  const [personForUpdate, setPersonForUpdate] = useState<Person>();
  const [showCreatePersonPopup, setShowCreatePersonPopup] = useState(false);
  const [personForTree, setPersonForTree] = useState<Person>();
  const [personForAction, setPersonForAction] = useState<Person>();
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

  hh({ person, relation });
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
        {showSidebar && (
          <div className={style.sidebar}>
            <Sidebar
              person={person}
              onClick={setPersonForAction}
              onCreatePersonClick={() => setShowCreatePersonPopup(true)}
            />
          </div>
        )}
        <div className={style.actionSidebar}>
          {personForAction && (
            <>
              <h5>{personForAction.name}</h5>

              <div>
                <button onClick={() => setPersonForTree(personForAction)}>
                  Open
                </button>

                <button onClick={() => setPersonForRelation(personForAction)}>
                  Edit
                </button>
                <button
                  onClick={() => setPersonSelector({ person: personForAction })}
                >
                  Detail
                </button>
                <button
                  onClick={() => {
                    const { parents } = builder(
                      personForAction,
                      person,
                      relation
                    );

                    if (parents[0]) {
                      setPersonForTree(parents[0]);
                    }
                  }}
                >
                  Open Parent
                </button>
              </div>
            </>
          )}
        </div>
        <div className={style.treeContainer}>
          {personForTree && (
            <Tree person={personForTree} onClick={setPersonForAction} />
          )}
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
      </div>
      <Popup
        open={!!personForUpdate}
        onClose={() => setPersonForUpdate(undefined)}
      >
        {personForUpdate && (
          <CreatePerson
            onSubmit={(name, gender) => {
              updatePerson(personForUpdate.id, { name, gender });
              setPersonForUpdate(undefined)
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
        <RelationFinder
          mainPerson={personSelector?.person}
          onSelect={personSelector?.cb}
        />
      </Popup>
    </AppContext.Provider>
  );
};

export default App;
