import * as React from 'react';
import Box from '@mui/material/Box';
import Autocomplete from '@mui/material/Autocomplete';
import Paper, {PaperProps} from '@mui/material/Paper';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import {useTheme} from '@mui/material/styles';
import parse from 'autosuggest-highlight/parse';
// For the sake of this demo, we have to use debounce to reduce Google Maps Places API quote use
// But prefer to use throttle in practice
// import throttle from 'lodash/throttle';
import {debounce} from '@mui/material/utils';
import {getIn, useField, useFormikContext} from "formik";
import {useTranslation} from "react-i18next";
import TextField from "@mui/material/TextField";

// This key was created specifically for the demo in mui.com.
// You need to create a new one for your application.
const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';

const useEnhancedEffect =
    typeof window !== 'undefined' ? React.useLayoutEffect : React.useEffect;

function loadScript(src: string, position: HTMLElement) {
    const script = document.createElement('script');
    script.setAttribute('async', '');
    script.src = src;
    position.appendChild(script);
    return script;
}

interface MainTextMatchedSubstrings {
    offset: number;
    length: number;
}

interface StructuredFormatting {
    main_text: string;
    main_text_matched_substrings: readonly MainTextMatchedSubstrings[];
    secondary_text?: string;
}

export interface PlaceType {
    placeId: string;
    description: string;
    structured_formatting: StructuredFormatting;
}

function CustomPaper(props: PaperProps) {
    const theme = useTheme();

    return (
        <Paper {...props}>
            {props.children}
            {/* Legal requirment https://developers.google.com/maps/documentation/javascript/policies#logo */}
            <Box
                sx={(staticTheme) => ({
                    display: 'flex',
                    justifyContent: 'flex-end',
                    p: 1,
                    pt: '1px',
                    ...staticTheme.applyStyles('dark', {
                        opacity: 0.8,
                    }),
                })}
            >
                <img
                    src={
                        theme.palette.mode === 'dark'
                            ? 'https://maps.gstatic.com/mapfiles/api-3/images/powered-by-google-on-non-white3_hdpi.png'
                            : 'https://maps.gstatic.com/mapfiles/api-3/images/powered-by-google-on-white3_hdpi.png'
                    }
                    alt=""
                    width="120"
                    height="14"
                />
            </Box>
        </Paper>
    );
}

const fetch = debounce(
    async (
        request: { input: string; sessionToken: any, includedRegionCodes: string[], language: string },
        callback: (results?: readonly PlaceType[]) => void,
    ) => {
        try {
            const {suggestions} = await (
                window as any
            ).google.maps.places.AutocompleteSuggestion.fetchAutocompleteSuggestions(
                request,
            );

            callback(
                suggestions.map((suggestion: any) => {
                    const place = suggestion.placePrediction;
                    // Map to the old AutocompleteService.getPlacePredictions format
                    // https://developers.google.com/maps/documentation/javascript/places-migration-autocomplete
                    return {
                        placeId: place.placeId,
                        description: place.text.text,
                        structured_formatting: {
                            main_text: place.mainText.text,
                            main_text_matched_substrings: place.mainText.matches.map(
                                (match: any) => ({
                                    offset: match.startOffset,
                                    length: match.endOffset - match.startOffset,
                                }),
                            ),
                            secondary_text: place.secondaryText?.text,
                        },
                    };
                }),
            );
        } catch (err: any) {
            throw err;
        }
    },
    400,
);

const emptyOptions = [] as any;
let sessionToken: any;

interface Props {
    name: string;
    label: string;
    onFocus?: (e: any) => void;
    childs?: string[];
    fullAddressFieldName?: string;
    required?: boolean;
    houseNumberRequired?: boolean;
    disabled?: boolean;
    size?: number;
}

