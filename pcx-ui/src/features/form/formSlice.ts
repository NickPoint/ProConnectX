import {createSlice, PayloadAction} from "@reduxjs/toolkit";

interface FormState {
    activeField: string | undefined
    [formName: string]: any
}

const initialState: FormState = {
    activeField: undefined,
}

export const formSlise = createSlice({
    name: "form",
    initialState,
    reducers: {
        setActiveField: (state, action: PayloadAction<string>) => {
            state.activeField = action.payload;
        },
        setFormData: (state, action: PayloadAction<{formName: string, data: any}>) => {
            state[action.payload.formName] = action.payload.data;
        },
        clearFormData(state, action: PayloadAction<string>) {
            delete state[action.payload];
        },
    },
    selectors: {
        selectActiveField: (state) => state.activeField,
        selectFormData: (state, name) => state[name]
    }
});

export const {setActiveField, setFormData, clearFormData} = formSlise.actions

export const {selectActiveField, selectFormData} = formSlise.selectors