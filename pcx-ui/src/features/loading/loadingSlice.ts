import {createAppSlice} from "../../app/createAppSlice.ts";
import {PayloadAction} from "@reduxjs/toolkit";

export const loadingSlice = createAppSlice({
    name: 'loading',
    initialState: {
        isLoading: false,
    },
    reducers: {
        setIsLoading: (state, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            .addMatcher(
                (action) => action.type.endsWith('/pending'),
                (state) => {
                    state.isLoading = true;
                }
            )
            .addMatcher(
                (action) =>
                    action.type.endsWith('/fulfilled') || action.type.endsWith('/rejected'),
                (state) => {
                    state.isLoading = false;
                }
            );
    },
    selectors: {
        selectIsLoading: (state) => state.isLoading,
    },
});

export const {setIsLoading} = loadingSlice.actions;
export const {selectIsLoading} = loadingSlice.selectors;