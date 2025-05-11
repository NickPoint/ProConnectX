import {Fade, Grid, Stack, Typography} from "@mui/material";
import {useAppDispatch, useAppSelector} from "../hooks.ts";
import {selectActiveField,} from "../../features/form/formSlice.ts";
import * as yup from 'yup';
import Paper from "@mui/material/Paper";
import {useEffect, useState} from "react";
import {setTitle} from "../../features/page/pageSlice.ts";
import {useTranslation} from "react-i18next";
import {Info} from "@mui/icons-material";
import {StepperForm} from "../components/StepperForm.tsx";
import {useCreateFreelancerMutation} from "../../features/api/enhancedApi.ts";
import {ExtendedAddress} from "../components/AddressAutocomplete.tsx";
import {useLoadScript} from "@react-google-maps/api";
import {setIsLoading} from "../../features/loading/loadingSlice.ts";
import {useSelector} from "react-redux";
import {RootState} from "../store.ts";
import {FieldRenderer} from "../components/FieldRenderer.tsx";
import {FormStepsConfig, generateInitialValuesFromConfig, generateValidationSchema} from "../components/formUtils.ts";
import {enqueueSnackbar} from "notistack";
import {useNavigate} from "react-router-dom";
import {CategoryType} from "../../features/api/pcxApi.ts";

const libraries: ('places')[] = ['places']

export const formFields: FormStepsConfig = {
    step1: {
        firstName: { label: 'firstName', required: true, type: 'text', size: 6 },
        lastName: { label: 'lastName', required: true, type: 'text', size: 6 },
        phoneNumber: { label: 'phoneNumber', required: true, type: 'text', size: 12 },
        address: {
            type: 'addressGroup',
            size: 12,
            fields: {
                fullAddress: { label: 'address', required: true, type: 'place', size: 12 },
                houseNumber: { label: 'houseNumber', required: true, type: 'text', size: 4 },
                street: { label: 'street', required: true, type: 'text', size: 12 },
                city: { label: 'city', required: true, type: 'text', size: 6 },
                region: { label: 'region', required: true, type: 'text', size: 6 },
                postalCode: { label: 'postalCode', required: true, type: 'text', size: 6 },
                country: { label: 'country', required: true, type: 'text', size: 6 },
            }
        }
    },
    step2: {
        description: { label: 'description', required: true, type: 'richtext', size: 12 },
        categories: {
            label: 'categories',
            required: true,
            min: 1,
            type: 'select',
            enum: CategoryType,
            multiple: true,
            size: 12
        }
    },
    step3: {
        avatarImage: { label: 'avatarImage', required: true, min: 1, type: 'file', size: 12, allowedMimeTypes: ['image/'], maxSize: true },
        idDocuments: { label: 'idDocument', required: true, min: 1, max: 2, type: 'file', multiple: true, size: 12, maxSize: true }
    }
};

const Step1 = () => {
    return (
        <Grid container spacing={1}>
            {Object.entries(formFields.step1).map(([fieldName, fieldConfig]) => (
                <FieldRenderer key={fieldName} step="step1" fieldName={fieldName} fieldConfig={fieldConfig}/>
            ))}
        </Grid>
    );
};


const Step2 = () => {
    return (
        <Grid container spacing={1}>
            {Object.entries(formFields.step2).map(([fieldName, fieldConfig]) => (
                <FieldRenderer key={fieldName} step="step2" fieldName={fieldName} fieldConfig={fieldConfig}/>
            ))}
        </Grid>
    );
};


const Step3 = () => {
    return (
        <Grid container spacing={1}>
            {Object.entries(formFields.step3).map(([fieldName, fieldConfig]) => (
                <FieldRenderer key={fieldName} step="step3" fieldName={fieldName} fieldConfig={fieldConfig}/>
            ))}
        </Grid>
    );
};

interface VerificationFormValues {
    step1: {
        firstName: string,
        lastName: string,
        address: ExtendedAddress,
        phoneNumber: string,
    },
    step2: {
        description: string,
        categories: string[]
    },
    step3: {
        avatarImage: FileList | File[]
        idDocuments: FileList | File[]
    }
}

function mapFormToRequest(values: VerificationFormValues): FormData {
    let formData = new FormData();
    formData.append('firstName', values.step1.firstName);
    formData.append('lastName', values.step1.lastName);
    formData.append('address.street', values.step1.address.street);
    formData.append('address.city', values.step1.address.city);
    formData.append('address.region', values.step1.address.region);
    formData.append('address.postalCode', values.step1.address.postalCode);
    formData.append('address.country', values.step1.address.country);
    formData.append('address.houseNumber', values.step1.address.houseNumber);
    formData.append('phoneNumber', values.step1.phoneNumber);
    formData.append('description', values.step2.description);
    formData.append('categories', values.step2.categories);
    formData.append('avatarImage', values.step3.avatarImage[0]);
    Array.from(values.step3.idDocuments).forEach((file) => {
        formData.append('idDocuments', file);
    })
    return formData;
}

const FreelancerVerificationPage = () => {
    const {t} = useTranslation();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const activeField = useAppSelector(selectActiveField);
    const FORM_NAME = "freelancer-verification";
    const cachedFormData = useSelector((state: RootState) => state.form[FORM_NAME]);
    const [createFreelancer] = useCreateFreelancerMutation();
    const [visible, setVisible] = useState(true);
    const [visibleText, setVisibleText] = useState(activeField);

    const initialValues: VerificationFormValues = cachedFormData
        || generateInitialValuesFromConfig(formFields);

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
                    formName={FORM_NAME}
                    submitPerStep={false}
                    steps={[
                        {
                            label: 'verification.form.steps.yourDetails',
                            content: <Step1/>,
                            validationSchema: yup.object().shape({
                                step1: generateValidationSchema(formFields.step1)
                            })
                        },
                        {
                            label: 'verification.form.steps.aboutYourself',
                            content: <Step2/>,
                            validationSchema: yup.object().shape({
                                step2: generateValidationSchema(formFields.step2)
                            })
                        },
                        {
                            label: 'verification.form.steps.avatar',
                            content: <Step3/>,
                            validationSchema: yup.object().shape({
                                step3: generateValidationSchema(formFields.step3)
                            })
                        }
                    ]}
                    initialValues={initialValues}
                    onComplete={(values) =>
                        createFreelancer(mapFormToRequest(values)).unwrap()
                            .then(() => {
                                enqueueSnackbar(t('verification.form.success'), {variant: 'success'})
                                navigate('/dashboard/home', {replace: true});
                            })}/>
            </Grid>
        </Grid>
    );
}

export default FreelancerVerificationPage;