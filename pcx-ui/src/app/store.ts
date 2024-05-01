import type { Action, ThunkAction } from "@reduxjs/toolkit"
import { combineSlices, configureStore } from "@reduxjs/toolkit"
import { setupListeners } from "@reduxjs/toolkit/query"
import { counterSlice } from "../features/counter/counterSlice"
import {headerSlice} from "../features/header/headerSlice"
import {emptySplitApi} from "../features/api/emptyApi";
import {rtkQueryErrorLogger} from "../features/middleware/errorMiddleware";
import {snackbarSlice} from "../features/snackbar/snackbarSlice";
import {authApi} from "../features/api/authApi";
import {authSlice} from "../features/auth/authSlice";
import {serviceFormSlice} from "../features/serviceForm/serviceFormSlice";
import {projectFilterSlice} from "../features/projectFilter/projectFilterSlice";

// `combineSlices` automatically combines the reducers using
// their `reducerPath`s, therefore we no longer need to call `combineReducers`.
const rootReducer =
    combineSlices(counterSlice, headerSlice, snackbarSlice, serviceFormSlice, projectFilterSlice, emptySplitApi, authApi, authSlice)
// Infer the `RootState` type from the root reducer
export type RootState = ReturnType<typeof rootReducer>

// The store setup is wrapped in `makeStore` to allow reuse
// when setting up tests that need the same store config
export const makeStore = (preloadedState?: Partial<RootState>) => {
  const store = configureStore({
    reducer: rootReducer,
    // Adding the api middleware enables caching, invalidation, polling,
    // and other useful features of `rtk-query`.
    middleware: getDefaultMiddleware => {
      return getDefaultMiddleware().concat([emptySplitApi.middleware, rtkQueryErrorLogger, authApi.middleware])
    },
    preloadedState,
  })
  // configure listeners using the provided defaults
  // optional, but required for `refetchOnFocus`/`refetchOnReconnect` behaviors
  setupListeners(store.dispatch)
  return store
}

export const store = makeStore()

// Infer the type of `store`
export type AppStore = typeof store
// Infer the `AppDispatch` type from the store itself
export type AppDispatch = AppStore["dispatch"]
export type AppThunk<ThunkReturnType = void> = ThunkAction<
  ThunkReturnType,
  RootState,
  unknown,
  Action
>
