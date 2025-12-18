import type { HeadCell } from "./interface";

// Handouts page head cells
export const handoutsHeadCell: HeadCell[] = [
  { label: "Handout ID", renderValue: "getHandout.getId" },
  { label: "User Name", renderValue: "getUser.getName" },
  { label: "User ID", renderValue: "getUser.getId" },
  { label: "Mobile", renderValue: "getUser.getMobile" },
  { label: "Amount", renderValue: "getHandout.getDispAmount" },
  { label: "Date", renderValue: "getHandout.getDateStr" },
  { label: "Status", renderValue: "getHandout.getStatus" },
  { label: "Bond", renderValue: "getHandout.getBondDisplay" },
  { label: "Updated At", renderValue: "getHandout.getUpdatedAt" },
];

// Collection page head cells
export const collectionHeadCell: HeadCell[] = [
  { label: "ID", renderValue: "getId" },
  { label: "Amount", renderValue: "getDispAmount" },
  { label: "Date", renderValue: "getDateStr" },
  { label: "Handout ID", renderValue: "getHandoutId" },
  { label: "Updated At", renderValue: "getUpdatedAt" },
];

// Customer page head cells
export const customerHeadCell: HeadCell[] = [
  { label: "id", renderValue: "getId" },
  { label: "name", renderValue: "getName" },
  { label: "address", renderValue: "getAddress" },
  { label: "info", renderValue: "getInfo" },
  { label: "mobile", renderValue: "getMobile" },
  { label: "updatedAt", renderValue: "getUpdatedAt" },
];

// Handout Details page head cells
export const handoutDetailsHeadCell: HeadCell[] = [
  { label: "ID", renderValue: "getId" },
  { label: "Amount", renderValue: "getDispAmount" },
  { label: "Date", renderValue: "getDateStr" },
  { label: "Status", renderValue: "getStatus" },
  { label: "Bond", renderValue: "getBondDisplay" },
  { label: "Updated At", renderValue: "getUpdatedAt" },
];

// Admin Panel - User Management head cells
export const adminUserHeadCell: HeadCell[] = [
  { label: "ID", renderValue: "getId" },
  { label: "Username", renderValue: "getUsername" },
  { label: "Role", renderValue: "getRole" },
  { label: "Status", renderValue: "getStatus" },
];
