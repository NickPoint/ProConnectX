import type {Action, ThunkAction} from "@reduxjs/toolkit"
import {combineSlices, configureStore} from "@reduxjs/toolkit"
import {setupListeners} from "@reduxjs/toolkit/query"
import {emptySplitApi} from "../features/api/emptyApi";
import {rtkQueryErrorLogger} from "../features/middleware/errorMiddleware";
import {snackbarSlice} from "../features/snackbar/snackbarSlice";
import {serviceFormSlice} from "../features/serviceForm/serviceFormSlice";
import {filterSlice} from "../features/filter/filterSlice";
import {headerSlice} from "../features/header/headerSlice";
import {formSlise} from "../features/form/formSlice.ts";
import {fabSlice} from "../features/fab/fabSlice.ts";
import {pageSlice} from "../features/page/pageSlice.ts";
import {placesAutocompleteSlice} from "../features/placeAutocomplete/placeAutocompleteSlice.ts";
import {loadingSlice} from "../features/loading/loadingSlice.ts";
import {authFormSlice} from "../features/signupDialog/authFormSlice.ts";
import {dashboardSlice} from "../features/dashboard/dashboardSlice.ts";
import {notificationsSlice} from "../features/notifications/notificationSlice.ts";

const rootReducer =
    combineSlices(snackbarSlice, serviceFormSlice, filterSlice, headerSlice, emptySplitApi,
        formSlise, fabSlice, pageSlice, placesAutocompleteSlice, loadingSlice, authFormSlice, dashboardSlice,
        notificationsSlice)
export type RootState = ReturnType<typeof rootReducer>

export const makeStore = (preloadedState?: Partial<RootState>) => {
    const store = configureStore({
        reducer: rootReducer,
        middleware: getDefaultMiddleware => {
            return getDefaultMiddleware().concat([emptySplitApi.middleware, rtkQueryErrorLogger])
        },
        preloadedState,
    })
    setupListeners(store.dispatch)
    return store
}

const preloadedState: Partial<RootState> = {
    form: {
        ...JSON.parse(localStorage.getItem('form') || '{}'),
        activeField: undefined
    }
}

export const store = makeStore(preloadedState);

store.subscribe(() => {
    const {form} = store.getState();
    localStorage.setItem('form', JSON.stringify(form));
})

export type AppStore = typeof store
export type AppDispatch = AppStore["dispatch"]
export type AppThunk<ThunkReturnType = void> = ThunkAction<
    ThunkReturnType,
    RootState,
    unknown,
    Action
>
