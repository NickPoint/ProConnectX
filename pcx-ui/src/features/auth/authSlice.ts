import {createSlice, PayloadAction} from '@reduxjs/toolkit'
import {AuthResponse, ERole} from "../api/pcxApi";
import {useAppSelector} from "../../app/hooks";
import {RootState} from "../../app/store.ts";

interface AuthState {
    user: AuthResponse | null;
}

const initialState: AuthState = {
    user: null,
}

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout: () => initialState,
        setCredentials: (state, action: PayloadAction<AuthResponse>) => {
            state.user = action.payload;
        },
    },
    selectors: {
        selectUser: state => state.user,
        hasClientRole: state => state.user?.roles.includes(ERole.RoleClient),
    },
})

export const {logout, setCredentials} = authSlice.actions

export const {selectUser, hasClientRole} = authSlice.selectors