import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import {SignupFormRequest, useRegisterUserMutation} from "../../features/api/pcxApi";
import {object, string} from "yup";
import {Switch, TextField} from "formik-mui";
import {Field, Form, Formik} from 'formik';
import Paper from "@mui/material/Paper";
import {styled} from "@mui/material/styles";
import {ERole} from "../../features/enums.ts";
import {FormControlLabel} from "@mui/material";
import {enqueueSnackbar} from "notistack";
import {useNavigate} from 'react-router-dom';
import {useAppDispatch} from "../hooks.ts";
import {setCredentials} from "../../features/auth/authSlice.ts";

const signUpSchema = object({
    firstName: string()
        .required('First Name is required'),
    lastName: string()
        .required('Last Name is required'),
    email: string()
        .required('Email is required')
        .email('Email Address is invalid'),
    password: string()
        .required('Password is required')
        .min(8, 'Password must be more than 8 characters')
        .max(32, 'Password must be less than 32 characters'),
    role: string()
        .required('Role is required')
        .oneOf([ERole.ROLE_EMPLOYER, ERole.ROLE_FREELANCER], 'Role is invalid')
});

const StyledPaper = styled(Paper)(({theme}) => ({
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(2),
    padding: theme.spacing(2),
    variant: 'elevation',
}));

const initialValues: SignupFormRequest = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    role: ERole.ROLE_FREELANCER
}

const SignupPage = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const [registerUser] = useRegisterUserMutation();

    /*    const formik = useFormik({
            initialValues: {
                firstName: '',
                lastName: '',
                email: '',
                password: '',
            },
            validationSchema: signUpSchema,
            onSubmit: (values, formikHelpers) => {
                formikHelpers.setStatus(undefined);
                registerUser({signupRequest: values}).unwrap()
                    .catch((error) => {
                        if (error.data !== undefined) {
                            formikHelpers.setStatus(error.data.message)
                        }
                    })
                    .finally(() => {
                        formikHelpers.setSubmitting(false);
                    })
            }
        });*/

    return (
        <Container maxWidth="xs">
            <StyledPaper>
                <Typography component="h1" variant="h4">
                    Sign up
                </Typography>
                <Formik
                    initialValues={initialValues}
                    validationSchema={signUpSchema}
                    onSubmit={(values, formikHelpers) => {
                        registerUser({signupFormRequest: values}).unwrap().
                            then((response) => {
                                dispatch(setCredentials(response))
                                enqueueSnackbar('Registration successful', {variant: 'success'});
                                navigate('/verification');
                            })
                            .catch(({data}) => {
                                if (data !== undefined) {
                                    formikHelpers.setErrors(error.data.errors);
                                }
                            })
                            .finally(() => {
                                formikHelpers.setSubmitting(false);
                            })
                    }}
                >
                    {({submitForm, isSubmitting, values, setFieldValue}) => (
                        <Form>
                            <Box
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: 1
                                }}
                            >
                                <Field component={TextField} name="firstName" label='First name'/>
                                <Field component={TextField} name="lastName" label='Last name'/>
                                <Field component={TextField} name="email" label='Email'/>
                                <Field component={TextField} name="password" label='Password'/>
                                <FormControlLabel control={<Field component={Switch} type='checkbox' name='role'
                                                                  checked={values.role === ERole.ROLE_EMPLOYER}
                                                                  onChange={() =>
                                                                      setFieldValue('role', values.role === ERole.ROLE_EMPLOYER ? ERole.ROLE_FREELANCER : ERole.ROLE_EMPLOYER)
                                                                  }/>}
                                                  label={`I want to sign up as ${values.role === ERole.ROLE_EMPLOYER ? 'Employer' : 'Freelancer'}`} />
                                <Button
                                    type="submit"
                                    fullWidth
                                    variant="contained"
                                    color="primary"
                                    disabled={isSubmitting}
                                    onClick={submitForm}
                                >
                                    Sign Up
                                </Button>
                            </Box>
                        </Form>
                    )}
                </Formik>
                {/*                <Collapse in={formik.status !== undefined}>
                    <Alert
                        action={
                            <IconButton
                                aria-label="close"
                                color="inherit"
                                size="small"
                                onClick={() => {
                                    formik.setStatus(undefined);
                                }}
                            >
                                <CloseIcon fontSize="inherit"/>
                            </IconButton>
                        }
                        sx={{mb: 2}}
                    >
                        {formik.status}
                    </Alert>
                </Collapse>*/}
            </StyledPaper>
        </Container>
    );
}

export default SignupPage;