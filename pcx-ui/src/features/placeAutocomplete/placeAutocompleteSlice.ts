import {PayloadAction} from "@reduxjs/toolkit";
import {createAppSlice} from "../../app/createAppSlice.ts";

interface PlaceSuggestion {
    id: string;
    label: string;
    fullPlace?: google.maps.places.Place;
}

interface PlacesAutocompleteState {
    suggestions: PlaceSuggestion[];
    cache: Record<string, PlaceSuggestion[]>;
    loading: boolean;
    error?: string;
}

const initialState: PlacesAutocompleteState = {
    suggestions: [],
    cache: {},
    loading: false,
};

export const placesAutocompleteSlice = createAppSlice({
    name: "placesAutocomplete",
    initialState,
    reducers: {
        setSuggestions: (state, action: PayloadAction<PlaceSuggestion[]>) => {
            state.suggestions = action.payload;
        },
        setCacheEntry: (state, action: PayloadAction<{ key: string; value: PlaceSuggestion[] }>) => {
            state.cache[action.payload.key] = action.payload.value;
        },
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload;
        },
        setError: (state, action: PayloadAction<string | undefined>) => {
            state.error = action.payload;
        },
    },
    selectors: {
        selectSuggestions: state => state.suggestions,
        selectLoading: state => state.loading,
        selectCache: state => state.cache,
    },
});

export const {
    setSuggestions,
    setCacheEntry,
    setLoading,
    setError,
} = placesAutocompleteSlice.actions;

export const {
    selectSuggestions,
    selectLoading,
    selectCache,
} = placesAutocompleteSlice.selectors;
