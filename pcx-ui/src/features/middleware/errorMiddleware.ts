import {isAsyncThunkAction, isRejectedWithValue} from '@reduxjs/toolkit'
import type {MiddlewareAPI, Middleware} from '@reduxjs/toolkit'
import {openSnackbar} from "../snackbar/snackbarSlice";
import {enqueueSnackbar, useSnackbar} from "notistack";

/**
 * Log a warning and show a toast!
 */
export const rtkQueryErrorLogger: Middleware =
    (api: MiddlewareAPI) => (next) => (action) => {

        // RTK Query uses `createAsyncThunk` from redux-toolkit under the hood, so we're able to utilize these matchers!
        if (isRejectedWithValue(action)) {
            const payload = action.payload as {status: any, data: {id: string, message: string}};
            if (payload.status === 'FETCH_ERROR') {
                enqueueSnackbar('Something went wrong, try a bit latter', { variant: 'error' });
            }
            else {
                enqueueSnackbar(`Something went wrong: ${payload.data.id}`, {variant: 'error'});
            }
        }

        return next(action);
    }