import {Autocomplete, CircularProgress, Grid, Slide} from "@mui/material";
import {TextField} from "formik-mui";
import {Field, getIn, useField, useFormikContext} from "formik";
import {useRef} from "react";
import {selectLoading, selectSuggestions} from "../../features/placeAutocomplete/placeAutocompleteSlice";
import {useAppSelector} from "../hooks";
import usePlacesAutocomplete from "../hooks/usePlaceAutocomplete.ts";
import {AddressDto} from "../../features/api/pcxApi.ts";
import {useTranslation} from "react-i18next";

interface Props {
    name: string;
    label: string;
    onFocus?: (e) => void;
    childs?: string[];
}

export interface ExtendedAddress extends AddressDto {
    fullAddress: string
}

interface Props {
    name: string;
    label: string;
    onFocus?: (e: any) => void;
    childs?: string[];
    fullAddressFieldName?: string;
    required?: boolean;
    houseNumberRequired?: boolean;
    disabled?: boolean;
}

const AddressAutocomplete = ({
                                 name,
                                 label,
                                 onFocus,
                                 childs = ['street', 'city', 'region', 'postalCode', 'country'],
                                 fullAddressFieldName = 'fullAddress',
                                 required = true,
                                 houseNumberRequired = true,
                                 disabled = false,
                             }: Props) => {
    const [fullAddressField, {touched}] = useField(`${name}.${fullAddressFieldName}`);
    const [houseNumberMissing] = useField(`${name}._houseNumberMissing`);
    const {setFieldValue, errors} = useFormikContext<any>();
    const suggestions = useAppSelector(selectSuggestions);
    const loading = useAppSelector(selectLoading);
    const fetchSuggestions = usePlacesAutocomplete();
    const containerRef = useRef<HTMLDivElement>(null);
    const {t} = useTranslation();

    const addressErrors = getIn(errors, name) || {};
    const addressTouched = getIn(touched, name) || {};

    const generalFields = childs.filter(child => child !== 'houseNumber');

    const hasGeneralAddressError = generalFields.some(field => getIn(addressErrors, field) && touched);
    const combinedErrors = generalFields
        .map(field => getIn(addressErrors, field))
        .filter(Boolean)
        .join(', ');

    const handlePlaceSelect = async (placeId: string, label: string) => {
        try {
            const {Place} = await google.maps.importLibrary("places") as google.maps.PlacesLibrary;

            const place = new Place({id: placeId, requestedLanguage: "et"});
            await place.fetchFields({fields: ["addressComponents", "formattedAddress"]});

            const components = place.addressComponents || [];
            const get = (type: string) => components.find((c: any) => c.types.includes(type))?.longText || "";

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

            Object.entries(parsedAddress).forEach(([key, val]) => {
                setFieldValue(`${name}.${key}`, val);
            });

            setFieldValue(`${name}._houseNumberMissing`, !houseNumber);
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
                    disabled={disabled}
                    getOptionLabel={(option) => option.label}
                    loading={loading}
                    inputValue={fullAddressField.value}
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
                            name={`${name}.${fullAddressFieldName}`}
                            error={hasGeneralAddressError}
                            helperText={hasGeneralAddressError ? combinedErrors || t('form.error.address') : undefined}
                            InputProps={{
                                ...params.InputProps,
                                endAdornment: (
                                    <>
                                        {loading ? <CircularProgress color="inherit" size={20}/> : null}
                                        {params.InputProps.endAdornment}
                                    </>
                                ),
                            }}
                            required={required}
                            onFocus={onFocus}
                        />
                    )}
                />
            </Grid>

            <Slide unmountOnExit direction='left'
                   in={houseNumberMissing.value && childs?.some(child => child === 'houseNumber')}
                   container={containerRef.current}>
                <Grid size={4}>
                    <Field
                        name={`${name}.houseNumber`}
                        label={t('form.fields.houseNumber')}
                        component={TextField}
                        fullWidth
                        required={houseNumberRequired}
                    />
                </Grid>
            </Slide>
        </Grid>
    );
};

export default AddressAutocomplete;
