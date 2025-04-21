import {createAppSlice} from "../../app/createAppSlice.ts";
import {PayloadAction} from "@reduxjs/toolkit";

interface PageState {
    title: string;
}

const initialState: PageState = {
    title: ''
}

export const pageSlice = createAppSlice({
    name: "page",
    initialState,
    reducers: {
        setTitle: (state, action: PayloadAction<string>) => {
            state.title = action.payload;
        },
    },
    selectors: {
        selectTitle: state => state.title,
    }
})

export const {setTitle} = pageSlice.actions;
export const {selectTitle} = pageSlice.selectors;