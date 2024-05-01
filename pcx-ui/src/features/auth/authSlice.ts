import {createSlice, PayloadAction} from '@reduxjs/toolkit'
import {useCookies} from "react-cookie";
import {UserInfoResponse} from "../api/pcxApi";

interface AuthState {
    user: UserInfoResponse | null;
}

const initialState: AuthState = {
    user: null,
}

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout: () => initialState,
        setCredentials: (state, action: PayloadAction<UserInfoResponse>) => {
            state.user = action.payload;
        },
    },
    selectors: {
        selectUser: state => state.user,
    },
})

export const { logout, setCredentials } = authSlice.actions

export const { selectUser } = authSlice.selectors