import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {NotificationDto} from "../api/enhancedApi.ts";
import {createAppSlice} from "../../app/createAppSlice.ts";

interface NotificationsState {
    items: NotificationDto[];
}

const initialState: NotificationsState = {
    items: [],
};

export const notificationsSlice = createAppSlice({
    name: 'notifications',
    initialState,
    reducers: {
        pushNotification(state, action: PayloadAction<NotificationDto>) {
            state.items.push(action.payload);
        },
        setNotifications(state, action: PayloadAction<NotificationDto[]>) {
            state.items = action.payload;
        },
        clearNotifications(state) {
            state.items = [];
        },
    },
    selectors: {
        getNotifications: state => state.items,
    }
});

export const { pushNotification, setNotifications, clearNotifications } = notificationsSlice.actions;
export const { getNotifications} = notificationsSlice.selectors;
