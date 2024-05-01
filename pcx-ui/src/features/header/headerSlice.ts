import {createAppSlice} from "../../app/createAppSlice"
import {PayloadAction} from "@reduxjs/toolkit";

export interface HeaderSliceState {
    anchorElNav: boolean,
    anchorElUser: boolean,
    activeTab: string,
}

const initialState: HeaderSliceState = {
    anchorElNav: false,
    anchorElUser: false,
    activeTab: "home",
}

// If you are not using async thunks you can use the standalone `createSlice`.
// TODO: Does it impact anything if i use createSlice instead of createAppSlice?
export const headerSlice = createAppSlice({
    name: "header",
    initialState,
    reducers: create => ({
        setAnchorElNav: create.reducer((state, action : PayloadAction<boolean>) => {
            state.anchorElNav = action.payload;
        }),
        setAnchorElUser: create.reducer((state, action : PayloadAction<boolean>) => {
            state.anchorElUser = action.payload;
        }),
        setActiveTab: create.reducer((state, action : PayloadAction<string>) => {
            state.activeTab = action.payload;
        }),
    }),
    selectors: {
        selectAnchorElNav: header => header.anchorElNav,
        selectAnchorElUser: header => header.anchorElUser,
        selectActiveTab: header => header.activeTab,
    },
})

export const {setAnchorElNav, setAnchorElUser, setActiveTab} = headerSlice.actions;

export const {selectAnchorElNav, selectAnchorElUser, selectActiveTab} = headerSlice.selectors;