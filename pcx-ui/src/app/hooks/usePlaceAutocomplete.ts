import {useCallback} from "react";
import {
    selectCache,
    setCacheEntry,
    setLoading,
    setSuggestions
} from "../../features/placeAutocomplete/placeAutocompleteSlice";
import {useAppDispatch, useAppSelector} from "../hooks";
import {debounce} from "@mui/material";

const usePlacesAutocomplete = () => {
    const dispatch = useAppDispatch();
    const cache = useAppSelector(selectCache);

    const fetchSuggestions = useCallback(
        debounce(async (input: string) => {
            if (!input || input.length < 3) {
                dispatch(setSuggestions([]));
                return;
            }

            if (cache[input]) {
                dispatch(setSuggestions(cache[input]));
                return;
            }

            dispatch(setLoading(true));

            try {
                // @ts-ignore
                const { isLoading, AutocompleteSuggestion, AutocompleteSessionToken } =
                    await google.maps.importLibrary("places");

                const token = new google.maps.places.AutocompleteSessionToken();

                const request = {
                    input,
                    sessionToken: token,
                    includedRegionCodes: ["ee"],
                    language: "et",
                };

                // @ts-ignore
                const { suggestions } = await AutocompleteSuggestion.fetchAutocompleteSuggestions(request);

                const formatted = suggestions.map((s: any) => ({
                    id: s.placePrediction.placeId,
                    label: s.placePrediction.text.toString(),
                }));

                dispatch(setSuggestions(formatted));
                dispatch(setCacheEntry({ key: input, value: formatted }));
            } catch (e) {
                console.error("Autocomplete error:", e);
            } finally {
                dispatch(setLoading(false));
            }
        }, 300),
        [cache, dispatch]
    );

    return fetchSuggestions;
};

export default usePlacesAutocomplete;
