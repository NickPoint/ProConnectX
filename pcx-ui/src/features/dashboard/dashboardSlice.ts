import {createAppSlice} from "../../app/createAppSlice.ts";
import {PayloadAction} from "@reduxjs/toolkit";

interface DashboardSlice {
    activeTab: 'home' | 'analytics' | 'clients' | 'orders' | 'registrationRequest',
}

const initialState = {
    activeTab: 'home',
}

export const dashboardSlice = createAppSlice({
    name: "dashboard",
    initialState,
    reducers: {
        setActiveTab: (state, action: PayloadAction<string>) => {
            state.activeTab = action.payload;
        }
    },
    selectors: {
        selectActiveTab: state => state.activeTab,
    }
})

export const {setActiveTab} = dashboardSlice.actions;
export const {selectActiveTab} = dashboardSlice.selectors;