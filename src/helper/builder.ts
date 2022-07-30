import { PersonTreeType, PersonType, StoreType } from '../types';

const emptyArray: [] = [];

function getPersonTreeByDepth({
  person,
  depth,
  store,
}: {
  person: PersonType;
  depth: number;
  store: StoreType;
}): PersonTreeType {
  const { metadata } = store;
  const buildedPerson = builder(person, store);

  return {
    ...person,
    partners: buildedPerson.partners,
    metadata: metadata.filter((m) => m.personId === person.id),
    children:
      depth > 0
        ? buildedPerson.children.map((c) =>
            getPersonTreeByDepth({
              person: c,
              depth: depth - 1,
              store,
            })
          )
        : emptyArray,
  };
}

function getParentTreeByDepth({
  person,
  depth,
  store,
}: {
  person: PersonType;
  depth: number;
  store: StoreType;
}): PersonTreeType {
  const buildedPerson = builder(person, store);

  return {
    ...person,
    partners: emptyArray,
    metadata: emptyArray,
    children:
      depth > 0
        ? buildedPerson.parents.map((c) =>
            getParentTreeByDepth({
              person: c,
              depth: depth - 1,
              store,
            })
          )
        : emptyArray,
  };
}

function builder(
  person: PersonType,
  { person: personList, relation, metadata }: StoreType
) {
  const getPersonById = (id: string) =>
    personList.find((i) => i.id === id) as PersonType;
  const _getParents = () => {
    return relation
      .filter((r) => r.type === 'parent' && r.second === person.id)
      .map((r) => getPersonById(r.main));
  };

  const _getChildrenByParent = (parentId: string) => {
    return relation
      .filter((r) => r.type === 'parent' && r.main === parentId)
      .map((i) => getPersonById(i.second));
  };

  return {
    metadata: metadata.filter((m) => m.personId === person.id),
    parents: _getParents(),
    children: _getChildrenByParent(person.id),
    partners: relation
      .filter(
        (i) =>
          i.type === 'partner' &&
          (i.main === person.id || i.second === person.id)
      )
      .map((r) => (r.main === person.id ? r.second : r.main))
      .map((i) => getPersonById(i)),

    siblings: _getParents()
      .reduce(
        // eslint-disable-next-line
        (acc, cur) => (acc.push(..._getChildrenByParent(cur.id)), acc),
        [] as PersonType[]
      )
      .filter((i) => i.id !== person.id)
      .reduce(
        (acc, cur) => (
          // eslint-disable-next-line
          acc.findIndex((p) => p.id === cur.id) === -1 && acc.push(cur), acc
        ),
        [] as PersonType[]
      ),
  };
}

export { getPersonTreeByDepth, getParentTreeByDepth };
export default builder;
