import {createSlice, PayloadAction} from '@reduxjs/toolkit'
import {AuthResponse, RoleType} from "../api/pcxApi";

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
        hasClientRole: state => state.user?.roles.includes(RoleType.RoleClient),
    },
})

export const {logout, setCredentials} = authSlice.actions

export const {selectUser, hasClientRole} = authSlice.selectors