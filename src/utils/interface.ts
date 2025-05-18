export interface Handout {
  id: string;
  name: string;
  mobile: string;
  nominee: string;
  amount: number;
  date: string;
  address: string;
}

export interface collection {
  id: string;
  name: string;
  handoutId: string;
  amount: number;
  date: string;
}