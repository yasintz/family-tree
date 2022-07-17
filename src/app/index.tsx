import React, { useEffect, useMemo, useState } from 'react';
import Popup from '../components/Popup';
import Sidebar from '../components/Sidebar';
import Tree from '../components/Tree';
import { PersonType } from '../types';
import AddRelation from './AddRelation/index';
import RelationFinder from './RelationDetail';
import style from './app.module.scss';
import { AppContext } from './ctx';
import useData from './data';
import builder, { getPersonTreeByDepth } from '../helper/builder';
import styled from 'styled-components';
import RelationTree from './RelationTree';
import CreateUpdateModal from './CreateUpdateModal';
import { usePersonIdStateFromUrl } from '../hooks/use-person-id-state-from-url';
import { MetadataPopup } from './MetadataPopup';

const StyledTreeContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const StyledDepthInputContainer = styled.label`
  margin: 12px;
`;

const StyledActionButton = styled.button<{ $highlight?: boolean }>`
  ${(props) =>
    props.$highlight &&
    `
      box-shadow: inset 0 0 0 1px black;
      border-color: black;
    `}
`;

enum PageMode {
  Tree,
  Detail,
}

const App: React.FC = () => {
  const [personId, setPersonId] = usePersonIdStateFromUrl();
  const [mode, setMode] = useState<PageMode>(PageMode.Tree);
  const [showRelationModal, setShowRelationModal] = useState(false);

  const [isOldRelation, setIsOldRelation] = useState(false);
  const [treeDepth, setTreeDepth] = useState<number>(3);

  const [showCreatePersonPopup, setShowCreatePersonPopup] = useState(false);
  const [showEditPersonPopup, setShowEditPersonPopup] = useState(false);
  const [showMetaDataPopup, setShowMetaDataPopup] = useState(false);

  const [showParentlessNodes, setShowParentlessNodes] = useState(false);

  const {
    store,
    relation,
    person: personList,
    metadata: metadataList,
    createPerson,
    createRelation,
    updatePerson,
    createMetadata,
    updateMetadata,
    deletePerson,
  } = useData();

  const person = useMemo(
    () => (personId ? personList.find((p) => p.id === personId) : undefined),
    [personId, personList]
  );
  const setPerson = (p: PersonType) => setPersonId(p.id);

  const [personSelector, setPersonSelector] = useState<{
    cb?: (v: PersonType) => void;
    person?: PersonType;
  }>();

  const personTree = useMemo(() => {
    if (!person || mode !== PageMode.Tree) {
      return null;
    }

    return getPersonTreeByDepth({
      person,
      depth: treeDepth,
      store,
    });
  }, [mode, person, store, treeDepth]);

  const parentlessNodes = useMemo(
    () =>
      personList.filter(
        // (person) => builder(person, store).parents.length === 0
        (person) => {
          const main = builder(person, store);

          const partnersHasNoParent = main.partners
            .map((i) => builder(i, store).parents.length === 0)
            .every((i) => i);

          return main.parents.length === 0 && partnersHasNoParent;
        }
      ),
    [personList, store]
  );

  const actions = [
    {
      text: 'Tree',
      handler: () => setMode(PageMode.Tree),
      highlight: mode === PageMode.Tree,
    },
    {
      text: 'Detail',
      handler: () => setMode(PageMode.Detail),
      highlight: mode === PageMode.Detail,
    },
    {
      text: 'Relation',
      handler: () => setShowRelationModal(true),
    },
    {
      text: 'Edit',
      handler: () => setShowEditPersonPopup(Boolean(person)),
    },
    {
      text: 'Metadata',
      handler: () => setShowMetaDataPopup(true),
    },
    {
      text: `Old Relation Mode: ${isOldRelation ? 'on' : 'off'}`,
      handler: () => setIsOldRelation((prev) => !prev),
    },
    {
      text: `Parentless: ${showParentlessNodes ? 'on' : 'off'}`,
      handler: () => setShowParentlessNodes((prev) => !prev),
    },
    {
      text: `Delete`,
      handler: () => person && deletePerson(person.id),
    },
  ];

  return (
    <AppContext.Provider
      value={{
        store,
        relation,
        person: personList,
        createPerson,
        createRelation,
        updatePerson,
        showCreatePersonModal: () => setShowCreatePersonPopup(true),
        showPersonSelector: setPersonSelector,
        treeDepth,
        createMetadata,
        updateMetadata,
        metadata: metadataList,
        deletePerson,
      }}
    >
      <div className={style.container}>
        <div className={style.sidebar}>
          <Sidebar
            person={personList}
            onClick={setPerson}
            onCreatePersonClick={() => setShowCreatePersonPopup(true)}
          />
        </div>
        <div className={style.actionSidebar}>
          {person && (
            <>
              <h5>{person.name}</h5>

              <div>
                {actions.map((n) => (
                  <StyledActionButton
                    onClick={n.handler}
                    key={n.text}
                    $highlight={n.highlight}
                  >
                    {n.text}
                  </StyledActionButton>
                ))}
              </div>
            </>
          )}
        </div>
        {showParentlessNodes && (
          <div className={style.parentless}>
            <div>
              {parentlessNodes.map((node) => (
                <div
                  key={`parentless_${node.id}`}
                  onClick={() => setPerson(node)}
                  className={node.gender ? style.woman : style.man}
                >
                  {node.name}
                </div>
              ))}
            </div>
          </div>
        )}
        {person && mode === PageMode.Detail && (
          <div className={style.treeContainer}>
            {isOldRelation ? (
              <div className={style.relationDetail}>
                <RelationFinder
                  mainPerson={person}
                  onSelect={setPerson}
                  renderAllPerson={false}
                  isOldRelation
                />
              </div>
            ) : (
              <RelationTree mainPerson={person} onSelect={setPerson} />
            )}
          </div>
        )}

        {mode === PageMode.Tree && personTree && (
          <StyledTreeContainer>
            <StyledDepthInputContainer>
              Depth:
              <input
                type="number"
                value={treeDepth.toString()}
                onChange={(e) => setTreeDepth(parseInt(e.target.value))}
              />
            </StyledDepthInputContainer>

            <div className={style.treeContainer}>
              <Tree person={personTree} onClick={setPerson} />
            </div>
          </StyledTreeContainer>
        )}
      </div>
      <AddRelation
        person={showRelationModal ? person : undefined}
        onClose={() => setShowRelationModal(false)}
      />
      <CreateUpdateModal
        person={person}
        create={{
          show: showCreatePersonPopup,
          setShow: setShowCreatePersonPopup,
          action: ({ name, gender }) => createPerson(name, gender),
        }}
        update={{
          show: showEditPersonPopup,
          setShow: setShowEditPersonPopup,
          action: ({ id, name, gender }) => updatePerson(id, { name, gender }),
        }}
      />
      <Popup
        open={!!personSelector}
        onClose={() => setPersonSelector(undefined)}
      >
        <div style={{ width: 900, height: 400 }}>
          <RelationFinder
            mainPerson={personSelector?.person}
            onSelect={personSelector?.cb}
            renderAllPerson
            isOldRelation={isOldRelation}
          />
        </div>
      </Popup>
      <MetadataPopup
        person={person}
        open={showMetaDataPopup}
        onClose={() => setShowMetaDataPopup(false)}
      />
    </AppContext.Provider>
  );
};

export default App;
