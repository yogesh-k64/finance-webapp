import type { DateObject } from "react-multi-date-picker";
import { INITIAL_FILTER_DATE } from "../utils/constants";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface snackBarPropType {
    show: boolean
    message: string
    status: "success" | "error" | "warning" | "info"
}

export interface formDetailsType  {
        name?: string;
        mobile?: string;
        nominee?: string;
        amount?: string;
        date?: string;
        address?: string;
        handoutId?: string;
    }

interface AppConfigProps {
    snackBar: snackBarPropType
    homePageDateRange: DateObject[]
    formDetails?: formDetailsType
}

const initialSnackBar: snackBarPropType = {
    show: false,
    message: "",
    status: "error"
};

const initialState: AppConfigProps = {
    snackBar: initialSnackBar,
    homePageDateRange: INITIAL_FILTER_DATE
};

const AppConfigSlice = createSlice({
    name: "AppConfigReducer",
    initialState,
    reducers: {
        hideSnackBar: (state) => {
            return Object.assign({}, state, {
                snackBar: Object.assign({}, state.snackBar, {
                    show: false
                })
            });
        },
        showSnackBar: (state, action) => {
            return Object.assign({}, state, {
                snackBar: {
                    show: true,
                    message: action.payload.message,
                    status: action.payload.status ? action.payload.status : initialSnackBar.status
                }
            });
        },
        storeHomePageDateRange: (state, action) => {
            state.homePageDateRange = action.payload;
        },
        storeFormDetails: (state, action: PayloadAction<formDetailsType>) => {
            state.formDetails = action.payload;
        }
    }
});

export const { showSnackBar, hideSnackBar, storeHomePageDateRange,
    storeFormDetails
 } = AppConfigSlice.actions;

export const useConfigStoreByKey = (key: keyof AppConfigProps) => {
    return (state: { AppConfigReducer: AppConfigProps }) => {
        return state.AppConfigReducer[key];
    };
};

export const useHomeDateRange = (state: { AppConfigReducer: AppConfigProps }) => state.AppConfigReducer.homePageDateRange;
export const useFormData = (state: { AppConfigReducer: AppConfigProps }) => state.AppConfigReducer.formDetails;


export default AppConfigSlice.reducer;
