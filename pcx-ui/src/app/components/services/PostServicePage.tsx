import * as yup from "yup";
import {CategoryType, Faq, ServiceAddressDto, WorkflowStep} from "../../../features/api/pcxApi";
import {useCreateServiceMutation} from "../../../features/api/enhancedApi";
import Grid from "@mui/material/Grid"
import {Fade, Stack, Typography} from "@mui/material";
import {StepperForm} from "../StepperForm.tsx";
import Paper from "@mui/material/Paper";
import {Info} from "@mui/icons-material";
import {useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import {enqueueSnackbar} from "notistack";
import {useTranslation} from "react-i18next";
import {useLoadScript} from "@react-google-maps/api";
import {setIsLoading} from "../../../features/loading/loadingSlice.ts";
import {setTitle} from "../../../features/page/pageSlice.ts";
import {useAppDispatch, useAppSelector} from "../../hooks.ts";
import {selectActiveField} from "../../../features/form/formSlice.ts";
import {FormStepsConfig, generateInitialValuesFromConfig, generateValidationSchema} from "../formUtils.ts";
import {FieldRenderer} from "../FieldRenderer.tsx";
import {useSelector} from "react-redux";
import {RootState} from "../../store.ts";

const formFields: FormStepsConfig = {
    step1: {
        title: {
            label: 'title',
            required: true,
            type: 'text',
            size: 12,
        },
        price: {
            label: 'price',
            required: true,
            type: 'number',
            size: 12,
            min: 1,
        },
        address: {
            type: 'addressGroup',
            required: false,
            size: 12,
            fields: {
                fullAddress: { label: 'address', type: 'place', required: false },
                houseNumber: { label: 'houseNumber', type: 'text' },
                street: { label: 'street', type: 'text' },
                postalCode: { label: 'postalCode', type: 'text' },
                city: {
                    label: 'city',
                    type: 'text',
                    dependsOn: { field: 'fullAddress' }
                },
                region: {
                    label: 'region',
                    type: 'text',
                    dependsOn: { field: 'fullAddress' }
                },
                country: {
                    label: 'country',
                    type: 'text',
                    dependsOn: { field: 'fullAddress' }
                },
            }
        },
        categories: {
            label: 'categories',
            required: true,
            type: 'select',
            multiple: true,
            min: 1,
            size: 12,
            enum: CategoryType
        },
        images: {
            label: 'images',
            required: true,
            type: 'file',
            multiple: true,
            min: 1,
            size: 12,
        },
    },
    step2: {
        shortDescription: {
            label: 'shortDescription',
            required: true,
            type: 'text',
            size: 12,
            multiline: true,
            max: 255,
            maxRows: 4
        },
        description: {
            label: 'fullDescription',
            required: true,
            type: 'richtext',
            size: 12,
        },
    },
    step3: {
        workflow: {
            label: 'workflow',
            required: true,
            type: 'array',
            size: 12,
            fields: {
                title: {
                    label: 'workflowTitle',
                    required: true,
                    type: 'text',
                    size: 12,
                },
                description: {
                    label: 'workflowDescription',
                    required: false,
                    type: 'text',
                    size: 12,
                },
            },
        },
    },
    step4: {
        faqs: {
            label: 'faqs',
            required: true,
            type: 'array',
            size: 12,
            fields: {
                question: {
                    label: 'question',
                    required: true,
                    type: 'text',
                    size: 12,
                },
                answer: {
                    label: 'answer',
                    required: true,
                    type: 'text',
                    size: 12,
                },
            },
        },
    },
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

const Step4 = () => {
    return (
        <Grid container spacing={1}>
            {Object.entries(formFields.step4).map(([fieldName, fieldConfig]) => (
                <FieldRenderer key={fieldName} step="step4" fieldName={fieldName} fieldConfig={fieldConfig}/>
            ))}
        </Grid>
    );
};

interface PostServiceFormValues {
    step1: {
        title: string,
        price: number,
        address: ServiceAddressDto,
        categories: CategoryType[],
        images: FileList | File[]
    },
    step2: {
        description: string,
        shortDescription: string
    };
    step3: {
        workflow: WorkflowStep[]
    },
    step4: {
        faqs: Faq[]
    },
}


const mapFormToRequest = (values: PostServiceFormValues): FormData => {
    let formData = new FormData();
    console.log(values);
    formData.append('title', values.step1.title);
    formData.append('description', values.step2.description);
    formData.append('shortDescription', values.step2.shortDescription);
    formData.append('price', values.step1.price.toString());
    Object.entries(values.step1.address).map(([fieldName, fieldValue]) => {
        if (fieldValue !== '') {
            formData.append(`address.${fieldName}`, fieldValue);
        }
    })
    formData.append('categories', values.step1.categories.toString());
    formData.append('workflowJson', JSON.stringify(values.step3.workflow));
    formData.append('faqsJson', JSON.stringify(values.step4.faqs));
    Array.from(values.step1.images).forEach((file) => {
        formData.append('images', file);
    });
    return formData;
};

const libraries: ('places')[] = ['places']

const PostsServicePage = () => {
    const dispatch = useAppDispatch();
    const [postService] = useCreateServiceMutation();
    const FORM_NAME = "postService";
    const cachedFormData = useSelector((state: RootState) => state.form[FORM_NAME]);
    const navigate = useNavigate();
    const {t} = useTranslation();
    const [visible, setVisible] = useState(true);
    const activeField = useAppSelector(selectActiveField);
    const [visibleText, setVisibleText] = useState(activeField);

    const initialValues: PostServiceFormValues = cachedFormData
        || generateInitialValuesFromConfig(formFields);

    useEffect(() => {
        dispatch(setTitle(t('postService.title')))
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
                    <Typography variant="h4">{t('postService.description.header')}</Typography>
                    <Typography variant="body1">{t('postService.description.body')}</Typography>
                    <Fade in={visible}>
                        <Paper variant='outlined' sx={{p: 1}}>
                            <Info color='primary'/>
                            <Typography>{t(`postService.form.steps.${visibleText}`)}</Typography>
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
                            label: 'postService.form.steps.serviceDetails',
                            content: <Step1/>,
                            validationSchema: yup.object().shape({
                                step1: generateValidationSchema(formFields.step1)
                            })
                        },
                        {
                            label: 'postService.form.steps.description',
                            content: <Step2/>,
                            validationSchema: yup.object().shape({
                                step2: generateValidationSchema(formFields.step2)
                            })
                        },
                        {
                            label: 'postService.form.steps.workflow',
                            content: <Step3/>,
                            validationSchema: yup.object().shape({
                                step3: generateValidationSchema(formFields.step3)
                            })
                        },
                        {
                            label: 'postService.form.steps.faqs',
                            content: <Step4/>,
                            validationSchema: yup.object().shape({
                                step4: generateValidationSchema(formFields.step4)
                            })
                        }
                    ]}
                    initialValues={initialValues}
                    onComplete={(values) =>
                        postService(mapFormToRequest(values)).unwrap()
                            .then(id => {
                                enqueueSnackbar(t('postService.form.success'), {variant: 'success'});
                                navigate(`/service/${id}`);
                            })}/>
            </Grid>
        </Grid>
    );
}

export default PostsServicePage;