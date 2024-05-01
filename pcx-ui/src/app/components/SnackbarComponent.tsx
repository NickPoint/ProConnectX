import React from 'react';
import {Alert, Slide, SlideProps, Snackbar} from '@mui/material';
import {closeSnackbar, selectSnackbar} from '../../features/snackbar/snackbarSlice';
import {useAppDispatch, useAppSelector} from "../hooks";

const SlideTransition = (props: SlideProps) => {
    return <Slide {...props} direction="up"/>;
}

const SnackbarComponent = () => {
    const dispatch = useAppDispatch();
    const snackbar = useAppSelector(selectSnackbar);

    const handleClose = () => {
        dispatch(closeSnackbar());
    };

    return (
        <Snackbar
            open={snackbar.open}
            autoHideDuration={6000}
            onClose={handleClose}>
            <Alert
                severity={snackbar.severity}>
                snackbar.message
            </Alert>
    </Snackbar>
    );
};

export default SnackbarComponent;