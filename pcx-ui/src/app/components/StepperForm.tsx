import {Form, Formik, FormikHelpers} from "formik";
import {Box, Button, Grid, Paper, Step, StepLabel, Stepper} from "@mui/material";
import {useState} from "react";

interface StepForm {
    label: string;
    content: React.ReactNode;
    validationSchema: any;
    onSubmit?: (values: any) => Promise<any>; // now optional
}

interface StepperFormProps<T> {
    steps: StepForm[];
    initialValues: T;
    onComplete: (values: T) => Promise<any>; // always required at the end
    submitPerStep?: boolean; // <-- new option!!
}

export const StepperForm = <T, >({steps, initialValues, onComplete, submitPerStep = false}: StepperFormProps<T>) => {
    const [activeStep, setActiveStep] = useState(0);

    const isLastStep = activeStep === steps.length - 1;

    const currentStep = steps[activeStep];

    const handleSubmit = async (values: any, helpers: FormikHelpers<any>) => {
        try {
            if (submitPerStep && currentStep.onSubmit) {
                // Per-step submit
                await currentStep.onSubmit(values);
            }

            if (isLastStep) {
                await onComplete(values); // Final submission
            } else {
                setActiveStep((prev) => prev + 1);
            }
        } catch (error) {
            console.error("Error during submission:", error);
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
            {({isSubmitting, values}) => (
                <Form noValidate>
                    <Paper sx={{p: {xs: 2, md: 4}}}>
                        <Grid container spacing={3}>
                            <Grid size={12}>
                                <Stepper activeStep={activeStep}>
                                    {steps.map((step) => (
                                        <Step key={step.label}>
                                            <StepLabel>{step.label}</StepLabel>
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
                                        Back
                                    </Button>
                                    <Button
                                        variant="outlined"
                                        onClick={() => handleNext(values)}
                                    >
                                        Next test
                                    </Button>
                                    <Button
                                        variant="contained"
                                        type="submit"
                                        loading={isSubmitting}
                                    >
                                        {isLastStep ? "Finish" : "Next"}
                                    </Button>
                                </Box>
                            </Grid>
                        </Grid>
                    </Paper>
                </Form>
            )}
        </Formik>
    );
};
