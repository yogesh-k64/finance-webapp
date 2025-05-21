import { DateObject } from "react-multi-date-picker"

export const SCREENS = {
    HOME: "/home",
    CUSTOMERS: "/customers",
    HANDOUTS: "/handouts",
    HANDOUTS_DETAILS: "/handouts/:id",
    COLLECTION: "/collection",
}

export const LOCAL_STORAGE_KEY = {
    HANDOUTS: "HANDOUTS",
    COLLECTION: "COLLECTION",
    CUSTOMER: "CUSTOMER",
}

export const collectionPageIgnoreField = ["nominee", "address", "mobile"]

export const handoutsIgnoreField = ["handoutId"]

export const DATE_PICKER_FORMAT = "YYYY-MM-DD"

export const INITIAL_FILTER_DATE = [
    new DateObject().subtract(7, "days"),
    new DateObject().add(1, "days")
]

export const STATUS_TYPES = {
    ACTIVE: 'ACTIVE',
    PAID: 'PAID',
    CLOSED: 'CLOSED'
}
