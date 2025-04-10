import {pcxApi, UploadFileApiResponse} from "./pcxApi";
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
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
        getNotifications: build.query<Message[], Channel>({
            queryFn: () => ({ data: [] }),
            async onCacheEntryAdded(
                arg,
                { updateCachedData, cacheDataLoaded, cacheEntryRemoved }
            ) {
                // Create STOMP client with SockJS
                const socket = new SockJS('http://192.168.178.107:3000/api/ws');
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
} = enhancedApi

export const {
    useUploadFileMutation,
    useGetNotificationsQuery
} = overridenApi