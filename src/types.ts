export type Gender = 0 | 1; // 0=male 1=female
export type RelationType = 'parent' | 'partner' | 'children';

export interface Person {
  id: string;
  name: string;
  gender: Gender;
}
export interface SerializedPerson extends Person {
  partners: Person[];
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
  person: Person[];
  relation: Relation[];
};
