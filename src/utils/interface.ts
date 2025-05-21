export interface Handout {
  id: string;
  name: string;
  mobile: string;
  nominee: string;
  amount: number;
  date: string;
  address: string;
  collection: collection[];
  status: string;
}

export interface collection {
  id: string;
  name: string;
  handoutId: string;
  amount: number;
  date: string;
}

export interface TableComponentProps {
  headCell: string[]
  list: Array<any>
  onClick?: (item: any) => void
}