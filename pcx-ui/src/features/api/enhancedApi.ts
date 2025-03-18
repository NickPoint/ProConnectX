import {DocumentType, pcxApi, UploadFileApiArg, UploadFileApiResponse} from "./pcxApi";
import {logout} from "../auth/authSlice";

const enhancedApi = pcxApi.enhanceEndpoints({
    addTagTypes: ['Project', 'File'],
    endpoints: {
        getPrincipalFiles: {
            providesTags: ['File'],
        },
        uploadFile: {
            invalidatesTags: ['File'],
        },
        makeBid: {
            invalidatesTags: (result, error, arg) => [{type: 'Project', id: arg.projectId}],
        },
        getProject: {
            providesTags: (result, error, arg) => [{type: 'Project', id: arg.projectId}],
        },
        authenticateUser: {
            invalidatesTags: ['Project'],
        },
        logoutUser: {
            onQueryStarted: async (arg, {dispatch, queryFulfilled}) => {
                await queryFulfilled;
                dispatch(logout());
            },
            invalidatesTags: ['Project'],
        },
    }
})

const overridenApi = pcxApi.injectEndpoints({
    endpoints: (build) => ({
        uploadFile: build.mutation<UploadFileApiResponse, FormData>({
            query: queryArg => ({
                url: `/files/upload`,
                method: "POST",
                body: queryArg,
            }),
            invalidatesTags: ['File'],
        }),
    }),
    overrideExisting: true
})


export const {
    useMakeBidMutation,
    useGetProjectQuery,
    useLazyGetFilteredBidsQuery,
} = enhancedApi

export const {
    useUploadFileMutation,
} = overridenApi