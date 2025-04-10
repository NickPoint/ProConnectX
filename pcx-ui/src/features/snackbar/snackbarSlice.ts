import {createAppSlice} from "../../app/createAppSlice";

interface ISnackbarState {
    message: string;
    severity: 'success' | 'error' | 'warning' | 'info';
    open: boolean;
}

const initialState: ISnackbarState = {
    message: '',
    severity: 'success',
    open: false,
};


export const snackbarSlice = createAppSlice({
    name: 'snackbar',
    initialState,
    reducers: {
        openSnackbar: (state, action) => {
            state.message = action.payload.message;
            state.severity = action.payload.severity;
            state.open = true;
        },
        closeSnackbar: (state) => {
            state.open = false;
        },
    },
    selectors: {
        selectSnackbar: snackbarSlice => snackbarSlice,
    },
});

export const { openSnackbar, closeSnackbar } = snackbarSlice.actions;

export const { selectSnackbar } = snackbarSlice.selectors;