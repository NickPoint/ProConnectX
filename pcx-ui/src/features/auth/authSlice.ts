import {createSlice, PayloadAction} from '@reduxjs/toolkit'
import {AuthResponse} from "../api/pcxApi";
import {useAppSelector} from "../../app/hooks";

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
    },
})

export const userHasRole = (role: string) => {
    const user = useAppSelector(selectUser);
    return user?.roles?.includes(role);
}

export const { logout,  setCredentials } = authSlice.actions

export const { selectUser } = authSlice.selectors