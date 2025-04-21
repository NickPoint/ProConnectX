import {Fade, FormControl, FormHelperText, Grid, MenuItem, Stack, Typography} from "@mui/material";
import {useAppDispatch, useAppSelector} from "../hooks.ts";
import {selectActiveField, setActiveField,} from "../../features/verification/verificationSlice.ts";
import {array, mixed, object, string} from "yup";
import Paper from "@mui/material/Paper";
import {useEffect, useRef, useState} from "react";
import {setTitle} from "../../features/page/pageSlice.ts";
import {useTranslation} from "react-i18next";
import {Info} from "@mui/icons-material";
import {StepperForm} from "../components/StepperForm.tsx";
import {
    MenuButtonBold,
    MenuButtonItalic,
    MenuControlsContainer,
    MenuDivider,
    MenuSelectHeading,
    RichTextEditor,
    RichTextEditorRef
} from "mui-tiptap";
import StarterKit from "@tiptap/starter-kit";
import {useCreateFreelancerMutation} from "../../features/api/enhancedApi.ts";
import {Select, TextField} from "formik-mui";
import AddressAutocomplete, {ExtendedAddress} from "../components/AddressAutocomplete.tsx";
import {FileUpload} from "../components/FileUpload.tsx";
import {Field, useField, useFormikContext} from "formik";
import {useLoadScript} from "@react-google-maps/api";
import {setIsLoading} from "../../features/loading/loadingSlice.ts";
import {Category} from "../../features/enums.ts";

const libraries: ('places')[] = ['places']

const contactDetailsValidationSchema = object({
    step1: object().shape({
        firstName: string().required('Required'),
        lastName: string().required('Required'),
        email: string().email('Invalid email format').required('Required'),
        address: object().shape({
            fullAddress: string().required('Required'),
            houseNumber: string().required('Required'),
        }),
        phoneNumber: string().required('Required'),
    })
});

const descriptionValidationSchema = object({
    step2: object().shape({
        description: string().required('Description is required'),
        categories: array().min(1, "At least one category required"),
    })
});

const avatarValidationSchema = object({
    step3: object().shape({
        avatarImage: mixed().required('Required'),
    })
})

export const FieldWithHelperText = ({name, label, required = false, fullWidth = true}) => {
    const dispatch = useAppDispatch();

    return (
        <Field
            name={name}
            label={label}
            required={required}
            fullWidth={fullWidth}
            component={TextField}
            onFocus={() => {
                dispatch(setActiveField(name));
            }}
        />
    );
};

const Step1 = () => {
    const dispatch = useAppDispatch();
    return (
        <Grid container spacing={1}>
            <Grid size={{xs: 6}}>
                <FieldWithHelperText name="step1.firstName" label="First Name" fullWidth required/>
            </Grid>
            <Grid size={{xs: 6}}>
                <FieldWithHelperText name="step1.lastName" label="Lasts Name" fullWidth required/>
            </Grid>
            <Grid size={{xs: 12}}>
                <FieldWithHelperText name="step1.email" label="Email" component={TextField} fullWidth required/>
            </Grid>
            <Grid size={{xs: 12}}>
                <FieldWithHelperText name="step1.phoneNumber" label="Phone Number" component={TextField} fullWidth
                                     required/>
            </Grid>
            <Grid size={12}>
                <AddressAutocomplete name="step1.address" label="Address"
                                     onFocus={(e) => {
                                         dispatch(setActiveField(e.target.name));
                                     }}/>
            </Grid>
        </Grid>
    )
}

