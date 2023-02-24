import { PersonTreeType, PersonType, StoreType } from '../../types';
import { getCommonChildren, getPersonTreeByDepth } from '../builder';
import dTreeOld from './index.old';

type SimplePersonType = {
  name: string;
  class: 'woman' | 'man';
  extra: {
    id: string;
  };
};

type MarriageType = {
  spouse: SimplePersonType;
  children: DTreePersonType[];
};
type DTreePersonType = SimplePersonType & {
  marriages: MarriageType[];
};

function personToDtreePerson(person: PersonType): SimplePersonType {
  return {
    name: person.name,
    class: person.gender === 0 ? 'woman' : 'man',
    extra: {
      id: person.id,
    },
  };
}

export function personTreeToDTree(
  person: PersonTreeType,
  store: StoreType,
  depth: number
): DTreePersonType {
  return {
    ...personToDtreePerson(person),
    marriages: person.partners.map((partner) => ({
      spouse: personToDtreePerson(partner),
      children:
        depth > 1
          ? getCommonChildren(partner, person, store)
              .map((c) =>
                getPersonTreeByDepth({
                  person: c,
                  depth: depth - 1,
                  store,
                })
              )
              .map((p) => personTreeToDTree(p, store, depth - 1))
          : [],
    })),
  };
}

const dTree: {
  init: (persons: DTreePersonType[], options: any) => void;
} = dTreeOld;

export default dTree;
