// app/services/auth/authService.js
// React-specific entry point to allow generating React hooks
import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react'
import type {LogoutUserApiArg, LogoutUserApiResponse, UserInfoResponse} from "./pcxApi";
import {logout, setCredentials} from "../auth/authSlice";

export const authApi = createApi({
    reducerPath: 'authApi',
    baseQuery: fetchBaseQuery({
        // base url of backend API
        baseUrl: 'http://192.168.178.107:3000/api',
        // prepareHeaders is used to configure the header of every request and gives access to getState which we use to include the token from the store
        credentials: 'include',
    }),
    tagTypes: ['User', 'Project'],
    endpoints: (builder) => ({
        authorize: builder.query<UserInfoResponse, null>({
            query: () => ({
                url: 'auth',
            }),
            onQueryStarted: async (arg, {dispatch, queryFulfilled}) => {
                const {data} = await queryFulfilled
                if (data !== null) {
                    dispatch(setCredentials(data))
                }
            },
        }),
        logoutUser: builder.mutation<LogoutUserApiResponse, LogoutUserApiArg>({
            query: () => ({
                url: `/auth/logout`,
                method: "POST"
            }),
            onQueryStarted: async (arg, {dispatch, queryFulfilled}) => {
                await queryFulfilled;
                dispatch(logout());
            },
            invalidatesTags: ['User', 'Project'],
        }),

    }),
})

// export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {useAuthorizeQuery, useLogoutUserMutation} = authApi