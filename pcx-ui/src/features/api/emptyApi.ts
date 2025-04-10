import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react'

export const emptySplitApi = createApi({
    baseQuery: fetchBaseQuery({
        baseUrl: 'http://192.168.178.107:3000/api',
        credentials: "include",
    }),
    tagTypes: ['Project', 'File'],
    endpoints: () => ({}),
})