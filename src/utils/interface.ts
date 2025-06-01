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

export interface HeadCell {
  label: string;
  onDelete?: (item: any) => void;
  onEdit?: (item: any) => void;
}

export interface TableComponentProps {
  headCell: HeadCell[]
  list: Array<any>
  onClick?: (item: any) => void
}

export interface DrawerSectionProps {
  isDrawerOpen: boolean
  setOpenSideBar: React.Dispatch<React.SetStateAction<boolean>>
}