export default function GoogleMaps({
                                       name,
                                       label,
                                       onFocus,
                                       size = 12,
                                       childs = ['street', 'city', 'region', 'postalCode', 'country'],
                                       fullAddressFieldName = 'fullAddress',
                                       required = true,
                                       disabled = false,
                                   }: Props) {
    const [_, {value, touched}, {setValue}] = useField(`${name}.${fullAddressFieldName}`);

    const {setFieldValue, errors, values} = useFormikContext<any>();
    const [inputValue, setInputValue] = React.useState('');
    const [options, setOptions] = React.useState<readonly PlaceType[]>(emptyOptions);
    const callbackId = React.useId().replace(/:/g, '');
    const [loaded, setLoaded] = React.useState(false);
    const {t} = useTranslation();

    const addressErrors = getIn(errors, name) || {};

    const hasGeneralAddressError = childs.some((field) => getIn(addressErrors, field)) && touched;
    const combinedErrors = childs
        .map(field => getIn(addressErrors, field))
        .filter(Boolean)
        .join(', ');

    const handlePlaceSelect = async (placeType: PlaceType | null) => {
        const emptyAddress = {
            fullAddress: '',
            street: '',
            city: '',
            region: '',
            postalCode: '',
            country: '',
            houseNumber: '',
        };

        if (!placeType?.placeId) {
            Object.entries(emptyAddress).map(([key, val]) => {
                setFieldValue(`${name}.${key}`, val, true);
            })
            return;
        }

        try {
            const { Place } = await google.maps.importLibrary("places") as google.maps.PlacesLibrary;
            const googlePlace = new Place({ id: placeType.placeId, requestedLanguage: "et" });
            await googlePlace.fetchFields({ fields: ["addressComponents", "formattedAddress"] });

            const components = googlePlace.addressComponents || [];
            const getComponentValue = (type: string) =>
                components.find((c) => c.types.includes(type))?.longText || "";

            const houseNumber = getComponentValue("street_number");

            const parsedAddress = {
                fullAddress: placeType,
                street: getComponentValue("route"),
                city: getComponentValue("locality"),
                region: getComponentValue("administrative_area_level_1"),
                postalCode: getComponentValue("postal_code"),
                country: getComponentValue("country"),
                houseNumber,
            };

            Object.entries(parsedAddress).map(([key, val]) => {
                setFieldValue(`${name}.${key}`, val);
            })

        } catch (error) {
            console.error("Failed to parse address from Google Place API", error);
        }
    };

    if (typeof window !== 'undefined') {
        if (!document.querySelector('#google-maps')) {
            const GOOGLE_NAMESPACE = '_google_callback';
            const globalContext =
                // @ts-ignore
                window[GOOGLE_NAMESPACE] || (window[GOOGLE_NAMESPACE] = {});
            globalContext[callbackId] = () => {
                setLoaded(true);
            };

            const script = loadScript(
                `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places&loading=async&callback=${GOOGLE_NAMESPACE}.${callbackId}`,
                document.querySelector('head')!,
            );
            script.id = 'google-maps';
        } else if ((window as any).google && !loaded) {
            setLoaded(true);
        }
    }

    useEnhancedEffect(() => {
        if (!loaded) {
            return undefined;
        }

        if (inputValue === '') {
            setOptions(value ? [value] : emptyOptions);
            return undefined;
        }

        // Allow to resolve the out of order request resolution.
        let active = true;

        if (!sessionToken) {
            sessionToken = new (
                window as any
            ).google.maps.places.AutocompleteSessionToken();
        }

        fetch({
            input: inputValue,
            sessionToken,
            includedRegionCodes: ["ee"],
            language: "et"
        }, (results?: readonly PlaceType[]) => {
            if (!active) {
                return;
            }

            let newOptions: readonly PlaceType[] = [];

            if (results) {
                newOptions = results;

                if (value) {
                    newOptions = [
                        value,
                        ...results.filter((result) => result.description !== value.description),
                    ];
                }
            } else if (value) {
                newOptions = [value];
            }
            setOptions(newOptions);
        });

        return () => {
            active = false;
        };
    }, [value, inputValue, loaded]);

    return (
        <Grid size={size}>
            <Autocomplete
                getOptionLabel={(option) =>
                    typeof option === 'string' ? option : option.description
                }
                filterOptions={(x) => x}
                slots={{
                    paper: CustomPaper,
                }}
                options={options}
                autoComplete
                includeInputInList
                filterSelectedOptions
                loading={!loaded}
                value={value}
                disabled={disabled}
                noOptionsText="No locations"
                onChange={(event: any, newValue: PlaceType | null) => {
                    setOptions(newValue ? [newValue, ...options] : options);
                    setValue(newValue);
                    handlePlaceSelect(newValue)
                }}
                onInputChange={(event, newInputValue) => {
                    setInputValue(newInputValue);
                }}
                renderInput={(params) => (
                    <TextField {...params}
                           label={label}
                           fullWidth
                           error={hasGeneralAddressError}
                           helperText={hasGeneralAddressError ? combinedErrors || t('form.error.address') : undefined}
                           required={required}
                           onFocus={onFocus}
                    />
                )}
                renderOption={(props, option) => {
                    const {key, ...optionProps} = props;
                    if (!option || typeof option === "string" || !option.structured_formatting) {
                        return null;
                    }
                    const matches = option.structured_formatting.main_text_matched_substrings;

                    const parts = parse(
                        option.structured_formatting.main_text,
                        matches.map((match: any) => [match.offset, match.offset + match.length]),
                    );
                    return (
                        <li key={key} {...optionProps}>
                            <Grid container sx={{alignItems: 'center'}}>
                                <Grid sx={{display: 'flex', width: 44}}>
                                    <LocationOnIcon sx={{color: 'text.secondary'}}/>
                                </Grid>
                                <Grid sx={{width: 'calc(100% - 44px)', wordWrap: 'break-word'}}>
                                    {parts.map((part, index) => (
                                        <Box
                                            key={index}
                                            component="span"
                                            sx={{
                                                fontWeight: part.highlight
                                                    ? 'fontWeightBold'
                                                    : 'fontWeightRegular',
                                            }}
                                        >
                                            {part.text}
                                        </Box>
                                    ))}
                                    {option.structured_formatting.secondary_text ? (
                                        <Typography variant="body2" sx={{color: 'text.secondary'}}>
                                            {option.structured_formatting.secondary_text}
                                        </Typography>
                                    ) : null}
                                </Grid>
                            </Grid>
                        </li>
                    );
                }}
            />
        </Grid>
    );
}