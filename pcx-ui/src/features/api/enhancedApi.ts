import {
    addTagTypes, CreateFreelancerApiArg,
    CreateFreelancerApiResponse,
    CreateServiceApiArg,
    CreateServiceApiResponse,
    pcxApi,
    UploadFileApiResponse
} from "./pcxApi";
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import {logout} from "../auth/authSlice";

function createTagsFromList<T extends { id: string | number }>(
    list: T[] | undefined,
    tagType: keyof typeof addTagTypes
) {
    if (!list) return [{ type: tagType, id: 'LIST' }];
    return [
        { type: tagType, id: 'LIST' },
        ...list.map((item) => ({ type: tagType, id: item.id }))
    ];
}
const enhancedApi = pcxApi.enhanceEndpoints({
    endpoints: {
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
        getFilteredServices: {
            providesTags: (result) => createTagsFromList(result, 'Service'),
        },
        getService: {
            providesTags: (result, error, arg) => [{ type: 'Service', id: arg.id }],
        }
    }
})

export type Channel = 'redux' | 'general' | 'notifications/freelancer/1'

export interface Message {
    id: number
    channel: Channel
    userName: string
    text: string
}

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
        createFreelancer: build.mutation<
            CreateFreelancerApiResponse,
            FormData
        >({
            query: queryArg => ({
                url: `/freelancer`,
                method: "POST",
                body: queryArg,
            }),
            invalidatesTags: ["Freelancer"],
        }),
        createService: build.mutation<CreateServiceApiResponse, FormData>({
            query: queryArg => ({
                url: `/service`,
                method: "POST",
                body: queryArg,
            }),
            invalidatesTags: ["Service"],
        }),
        getNotifications: build.query<Message[], Channel>({
            queryFn: () => ({ data: [] }),
            async onCacheEntryAdded(
                arg,
                { updateCachedData, cacheDataLoaded, cacheEntryRemoved }
            ) {
                // Create STOMP client with SockJS
                const socket = new SockJS(`${import.meta.env.VITE_API_URL}/api/ws`);
                const stompClient = new Client({
                    webSocketFactory: () => socket,
                    reconnectDelay: 5000, // Auto-reconnect in 5s
                    onConnect: () => {
                        console.log('WebSocket connected');

                        // Subscribe to the correct channel
                        stompClient.subscribe(`/topic/${arg}`, (message) => {
                            const data = JSON.parse(message.body);
                            updateCachedData((draft) => {
                                draft.push(data);
                            });
                        });
                    },
                    onDisconnect: () => console.log('WebSocket disconnected'),
                });

                stompClient.activate(); // Start connection

                await cacheEntryRemoved;

                stompClient.deactivate(); // Close connection when cache is removed
            }
        }),
    }),
    overrideExisting: true
})


export const {
    useMakeBidMutation,
    useGetProjectQuery,
    useLazyGetFilteredBidsQuery,
    useLazyGetFilteredServicesQuery,
} = enhancedApi

export const {
    useUploadFileMutation,
    useGetNotificationsQuery,
    useCreateServiceMutation,
    useCreateFreelancerMutation
} = overridenApi