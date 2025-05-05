import {Form, Formik, FormikHelpers} from "formik";
import {Box, Button, Grid, Paper, Step, StepLabel, Stepper} from "@mui/material";
import {useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import {useAppDispatch} from "../hooks.ts";
import {clearFormData, setFormData} from "../../features/form/formSlice.ts";
import {enqueueSnackbar} from "notistack";
import {deepRemoveFiles} from "./formUtils.ts";

interface StepForm {
    label: string;
    content: React.ReactNode;
    validationSchema: any;
    onSubmit?: (values: any) => Promise<any>;
}

interface StepperFormProps<T> {
    formName: string;
    steps: StepForm[];
    initialValues: T;
    onComplete: (values: T) => Promise<any>;
    submitPerStep?: boolean;
}

export const StepperForm = <T, >({formName, steps, initialValues, onComplete, submitPerStep = false}: StepperFormProps<T>) => {
    const dispatch = useAppDispatch();
    const [activeStep, setActiveStep] = useState(0);
    const {t} = useTranslation();

    const isLastStep = activeStep === steps.length - 1;

    const currentStep = steps[activeStep];

    const handleFormChange = (values: any) => {
        dispatch(setFormData({formName: formName, data: deepRemoveFiles(values)}));
    };

    const handleSubmit = async (values: any, helpers: FormikHelpers<any>) => {
        try {
            if (submitPerStep && currentStep.onSubmit) {
                // Per-step submit
                await currentStep.onSubmit(values);
            }

            if (isLastStep) {
                await onComplete(values); // Final submission
                dispatch(clearFormData(formName));
            } else {
                setActiveStep((prev) => prev + 1);
            }
        } catch (error) {
            console.error("Error during submission:", error);
            enqueueSnackbar(error.data.message, { variant: 'error' });
        } finally {
            helpers.setSubmitting(false);
        }
    };

    const handleBack = () => {
        setActiveStep((prev) => prev - 1);
    };

    const handleNext = (values) => {
        console.log(values);
        setActiveStep((prev) => prev + 1);
    }

    return (
        <Formik<T>
            initialValues={initialValues}
            validationSchema={currentStep.validationSchema}
            onSubmit={handleSubmit}
        >
            {({isSubmitting, values}) => {
                useEffect(() => {
                    handleFormChange(values);
                }, [values]);
                return (
                    <Form noValidate>
                        <Paper sx={{p: {xs: 2, md: 4}}}>
                            <Grid container spacing={3}>
                                <Grid size={12}>
                                    <Stepper activeStep={activeStep}>
                                        {steps.map((step) => (
                                            <Step key={step.label}>
                                                <StepLabel>{t(step.label)}</StepLabel>
                                            </Step>
                                        ))}
                                    </Stepper>
                                </Grid>

                                <Grid size={12}>
                                    {currentStep.content}
                                </Grid>

                                <Grid size={12}>
                                    <Box sx={{display: "flex", justifyContent: "space-between"}}>
                                        <Button
                                            variant="outlined"
                                            disabled={activeStep === 0}
                                            onClick={handleBack}
                                        >
                                            {t('buttons.back')}
                                        </Button>
{/*                                        <Button
                                            variant="outlined"
                                            onClick={() => handleNext(values)}
                                        >
                                            Next test
                                        </Button>*/}
                                        <Button
                                            variant="contained"
                                            type="submit"
                                            loading={isSubmitting}
                                        >
                                            {isLastStep ? t('buttons.finish') : t('buttons.next')}
                                        </Button>
                                    </Box>
                                </Grid>
                            </Grid>
                        </Paper>
                    </Form>
                );
            }}
        </Formik>
    );
};
