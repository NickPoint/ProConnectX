import {createAppSlice} from "../../app/createAppSlice.ts";
import {PayloadAction} from "@reduxjs/toolkit";

const initialState = {
    open: false,
    signup: false,
    email: "",
}

export const authFormSlice = createAppSlice({
    name: 'authForm',
    initialState,
    reducers: {
        setOpen: (state, action: PayloadAction<boolean>) => {
            state.open = action.payload;
        },
        setSignup: (state, action: PayloadAction<boolean>) => {
            state.signup = action.payload;
        },
        setEmail: (state, action: PayloadAction<string>) => {
            state.email = action.payload;
        }
    },
    selectors: {
        selectOpen: state => state.open,
        selectSignup: state => state.signup,
        selectEmail: state => state.email,
    }
})

export const {setOpen, setSignup, setEmail} = authFormSlice.actions;
export const {selectOpen, selectSignup, selectEmail} = authFormSlice.selectors;