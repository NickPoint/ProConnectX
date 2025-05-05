import {
    AccountStatus, AccountType,
    addTagTypes,
    CreateFreelancerApiResponse,
    CreateServiceApiResponse, EventType, GetEventTypesApiArg,
    GetEventTypesApiResponse,
    pcxApi, UpdateAvatarApiArg, UpdateAvatarApiResponse,
} from "./pcxApi";
import {Client} from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import {useAppDispatch} from "../../app/hooks.ts";
import {pushNotification} from "../notifications/notificationSlice.ts";
import {useTranslation} from "react-i18next";

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
        // getCurrentUser: {
        //     async onQueryStarted(id, { dispatch, queryFulfilled }) {
        //         const {data} = await queryFulfilled;
        //         const {t} = useTranslation();
        //         const notifications: NotificationDto[] = []
        //         data.accounts.forEach(account => {
        //             if (account.accountStatus === AccountStatus.Pending) {
        //                 notifications.push({title: t('notifications.unfinishedVerification.title'),
        //                     fullName: `${data.firstName} ${data.lastName}`,
        //                     message: t('notifications.unfinishedVerification.message'),
        //                     eventType: EventType.AccountUnverified});
        //             } else if (account.accountStatus === AccountStatus.Rejected) {
        //                 notifications.push({title: t('notifications.rejectedRegistration.title'),
        //                     fullName: `${data.firstName} ${data.lastName}`,
        //                     message: t('notifications.rejectedRegistration.message', {role: t(`enum.accountType.${account.accountType}`)}),
        //                     eventType: EventType.RegistrationRejected});
        //             }
        //         })
        //     }
        // },
        authenticateUser: {
            invalidatesTags: ['Auth', 'Freelancer', 'Order'],
        },
        logoutUser: {
            invalidatesTags: ['Auth', 'Freelancer', 'Order'],
        },
        getFilteredServices: {
            providesTags: (result) => createTagsFromList(result, 'Service'),
        },
        getService: {
            providesTags: (result, error, arg) => [{ type: 'Service', id: arg.id }],
        }
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
            invalidatesTags: ["Freelancer"],
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
            invalidatesTags: ["Client"],
        }),
        createService: build.mutation<CreateServiceApiResponse, FormData>({
            query: queryArg => ({
                url: `/service`,
                method: "POST",
                body: queryArg,
            }),
            invalidatesTags: ["Service"],
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
                invalidatesTags: ["File"],
            },
        ),
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
    useCreateFreelancerMutation,
    useCreateClientMutation,
    useUpdateAvatarMutation,
} = overridenApi