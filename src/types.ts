export type Gender = 0 | 1; // 0=male 1=female
export type RelationType = 'parent' | 'partner' | 'children';

export interface PersonType {
  id: string;
  name: string;
  gender: Gender;
}
export interface SerializedPerson extends PersonType {
  partners: PersonType[];
  children: SerializedPerson[];
  depth: number;
}

export interface Relation {
  id: string;
  main: string;
  second: string;
  type: 'parent' | 'partner';
}

export type Store = {
  person: PersonType[];
  relation: Relation[];
};
