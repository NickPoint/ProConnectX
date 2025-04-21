import {createSlice, PayloadAction} from "@reduxjs/toolkit";

interface VerificationState {
    activeField: string | undefined
}

const initialState: VerificationState = {
    activeField: undefined,
}

export const verificationPage = createSlice({
    name: "verification",
    initialState,
    reducers: {
        setActiveField: (state, action: PayloadAction<string>) => {
            state.activeField = action.payload;
        }
    },
    selectors: {
        selectActiveField: (state) => state.activeField,
    }
});

export const {setActiveField} = verificationPage.actions

export const {selectActiveField} = verificationPage.selectors