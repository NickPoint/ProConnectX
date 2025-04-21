import {Autocomplete, CircularProgress, Grid, Slide} from "@mui/material";
import {TextField} from "formik-mui";
import {Field, useField, useFormikContext} from "formik";
import {useRef, useState} from "react";
import {selectLoading, selectSuggestions} from "../../features/placeAutocomplete/placeAutocompleteSlice";
import {useAppSelector} from "../hooks";
import usePlacesAutocomplete from "../hooks/usePlaceAutocomplete.ts";
import {AddressDto} from "../../features/api/pcxApi.ts";
import {useTranslation} from "react-i18next";
import {FieldWithHelperText} from "../pages/VerificationPage.tsx";

interface Props {
    name: string;
    label: string;
    onFocus?: (e) => void;
}

export interface ExtendedAddress extends AddressDto {
    fullAddress: string
}

const AddressAutocomplete = ({name, label, onFocus}: Props) => {
    const [field, , helpers] = useField(`${name}.fullAddress`);
    const {setTouched, setFieldValue} = useFormikContext<any>();
    const [inputValue, setInputValue] = useState<string>('');
    const [value, setValue] = useState(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [houseNumberEmpty, setHouseNumberEmpty] = useState<boolean>(false);
    const {t} = useTranslation();

    const suggestions = useAppSelector(selectSuggestions);
    const loading = useAppSelector(selectLoading);
    const fetchSuggestions = usePlacesAutocomplete();

    const handlePlaceSelect = async (placeId: string, label: string) => {
        try {
            const {Place} = await google.maps.importLibrary("places") as google.maps.PlacesLibrary;

            const place = new Place({id: placeId, requestedLanguage: "et"});
            await place.fetchFields({
                fields: ["addressComponents", "formattedAddress"],
            });

            const components = place.addressComponents || [];
            const get = (type: string) =>
                components.find((c: any) => c.types.includes(type))?.longText || "";

            const houseNumber = get("street_number");

            const parsedAddress = {
                fullAddress: place.formattedAddress || label,
                street: get("route"),
                city: get("locality"),
                region: get("administrative_area_level_1"),
                postalCode: get("postal_code"),
                country: get("country"),
                houseNumber: houseNumber,
            };

            console.log(parsedAddress);

            Object.entries(parsedAddress).forEach(([key, val]) => {
                setFieldValue(`${name}.${key}`, val);
            });

            if (houseNumber === "") {
                setHouseNumberEmpty(true);
            }
        } catch (err) {
            console.error("Address parsing failed", err);
        }
    };

    return (
        <Grid container spacing={1} ref={containerRef}>
            <Grid size='grow'>
                <Autocomplete
                    freeSolo
                    options={suggestions}
                    getOptionLabel={(option) => option.label}
                    loading={loading}
                    inputValue={field.value}
                    onInputChange={(_, value) => {
                        fetchSuggestions(value);
                    }}
                    onChange={(_, value) => {
                        if (value) {
                            handlePlaceSelect(value.id, value.label);
                        }
                    }}
                    renderInput={(params) => (
                        <Field
                            component={TextField}
                            {...params}
                            label={label}
                            name={`${name}.fullAddress`}
                            InputProps={{
                                ...params.InputProps,
                                endAdornment: (
                                    <>
                                        {loading ? <CircularProgress color="inherit" size={20}/> : null}
                                        {params.InputProps.endAdornment}
                                    </>
                                ),
                            }}
                            required
                            onFocus={onFocus}
                        />
                    )}
                />
            </Grid>
            <Slide unmountOnExit in={houseNumberEmpty} container={containerRef.current}>
                <Grid size={4}>
                    <FieldWithHelperText name={`${name}.houseNumber`} label={t('address.houseNumber')}
                           component={TextField} fullWidth required />
                </Grid>
            </Slide>
        </Grid>
    );
};

export default AddressAutocomplete;
