import { isRejectedWithValue, Middleware, MiddlewareAPI } from '@reduxjs/toolkit';
import { enqueueSnackbar } from 'notistack';

export const rtkQueryErrorLogger: Middleware =
    (api: MiddlewareAPI) => (next) => (action) => {

        if (isRejectedWithValue(action)) {
            const { status, data } = action.payload;

            if (status === 'FETCH_ERROR' || status === 'PARSING_ERROR') {
                // Network errors or JSON parse issues
                enqueueSnackbar('Network error, please try again later.', { variant: 'error' });
            }
            else if ((status === 400 || status === 401 || status === 403) && data?.message) {
                enqueueSnackbar(data.message, { variant: 'error' });
            }
            else if (status !== 400 && status !== 401 && status !== 403) {
                enqueueSnackbar('Unexpected runtime error.', { variant: 'error' });
            }
            else {
                enqueueSnackbar('An unexpected error occurred.', { variant: 'error' });
            }
        }

        return next(action);
    };