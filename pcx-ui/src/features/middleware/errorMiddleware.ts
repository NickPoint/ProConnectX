import type {Middleware, MiddlewareAPI} from '@reduxjs/toolkit'
import {isRejectedWithValue} from '@reduxjs/toolkit'
import {enqueueSnackbar} from "notistack";
import {FormValidationResponse} from "../api/pcxApi.ts";

/**
 * Log a warning and show a toast!
 */
export const rtkQueryErrorLogger: Middleware =
    (api: MiddlewareAPI) => (next) => (action) => {

        if (isRejectedWithValue(action)) {
            const {status, data} = action.payload;
            if (status === 'FETCH_ERROR') {
                enqueueSnackbar('Something went wrong, try a bit latter', { variant: 'error' });
            }
            else if (data as FormValidationResponse) {
                enqueueSnackbar(data.message, {variant: 'error'});
            }
            else {
                enqueueSnackbar(`Something went wrong: ${payload.data.id}`, {variant: 'error'});
            }
        }

        return next(action);
    }