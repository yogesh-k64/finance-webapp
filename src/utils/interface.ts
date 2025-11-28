export interface collection {
  id: string;
  name: string;
  handoutId: string;
  amount: number;
  date: string;
}

export interface HeadCell {
  label: string;
  renderValue?: string;
  onDelete?: (item: any) => void;
  onEdit?: (item: any) => void;
}

export interface TableComponentProps {
  headCell: HeadCell[];
  list: Array<any>;
  onClick?: (item: any) => void;
}

export interface DrawerSectionProps {
  isDrawerOpen: boolean;
  setOpenSideBar: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface User {
  id: number;
  name: string;
  address: string;
  info: string;
  mobile: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserRequest {
  name: string;
  address: string;
  info?: string;
  mobile: number;
  referredById?: number;
}

export interface LinkUserReferralRequest {
  referredBy: number;
}

export interface Handout {
  id: number;
  amount: number;
  date: string;
  created_at: string;
  updated_at: string;
}

export interface HandoutResp {
  handout: Handout;
  user: User;
  nominee: User;
}

export interface User {
  id: number;
  name: string;
  address: string;
  info: string;
  mobile: number;
  referred_by: number;
  created_at: string;
  updated_at: string;
}

export interface CreateHandoutRequest {
  amount: number;
  date: string;
  userId: number;
  nomineeId: number;
}

export interface UpdateHandoutRequest {
  amount?: number;
  date?: string;
  userId?: number;
  nomineeId?: number;
}
