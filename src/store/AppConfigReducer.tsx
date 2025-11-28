import type { DateObject } from "react-multi-date-picker";
import { INITIAL_FILTER_DATE } from "../utils/constants";
import { createSlice } from "@reduxjs/toolkit";

export interface snackBarPropType {
    show: boolean
    message: string
    status: "success" | "error" | "warning" | "info"
}

interface AppConfigProps {
    snackBar: snackBarPropType
    homePageDateRange: DateObject[]
    loader: boolean
}

const initialSnackBar: snackBarPropType = {
    show: false,
    message: "",
    status: "error"
};

const initialState: AppConfigProps = {
    snackBar: initialSnackBar,
    loader: false,
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
        storeLoader: (state, action) => {
            state.loader = action.payload;
        },
        storeHomePageDateRange: (state, action) => {
            state.homePageDateRange = action.payload;
        }
    }
});

export const { showSnackBar, hideSnackBar, storeHomePageDateRange } = AppConfigSlice.actions;

export const useConfigStoreByKey = (key: keyof AppConfigProps) => {
    return (state: { AppConfigReducer: AppConfigProps }) => {
        return state.AppConfigReducer[key];
    };
};

export const useHomeDateRange = (state: { AppConfigReducer: AppConfigProps }) => state.AppConfigReducer.homePageDateRange;


export default AppConfigSlice.reducer;
