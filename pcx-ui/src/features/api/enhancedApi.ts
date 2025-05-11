import {
    addTagTypes, BookServiceApiArg, BookServiceApiResponse,
    CreateFreelancerApiResponse,
    CreateServiceApiResponse,
    pcxApi,
    UpdateAvatarApiResponse,
} from "./pcxApi";
import {Client} from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import {pushNotification} from "../notifications/notificationSlice.ts";

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
        authenticateUser: {
            invalidatesTags: ['Auth', 'Freelancer', 'Order'],
        },
        switchRole: {
            invalidatesTags: ['Auth', 'Order', 'Statistics'],
        },
        getServices: {
            providesTags: (result) => createTagsFromList(result?.content, 'Service'),
        },
        getUserServices: {
            providesTags: (result) => createTagsFromList(result?.content, 'Service'),
        },
        getService: {
            providesTags: (result, error, arg) => [{ type: 'Service', id: arg.id }],
        },
        getOrders: {
            providesTags: (result, error, arg) =>createTagsFromList(result?.content, 'Order'),
        },
    }
})

export type Channel = 'redux' | 'notifications/general' | 'notifications/admin' | 'notifications/client' | 'notifications/freelancer' | 'notifications/unverified';

export interface NotificationDto {
    id: number;
    type: string;
    payload: {
        entityType: string;
        entityId: number;
        data: Record<string, any>;
    };
    status: string;
    createdAt: string;
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
            invalidatesTags: ["Auth", "Freelancer"],
        }),
        createClient: build.mutation<
            CreateFreelancerApiResponse,
            FormData
        >({
            query: queryArg => ({
                url: `/client`,
                method: "POST",
                body: queryArg,
            }),
            invalidatesTags: ["Auth", "Client"],
        }),
        createService: build.mutation<CreateServiceApiResponse, FormData>({
            query: queryArg => ({
                url: `/service`,
                method: "POST",
                body: queryArg,
            }),
            invalidatesTags: ["Service"],
        }),
        bookService: build.mutation<BookServiceApiResponse, FormData>({
            query: queryArg => ({
                url: `/orders/book/${queryArg.get('serviceId')}`,
                method: "POST",
                body: queryArg,
            }),
            invalidatesTags: ["Order"],
        }),
        getNotifications: build.query<NotificationDto[], Channel>({
            queryFn: () => ({ data: [] }),
            async onCacheEntryAdded(
                arg,
                { updateCachedData, cacheDataLoaded, cacheEntryRemoved, dispatch}
            ) {
                const socket = new SockJS(`${import.meta.env.VITE_API_URL}ws`);
                const stompClient = new Client({
                    webSocketFactory: () => socket,
                    reconnectDelay: 5000,
                    onConnect: () => {
                        console.log('WebSocket connected');

                        // Subscribe to the correct channel
                        stompClient.subscribe("/user/queue/notifications", (message) => {
                            const data = JSON.parse(message.body);
                            updateCachedData((draft) => {
                                draft.push(data);
                            });

                            dispatch(pushNotification(data));
                        });
                    },
                    onDisconnect: () => console.log('WebSocket disconnected'),
                });

                stompClient.activate(); // Start connection

                await cacheEntryRemoved;

                stompClient.deactivate(); // Close connection when cache is removed
            }
        }),
        updateAvatar: build.mutation<UpdateAvatarApiResponse, FormData>(
            {
                query: queryArg => ({
                    url: `/files/avatar`,
                    method: "POST",
                    body: queryArg,
                }),
                invalidatesTags: ["Freelancer", "Client"],
            },
        ),
    }),
    overrideExisting: true
})


export const {
    useLazyGetFileQuery,
    useLazyGetServicesQuery,
} = enhancedApi

export const {
    useUploadFileMutation,
    useGetNotificationsQuery,
    useCreateServiceMutation,
    useCreateFreelancerMutation,
    useCreateClientMutation,
    useUpdateAvatarMutation,
    useBookServiceMutation,
} = overridenApi