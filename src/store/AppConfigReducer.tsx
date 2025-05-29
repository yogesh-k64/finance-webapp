import { createSlice } from "@reduxjs/toolkit";

export interface snackBarPropType {
    show: boolean
    message: string
    status: "success" | "error" | "warning" | "info"
}

interface AppConfigProps {
    snackBar: snackBarPropType
}

const initialSnackBar: snackBarPropType = {
    show: false,
    message: "",
    status: "error"
};

const initialState: AppConfigProps = {
    snackBar: initialSnackBar,
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
        }
    }
});

export const {  showSnackBar, hideSnackBar } = AppConfigSlice.actions;

export const useConfigStoreByKey = (key: keyof AppConfigProps) => {
    return (state: { AppConfigReducer: AppConfigProps }) => {
        return state.AppConfigReducer[key];
    };
};


export default AppConfigSlice.reducer;
