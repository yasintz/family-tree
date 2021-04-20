import React, { useEffect, useState } from 'react';
import Popup from '../components/Popup';
import Sidebar from '../components/Sidebar';
import Tree from '../components/Tree';
import { Person } from '../types';
import AddRelation from './AddRelation';
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
  }, [state]);

  return [state, setState];
}

const App: React.FC<AppProps> = () => {
  const [showSidebar, setShowSideBar] = usePersist('showSidebar', false);
  const [personForRelation, setPersonForRelation] = useState<Person>();
  const [personForUpdate, setPersonForUpdate] = useState<Person>();
  const [showCreatePersonPopup, setShowCreatePersonPopup] = useState(false);
  const [personForTree, setPersonForTree] = useState<Person>();
  const {
    relation,
    person,
    createPerson,
    createRelation,
    updatePerson,
  } = useData();

  return (
    <AppContext.Provider
      value={{
        relation,
        person,
        createPerson,
        createRelation,
        showRelationModal: setPersonForRelation,
        updatePerson,
      }}
    >
      <div className={style.container}>
        <button
          onClick={() => setShowSideBar((prev) => !prev)}
          className={style.sidebarToggle}
        >
          {showSidebar ? 'Hide' : 'Show'} Sidebar
        </button>

        {showSidebar && (
          <div className={style.sidebar}>
            <Sidebar
              person={person}
              onRelationClick={setPersonForRelation}
              onOpen={setPersonForTree}
              onCreatePersonClick={() => setShowCreatePersonPopup(true)}
              onEdit={setPersonForUpdate}
            />
          </div>
        )}
        <div className={style.treeContainer}>
          {personForTree && <Tree person={personForTree} />}
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
            onSubmit={(name, gender) => (
              createPerson(name, gender), setShowCreatePersonPopup(false)
            )}
          />
        </Popup>
      </div>
      <Popup
        open={!!personForUpdate}
        onClose={() => setPersonForUpdate(undefined)}
      >
        {personForUpdate && (
          <CreatePerson
            onSubmit={(name, gender) => (
              updatePerson(personForUpdate.id, { name, gender }),
              setPersonForUpdate(undefined)
            )}
            name={personForUpdate.name}
            gender={personForUpdate.gender}
          />
        )}
      </Popup>
    </AppContext.Provider>
  );
};

export default App;
