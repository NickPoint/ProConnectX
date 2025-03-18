import {createAppSlice} from "../../app/createAppSlice"
import {PayloadAction} from "@reduxjs/toolkit";

export interface HeaderSliceState {
    addButtonVisible: boolean;
}

const initialState: HeaderSliceState = {
    addButtonVisible: false,
}

// If you are not using async thunks you can use the standalone `createSlice`.
// TODO: Does it impact anything if i use createSlice instead of createAppSlice?
export const footerSlice = createAppSlice({
    name: "header",
    initialState,
    reducers: create => ({
        setAddButtonVisible: create.reducer((state, action: PayloadAction<boolean>) => {
            state.addButtonVisible = action.payload;
        }),
    }),
    selectors: {
        selectAddButtonVisible: state => state.addButtonVisible,
    },
})

export const {setAddButtonVisible} = footerSlice.actions;

export const {selectAddButtonVisible} = footerSlice.selectors;