const isVisuallyEmpty = (html: string) =>
    html
        // Remove all tags
        .replace(/<[^>]*>/g, '')
        // Remove HTML entities (e.g., &nbsp;)
        .replace(/&nbsp;|&#160;/gi, '')
        // Remove whitespace
        .trim() === '';

const Step2 = () => {
    const { setFieldValue, errors, touched, setFieldTouched } = useFormikContext<any>();
    const [field, , helpers] = useField('step2.categories');
    const dispatch = useAppDispatch();
    const rteRef = useRef<RichTextEditorRef>(null);

    return (
        <Grid container spacing={1}>
            <Grid size={12}>
                <FormControl fullWidth error={Boolean(touched?.step2?.description && errors?.step2?.description)}>
                    <RichTextEditor
                        ref={rteRef}
                        extensions={[StarterKit]}
                        onFocus={() => dispatch(setActiveField('step2.description'))}
                        onBlur={() => {
                            const rawHtml = rteRef.current?.editor?.getHTML() ?? '';
                            const normalizedHtml = isVisuallyEmpty(rawHtml) ? '' : rawHtml;
                            setFieldValue('step2.description', normalizedHtml).then(() =>
                                setFieldTouched('step2.description', true)
                            );
                        }}
                        renderControls={() => (
                            <MenuControlsContainer>
                                <MenuSelectHeading />
                                <MenuDivider />
                                <MenuButtonBold />
                                <MenuButtonItalic />
                                {/* More buttons */}
                            </MenuControlsContainer>
                        )}
                    />
                    {touched?.step2?.description && errors?.step2?.description && (
                        <FormHelperText>{errors.step2.description}</FormHelperText>
                    )}
                </FormControl>
            </Grid>
            <Grid size={12}>
                <FormControl required fullWidth>
                    {/*//TODO: brakes when push escape*/}
                    <Field component={Select}
                           name='step2.categories'
                           label='Categories'
                           multiple>
                        {Object.values(Category).map((category, index) => (
                            <MenuItem key={index} value={category}>
                                {category}
                            </MenuItem>
                        ))}
                    </Field>
                </FormControl>
            </Grid>
        </Grid>

    );
}

const Step3 = () => {
    return (
        <Grid size={12}>
            <FileUpload name='step3.avatarImage'/>
        </Grid>
    )
}

interface VerificationFormValues {
    step1: {
        firstName: string,
        lastName: string,
        email: string,
        address: ExtendedAddress,
        phoneNumber: string,
    },
    step2: {
        description: string,
        categories: string[]
    },
    step3: {
        avatarImage: File | undefined
    }
}

const initialValues: VerificationFormValues = {
    step1: {
        firstName: '',
        lastName: '',
        email: '',
        address: {
            fullAddress: '',
            street: '',
            city: '',
            region: '',
            postalCode: '',
            country: '',
            houseNumber: '',
        },
        phoneNumber: '',
    },
    step2: {
        description: '',
        categories: []
    },
    step3: {
        avatarImage: undefined
    }
}

function mapFormToRequest(values: VerificationFormValues): FormData {
    let formData = new FormData();
    formData.append('firstName', values.step1.firstName);
    formData.append('lastName', values.step1.lastName);
    formData.append('email', values.step1.email);
    formData.append('address', values.step1.address);
    formData.append('phoneNumber', values.step1.phoneNumber);
    formData.append('description', values.step2.description);
    formData.append('categories', values.step2.categories);
    formData.append('avatarImage', values.step3.avatarImage as File);
    return formData;
}

const VerificationPage = () => {
    const {t} = useTranslation();
    const dispatch = useAppDispatch();
    const activeField = useAppSelector(selectActiveField);
    const [createFreelancer] = useCreateFreelancerMutation();
    const [visible, setVisible] = useState(true);
    const [visibleText, setVisibleText] = useState(activeField);
    const { isLoaded } = useLoadScript({
        googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '',
        libraries,
    })

    useEffect(() => {
        dispatch(setIsLoading(!isLoaded));
    }, [isLoaded, dispatch]);

    useEffect(() => {
        dispatch(setTitle(t('verification.title')))
    }, [dispatch, t]);

    useEffect(() => {
        if (activeField !== visibleText) {
            setVisible(false);

            const timeout = setTimeout(() => {
                setVisibleText(activeField);
                setVisible(true);
            }, 300);

            return () => clearTimeout(timeout);
        }
    }, [activeField]);

    return (
        <Grid container spacing={{xs: 2, md: 4}} sx={{alignItems: 'center'}}>
            <Grid size={{xs: 12, md: 4}}>
                <Stack spacing={2}>
                    <Typography variant="h4">{t('verification.description.header')}</Typography>
                    <Typography variant="body1">{t('verification.description.body')}</Typography>
                    <Fade in={visible}>
                        <Paper variant='outlined' sx={{p: 1}}>
                            <Info color='primary'/>
                            <Typography>{t(`verification.form.steps.${visibleText}`)}</Typography>
                        </Paper>
                    </Fade>
                </Stack>
            </Grid>
            <Grid size={{xs: 12, md: 8}}>
                <StepperForm
                    submitPerStep={false}
                    steps={[
                        {
                            label: t('verification.form.steps.yourDetails'),
                            content: <Step1/>,
                            validationSchema: contactDetailsValidationSchema,
                        },
                        {
                            label: t('verification.form.steps.aboutYourself'),
                            content: <Step2/>,
                            validationSchema: descriptionValidationSchema
                        },
                        {
                            label: t('verification.form.steps.avatar'),
                            content: <Step3/>,
                            validationSchema: avatarValidationSchema
                        }
                    ]}
                    initialValues={initialValues}
                    onComplete={(values) =>
                        createFreelancer(mapFormToRequest(values)).unwrap()}/>
            </Grid>
        </Grid>
    );
}

export default VerificationPage;