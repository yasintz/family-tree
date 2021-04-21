import { Person, Relation } from '../types';

function builder(person: Person, personList: Person[], relation: Relation[]) {
  const getPersonById = (id: string) =>
    personList.find((i) => i.id === id) as Person;
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
        [] as Person[]
      )
      .filter((i) => i.id !== person.id)
      .reduce(
        (acc, cur) => (
          // eslint-disable-next-line
          acc.findIndex((p) => p.id === cur.id) === -1 && acc.push(cur), acc
        ),
        [] as Person[]
      ),
  };
}

export default builder;
