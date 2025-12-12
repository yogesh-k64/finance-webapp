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
  view?: (item: any) => React.ReactNode;
  copy?: boolean;
}

export interface MoreOption {
  label: string;
  onClick: (item: any) => void;
}

export interface TableComponentProps {
  headCell: HeadCell[];
  list: Array<any>;
  onClick?: (item: any) => void;
  onEdit?: (item: any) => void;
  onDelete?: (item: any) => void;
  moreOptions?: MoreOption[];
  loading?: boolean;
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
  createdAt: string;
  updatedAt: string;
}

export interface HandoutResp {
  handout: Handout;
  user: User;
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

export interface CreateHandoutReq {
  amount: number;
  date: string;
  userId: number;
}

export interface IndianNumberFormatOptions {
  lakh?: boolean;
  crore?: boolean;
  comma?: boolean;
  decimalPrecision?: number;
}

// Component Props Interfaces
export interface PageHeaderProps {
  title: string;
  loading?: boolean;
  selectedWeek: number | null;
  onWeekChange: (event: React.SyntheticEvent, value: number | null) => void;
  filterMode: "all" | "date" | "week";
  checked: boolean;
  onShowAllChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  dateValues: any[];
  onDateChange: (dateRange: any[]) => void;
  isMobile: boolean;
  addButtonText: string;
  onAddClick: () => void;
}

export interface WeekSelectorProps {
  selectedWeek: number | null;
  onWeekChange: (event: React.SyntheticEvent, value: number | null) => void;
  disabled?: boolean;
  isMobile?: boolean;
}

export interface FilterControlsProps {
  checked: boolean;
  onShowAllChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  dateValues: any[];
  onDateChange: (dateRange: any[]) => void;
}

export interface WeekInfo {
  weekNumber: number;
  startDate: Date;
  endDate: Date;
}
