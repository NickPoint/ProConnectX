import {createAppSlice} from "../../app/createAppSlice.ts";
import {PayloadAction} from "@reduxjs/toolkit";

type Tab = 'home' | 'orders' | 'services'
interface DashboardSlice {
    activeTab: Tab
}

const initialState: DashboardSlice = {
    activeTab: 'home',
}

export const dashboardSlice = createAppSlice({
    name: "dashboard",
    initialState,
    reducers: {
        setActiveTab: (state, action: PayloadAction<Tab>) => {
            state.activeTab = action.payload;
        }
    },
    selectors: {
        selectActiveTab: state => state.activeTab,
    }
})

export const {setActiveTab} = dashboardSlice.actions;
export const {selectActiveTab} = dashboardSlice.selectors;