export type HANDOUT_STATUS = 'ACTIVE' | 'PAID' | 'CLOSED';

export interface Handout {
  id: string;
  name: string;
  mobile: string;
  nominee: string;
  amount: number;
  date: string;
  address: string;
  collection: collection[];
  status: HANDOUT_STATUS;
}

export interface collection {
  id: string;
  name: string;
  handoutId: string;
  amount: number;
  date: string;
}