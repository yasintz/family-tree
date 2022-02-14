export type Gender = 0 | 1; // 0=male 1=female
export type RelationValueType = 'parent' | 'partner' | 'children';

export interface PersonType {
  id: string;
  name: string;
  gender: Gender;
}

export interface RelationType {
  id: string;
  main: string;
  second: string;
  type: 'parent' | 'partner';
}

export type StoreType = {
  person: PersonType[];
  relation: RelationType[];
};

export type PersonTree = PersonType & {
  children: PersonTree[];
  partners: PersonType[];
};
