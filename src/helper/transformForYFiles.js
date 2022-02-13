import { Gender, PersonType, Store } from '../types';

export function hh({ person, relation }: Store) {
  const partnerRelations = relation.filter((i) => i.type === 'partner');

  const user = (id: string, name: string, gender: Gender) => ({
    id,
    layout: {
      width: 200,
      height: 80,
    },
    familyType: gender === 0 ? 'MALE' : 'FEMALE',
    labels: [
      {
        text: name,
      },
    ],
  });

  const fam = (id: string) => ({
    id,
    layout: {
      width: 15,
      height: 15,
    },
    familyType: 'FAMILY',
    labels: [],
  });

  const node_transformedPerson = person.map(({ id, gender, name }) =>
    user(id, name, gender)
  );

  const node_families = partnerRelations.map(({ id }) => fam(id));

  const conn_mapToPartner = partnerRelations
    .map((i) => ({ id: i.id, person: i.main }))
    .concat(partnerRelations.map((i) => ({ id: i.id, person: i.second })))
    .map(({ id, person }) => ({
      id: id + person,
      source: person,
      target: id,
    }));

  const getParents = (id: string) =>
    relation.filter((r) => r.second === id && r.type === 'parent');

  const conn_mapToFamily = person
    .filter((i) => getParents(i.id).length > 1)
    .map((per) => {
      const [first, second] = getParents(per.id);

      const familyRelationId = relation.find(
        (r) =>
          r.type === 'partner' &&
          ((r.second === first.main && r.main === second.main) ||
            (r.main === first.main && r.second === second.main))
      )?.id;

      return {
        source: familyRelationId,
        target: per.id,
        id: familyRelationId + per.id,
      };
    });

  const onlyOneParent = person
    .filter((i) => getParents(i.id).length === 1)
    .map((per) => ({
      per,
      parent: person.find((p) => p.id === getParents(per.id)[0].main) as PersonType,
    }));

  const conn_onlyOneParent = onlyOneParent.map(({ parent, per }) => ({
    id: per.id + parent.id,
    source: parent.id + 'family',
    target: per.id,
  }));

  const parentIds = onlyOneParent
    .map((i) => i.parent.id)
    .filter((value, index, self) => self.indexOf(value) === index);

  const node_onlyParent = parentIds.map((id) => fam(id + 'family'));
  const conn_onlyParentToFam = parentIds.map((id) => ({
    source: id,
    target: id + 'family',
    id: id + 'self',
  }));

  const nodes = [
    ...node_families,
    ...node_transformedPerson,
    ...node_onlyParent,
  ];
  const edges = [
    ...conn_mapToPartner,
    ...conn_mapToFamily,
    ...conn_onlyOneParent,
    ...conn_onlyParentToFam,
  ];

  console.log(JSON.stringify({ nodes, edges }));
}
