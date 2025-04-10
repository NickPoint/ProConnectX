import {createAppSlice} from "../../app/createAppSlice.ts";
import {PayloadAction} from "@reduxjs/toolkit";
import {FabProps} from "@mui/material";
import {SvgIconComponent} from "@mui/icons-material";

interface FabState {
    buttons: { id: string; fabProps: FabProps, visible: boolean, icon: string }[];
}

const initialState: FabState = {
    buttons: []
}

export const fabSlice = createAppSlice({
    name: 'fab',
    initialState,
    reducers: {
        addFab: (state, action: PayloadAction<{id: string, fabProps: FabProps, visible: boolean, icon: string}>) => {
            state.buttons.push(action.payload);
        },
        hideFab: (state, action: PayloadAction<string>) => {
            const button = state.buttons.find((button) => button.id === action.payload);
            if (button) button.visible = false;
        },
        removeFab: (state, action: PayloadAction<string>)=> {
            state.buttons = state.buttons.filter(button => button.id !== action.payload);
        },
        clearFabs: (state) => {
            state.buttons = []
        }
    },
    selectors: {
        selectFabs: state => state.buttons,
    }
})

export const {addFab, removeFab, clearFabs, hideFab} = fabSlice.actions;
export const {selectFabs} = fabSlice.selectors;