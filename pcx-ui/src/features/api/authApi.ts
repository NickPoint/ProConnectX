// app/services/auth/authService.js
// React-specific entry point to allow generating React hooks
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import {UserInfoResponse} from "./pcxApi";
import {setCredentials} from "../auth/authSlice";

export const authApi = createApi({
    reducerPath: 'authApi',
    baseQuery: fetchBaseQuery({
        // base url of backend API
        baseUrl: 'http://localhost:3000/api',
        // prepareHeaders is used to configure the header of every request and gives access to getState which we use to include the token from the store
        credentials: 'include',
    }),
    tagTypes: ['Client'],
    endpoints: (builder) => ({
        authorisedClient: builder.query<UserInfoResponse, null>({
            query: () => ({
                url: 'auth',
            }),
            onQueryStarted: async (arg, { dispatch, queryFulfilled }) => {
                const { data } = await queryFulfilled
                dispatch(setCredentials(data))
            },
        }),
    }),
})

// export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { useAuthorisedClientQuery } = authApi