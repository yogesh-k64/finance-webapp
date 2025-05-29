import { useDispatch, useSelector } from "react-redux";

import MuiAlert, { type AlertProps } from "@mui/material/Alert";
import React from "react";
import { Snackbar } from "@mui/material";
import { hideSnackBar, useConfigStoreByKey, type snackBarPropType } from "../store/AppConfigReducer";

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
    props,
    ref,
) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const SnackBar = () => {
    const dispatch = useDispatch();

    const handleClose = () => {
        dispatch(hideSnackBar());
    };

    const handleAutoClose = (evt: React.SyntheticEvent<any> | Event, reason: string) => {
    console.log('evt :', evt);
        const ignoreFields = [
            "clickaway", "escapeKeyDown" 
        ];
        
        if (ignoreFields.includes(reason)) return;
        
        handleClose();
    };

    const snackBarState = useSelector(useConfigStoreByKey("snackBar")) as snackBarPropType;

    return (
        <Snackbar open={snackBarState.show} autoHideDuration={4000}
            onClose={handleAutoClose}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            className="snackbar-body"
        >
            <Alert onClose={handleClose} data-cy="snackbar-msg"
                className={`snackbar-content ${snackBarState.status}`} 
                severity={snackBarState.status} sx={{ width: "100%" }}>
                {snackBarState.message}
            </Alert>
        </Snackbar>
    );
};


export default SnackBar;
