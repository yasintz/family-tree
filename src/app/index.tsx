import React, { useMemo, useState } from 'react';
import Popup from '../components/Popup';
import Sidebar from '../components/Sidebar';
import Tree from '../components/Tree';
import { PersonType } from '../types';
import AddRelation from './AddRelation/index';
import RelationFinder from './RelationDetail';
import style from './app.module.scss';
import CreatePerson from './CreatePerson';
import { AppContext } from './ctx';
import useData from './data';
import { getPersonTreeByDepth } from '../helper/builder';

type AppProps = {};

const App: React.FC<AppProps> = () => {
  const [personForRelation, setPersonForRelation] = useState<PersonType>();
  const [personForUpdate, setPersonForUpdate] = useState<PersonType>();
  const [showCreatePersonPopup, setShowCreatePersonPopup] = useState(false);
  const [personForTree, setPersonForTree] = useState<PersonType>();
  const [personForAction, setPersonForAction] = useState<PersonType>();
  const [personForDetail, setPersonForDetail] = useState<PersonType>();
  const [treeDepth, setTreeDepth] = useState<number>(3);
  const { relation, person, createPerson, createRelation, updatePerson } =
    useData();
  const [personSelector, setPersonSelector] = useState<{
    cb?: (v: PersonType) => void;
    person?: PersonType;
  }>();

  const personTree = useMemo(
    () =>
      personForTree
        ? getPersonTreeByDepth(personForTree, treeDepth, person, relation)
        : null,
    [person, personForTree, relation, treeDepth]
  );

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
        treeDepth,
      }}
    >
      <div className={style.container}>
        <div className={style.sidebar}>
          <label>
            Depth:
            <input
              type="number"
              value={treeDepth.toString()}
              onChange={(e) => setTreeDepth(parseInt(e.target.value))}
            />
          </label>
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
          {!personForDetail && personTree && (
            <Tree person={personTree} onClick={setPersonForAction} />
          )}
        </div>
      </div>
      <AddRelation
        person={personForRelation}
        onClose={() => setPersonForRelation(undefined)}
      />
      <Popup
        open={showCreatePersonPopup || !!personForUpdate}
        onClose={() => {
          setShowCreatePersonPopup(false);
          setPersonForUpdate(undefined);
        }}
      >
        <CreatePerson
          onSubmit={(name, gender) => {
            if (showCreatePersonPopup) {
              createPerson(name, gender);
            } else if (personForUpdate) {
              updatePerson(personForUpdate.id, { name, gender });
            }

            setShowCreatePersonPopup(false);
            setPersonForUpdate(undefined);
          }}
          name={personForUpdate?.name}
          gender={personForUpdate?.gender}
        />
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
