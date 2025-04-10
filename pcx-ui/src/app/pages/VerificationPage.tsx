import {Button, Step, StepLabel, Stepper} from "@mui/material";
import {useAppDispatch, useAppSelector} from "../hooks.ts";
import {nextStep, prevStep, selectActiveStep,} from "../../features/verification/verificationSlice.ts";
import EmployerInformationForm from "../components/verification/employer/EmployerInformationForm.tsx";
import Grid from "@mui/material/Grid";
import {Form, Formik} from "formik";
import {mixed, object, string} from "yup";
import {
    EmployerRegistrationRequest,
    useRegisterEmployerMutation,
    useUploadFileMutation
} from "../../features/api/pcxApi.ts";
// import {
//     useUploadFileMutation
// } from "../../features/api/enhancedApi.ts";
import Paper from "@mui/material/Paper";
import FileUploadForm from "../components/verification/employer/FileUploadForm.tsx";

const steps = ['Personal Information', 'Documents', 'Profile picture'];

const errValidationSchema = object({
    employerInformation: object().shape({
        companyName: string().required('Required'),
        registrationCode: string().required('Required'),
        email: string().email('Invalid email format').required('Required'),
        address: string().required('Required'),
        phoneNumber: string().required('Required'),
        country: string().required('Required'),
        description: string()
    })
});

const fileValidationSchema = object({
    fileUpload: object().shape({
        file: mixed().required('Required'),
        documentType: string().required('Required'),
    })
})

const initialValues = {
    employerInformation: {
        companyName: '',
        registrationCode: '',
        email: '',
        address: '',
        phoneNumber: '',
        country: '',
        description: undefined
    } as EmployerRegistrationRequest,
    fileUpload: {
        documentType: '',
        file: null
    },
}

const getStepContent = (step: number) => {
    switch (step) {
        case 0:
            return <EmployerInformationForm/>;
        case 1:
            return <FileUploadForm/>;
        case 2:
            return <EmployerInformationForm/>;
    }
}

const getStepValidationSchema = (step: number) => {
    switch (step) {
        case 0:
            return errValidationSchema;
        case 1:
            return fileValidationSchema;
        case 2:
            return errValidationSchema;
    }
}

const VerificationPage = () => {
    const dispatch = useAppDispatch();
    const activeStep = useAppSelector(selectActiveStep);
    const [registerEmployer] = useRegisterEmployerMutation();
    const [uploadFile] = useUploadFileMutation();

    function submitStep(values) {
        console.log(values);
        switch (activeStep) {
            case 0:
                return registerEmployer({employerRegistrationRequest: values.employerInformation}).unwrap();
            case 1:
                let formData = new FormData();
                formData.append('file', values.fileUpload.file);
                formData.append('documentType', values.fileUpload.documentType);
                console.log(formData);
                return uploadFile(formData).unwrap();
            default:
                return registerEmployer({employerRegistrationRequest: values.employerInformation}).unwrap();

        }
    }


    return (
        <Grid container spacing={2} sx={{alignItems: 'center'}}>
            <Grid size={{xs: 12, md: 6}}>
                <Stepper activeStep={activeStep}>
                    {steps.map((step) => (
                        <Step key={step}>
                            <StepLabel>{step}</StepLabel>
                        </Step>
                    ))}
                </Stepper>
            </Grid>
            <Grid container size={{xs: 12, md: 6}} maxWidth='md'>
                <Formik
                    initialValues={initialValues}
                    onSubmit={
                        (values, formikHelpers) => {
                            submitStep(values)
                                .then(
                                    () => {
                                        if (activeStep === 0 || activeStep === 2) {
                                            dispatch(nextStep())
                                        }
                                    }
                                )
                                .finally(() => {
                                    formikHelpers.setSubmitting(false);
                                })
                        }}
                    validationSchema={getStepValidationSchema(activeStep)}>
                    {({submitForm, isSubmitting}) => (
                        <Paper sx={{p: 2}}>
                            <Grid container spacing={2}>
                                <Grid size={{xs: 12}}>
                                    <Form>
                                        {getStepContent(activeStep)}
                                    </Form>
                                </Grid>
                                <Grid container size={{xs: 12}} justifyContent='space-between'>
                                    <Grid>
                                        <Button variant='contained' onClick={() => dispatch(prevStep())}>Back</Button>
                                    </Grid>
                                    <Grid container spacing={1}>
                                        {/*                                    TODO: Maybe Save is also useful option
                                       <Button variant='outlined'
                                                type='submit'
                                                onClick={
                                            submitForm
                                        }
                                                disabled={isSubmitting}>Save</Button>*/}
                                        <Button variant='contained'
                                                type='submit'
                                                disabled={isSubmitting}
                                                onClick={submitForm}>Next</Button>
                                        <Button variant='outlined' onClick={() => dispatch(nextStep())}>Next
                                            test</Button>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Paper>
                    )}
                </Formik>
            </Grid>
        </Grid>
    );
}

export default VerificationPage;