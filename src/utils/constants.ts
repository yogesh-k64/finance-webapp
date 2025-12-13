import { DateObject } from "react-multi-date-picker";

export const SCREENS = {
  HOME: "/home",
  CUSTOMERS: "/customers",
  CUSTOMER_DETAILS: "/customers/:id",
  HANDOUTS: "/handouts",
  HANDOUTS_DETAILS: "/handouts/:id",
  COLLECTION: "/collection",
};

export const LOCAL_STORAGE_KEY = {
  HANDOUTS: "HANDOUTS",
  COLLECTION: "COLLECTION",
  CUSTOMER: "CUSTOMER",
};

export const collectionPageIgnoreField = ["nominee", "address", "mobile"];

export const handoutsIgnoreField = ["handoutId"];

export const DATE_PICKER_FORMAT = "YYYY-MM-DD";

export const INITIAL_FILTER_DATE = [
  new DateObject().subtract(7, "days"),
  new DateObject().add(1, "days"),
];

export const STATUS_TYPES = {
  ACTIVE: "ACTIVE",
  PENDING: "PENDING",
  CANCELLED: "CANCELLED",
  COMPLETED: "COMPLETED",
};

export const STATUS_OPTIONS = [
  { value: "ACTIVE", label: "Active" },
  { value: "PENDING", label: "Pending" },
  { value: "CANCELLED", label: "Cancelled" },
  { value: "COMPLETED", label: "Completed" },
];

export const HEAD_CELL_ACTION = "action";

export const customerInitialFormData = {
  name: { value: "", errorMsg: "" },
  mobile: { value: "", errorMsg: "" },
  address: { value: "", errorMsg: "" },
  info: { value: "", errorMsg: "" },
};

export const handoutsInitialFormData = {
  user: { value: "", errorMsg: "" },
  amount: { value: "", errorMsg: "" },
  date: { value: "", errorMsg: "" },
  status: { value: STATUS_TYPES.ACTIVE, errorMsg: "" },
  bond: { value: "true", errorMsg: "" },
};

export const collectionInitialFormData = {
  amount: { value: "", errorMsg: "" },
  date: { value: "", errorMsg: "" },
  handoutId: { value: "", errorMsg: "" },
};

export const linkUserInitialFormData = {
  referredBy: { value: "", errorMsg: "" },
};

export const initialFormData = {
  name: "",
  mobile: "",
  nominee: "",
  amount: "",
  date: "",
  address: "",
  handoutId: "",
};

export const MAX_MOBILE_WIDTH = 768