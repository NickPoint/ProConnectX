import Button from '@mui/material/Button';
import {
    RoleType,
    SignupFormRequest,
    useAuthenticateUserMutation,
    useCheckEmailMutation,
    useRegisterUserMutation
} from "../../features/api/pcxApi";
import {object, string} from "yup";
import {TextField} from "formik-mui";
import {Field, Form, Formik} from 'formik';
import {CardActionArea, Dialog, DialogContent, Grid, Link, Stack, Typography} from "@mui/material";
import {enqueueSnackbar} from "notistack";
import {useNavigate} from 'react-router-dom';
import {useAppDispatch, useAppSelector} from "../hooks.ts";
import {setCredentials} from "../../features/auth/authSlice.ts";
import signupImage from "../../assets/signup.jpg"
import {AnimatePresence, motion} from "motion/react"
import {
    selectEmail,
    selectOpen,
    selectSignup,
    setEmail,
    setOpen,
    setSignup
} from "../../features/signupDialog/authFormSlice.ts";
import {useTranslation} from "react-i18next";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import {useState} from "react";

const Hero = () => {
    return (
        <Stack color='white' sx={{
            backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${signupImage})`,
            backgroundPosition: '0 10%',
            height: '100%',
            p: 2
        }}>
            <Typography fontSize='1.75rem!important'
                        fontFamily='"Special Gothic Expanded One", sans-serif' variant="h4">Work
                Smarter</Typography>
            <Typography fontSize='1.75rem!important'
                        fontFamily='"Special Gothic Expanded One", sans-serif' variant="h4">Connect
                Faster</Typography>
        </Stack>
    );
}

const signUpSchema = object({
    email: string()
        .required('Email is required')
        .email('Email Address is invalid'),
    password: string()
        .required('Password is required')
        .min(8, 'Password must be more than 8 characters')
        .max(32, 'Password must be less than 32 characters'),
});

const signUpInitialValues: SignupFormRequest = {
    email: '',
    password: '',
    role: '' as RoleType,
}

const SignupForm = () => {
    const dispatch = useAppDispatch();
    const [registerUser] = useRegisterUserMutation();
    const [checkEmail] = useCheckEmailMutation();
    const navigate = useNavigate();
    const [activeStep, setActiveStep] = useState(0);
    const {t} = useTranslation();

    return (
        <Formik
            initialValues={signUpInitialValues}
            validationSchema={signUpSchema}
            onSubmit={(values, helpers) => {
                if (activeStep === 0) {
                    checkEmail({email: values.email}).unwrap()
                        .then((result) => {
                            setActiveStep((prev) => prev + 1);
                        })
                        .catch(({status, data}) => {
                            if (status === 204) {
                                dispatch(setEmail(values.email));
                                dispatch(setSignup(false));
                            }
                        })
                        .finally(() => helpers.setSubmitting(false));
                    return;
                }
                registerUser({signupFormRequest: values}).unwrap().then((response) => {
                    dispatch(setCredentials(response))
                    enqueueSnackbar('Registration successful', {variant: 'success'});
                    navigate('/verification');
                })
                    .catch(({status, data}) => {
                        if (status === 409) {
                            dispatch(setEmail(values.email));
                            dispatch(setSignup(false));
                        } else if (data !== undefined) {
                            helpers.setErrors(data.errors);
                        }
                    })
                    .finally(() => {
                        helpers.setSubmitting(false);
                    })
            }}
        >
            {({isSubmitting, setFieldValue}) => (
                <Form>
                    <motion.div layout>
                        <AnimatePresence mode="wait">
                            {activeStep === 0 ?
                                <motion.div
                                    key={0}
                                    initial={{opacity: 0, x: 50}}
                                    animate={{opacity: 1, x: 0}}
                                    exit={{opacity: 0, x: -50}}
                                    transition={{duration: 0.3}}
                                >
                                    <Grid container>
                                        <Grid size={{xs: null, md: 6}}>
                                            <Hero/>
                                        </Grid>
                                        <Grid size={{xs: 12, md: 6}} container spacing={4} padding={4}>
                                            <Grid size={12}>
                                                <Typography variant="h4">Create new account</Typography>
                                            </Grid>
                                            <Grid size={12}>
                                                <Stack spacing={1}>
                                                    <Field fullWidth component={TextField} name="email"
                                                           label='Email'/>
                                                    <Field fullWidth component={TextField} name="password"
                                                           label='Password'/>
                                                </Stack>
                                                <Stack spacing={1} sx={{alignItems: 'center', mt: 20}}>
                                                    <Button
                                                        type="submit"
                                                        fullWidth
                                                        variant="contained"
                                                        color="primary"
                                                        disabled={isSubmitting}
                                                    >
                                                        Sign Up
                                                    </Button>
                                                    <Typography>Already has account?{' '}
                                                        <Link sx={{cursor: 'pointer'}}
                                                              onClick={() => dispatch(setSignup(false))}>Sign
                                                            in</Link>
                                                    </Typography>
                                                </Stack>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </motion.div>
                                : <motion.div
                                    key={1}
                                    initial={{opacity: 0, x: 50}}
                                    animate={{opacity: 1, x: 0}}
                                    exit={{opacity: 0, x: -50}}
                                    transition={{duration: 0.3}}
                                >
                                    <Grid container spacing={4} padding={4}>
                                        <Grid size={12}>
                                            <Typography variant='h3'>{t('join.page.title')}</Typography>
                                        </Grid>
                                        <Grid container spacing={2} size={12}>
                                            <Grid component={Card} variant='outlined' size={{xs: 12, md: 6}}>
                                                <CardActionArea sx={{height: '100%'}}
                                                                onClick={() => setFieldValue('role', RoleType.RoleClient)}
                                                                type='submit'>
                                                    <CardContent>
                                                        <Typography
                                                            variant="h4">{t('join.page.client.title')}</Typography>
                                                        <Typography
                                                            variant="body1">{t('join.page.client.description')}</Typography>
                                                    </CardContent>
                                                </CardActionArea>
                                            </Grid>
                                            <Grid component={Card} variant='outlined' size={{xs: 12, md: 6}}>
                                                <Card>
                                                    <CardActionArea sx={{height: '100%'}}
                                                                    onClick={() => setFieldValue('role', RoleType.RoleFreelancer)}
                                                                    type='submit'>
                                                        <CardContent>
                                                            <Typography
                                                                variant="h4">{t('join.page.freelancer.title')}</Typography>
                                                            <Typography
                                                                variant="body1">{t('join.page.freelancer.description')}</Typography>
                                                        </CardContent>
                                                    </CardActionArea>
                                                </Card>
                                            </Grid>
                                        </Grid>
                                        <Grid size={12}>
                                            <Typography variant='body1'>{t('join.page.switchRole')}</Typography>
                                        </Grid>
                                    </Grid>
                                </motion.div>
                            }
                        </AnimatePresence>
                    </motion.div>
                </Form>
            )}
        </Formik>
    )
        ;
}

const loginSchema = object({
    email: string()
        .required('Email is required')
        .email('Email Address is invalid'),
    password: string()
        .required('Password is required')
        .min(8, 'Password must be more than 8 characters')
        .max(32, 'Password must be less than 32 characters'),
});

const SigninForm = () => {
    const dispatch = useAppDispatch();
    const [authenticateUser] = useAuthenticateUserMutation();
    const email = useAppSelector(selectEmail);
    const {t} = useTranslation();

    const signInInitialValues = {
        email: email,
        password: '',
    }

    return (
        <Grid container>
            <Grid size={{xs: null, md: 6}}>
                <Hero/>
            </Grid>
            <Grid size={{xs: 12, md: 6}} container spacing={4} padding={4}>
                <Grid size={12}>
                    <Typography variant="h4">Welcome back</Typography>
                </Grid>
                <Grid size={12}>
                    <Formik
                        initialValues={signInInitialValues}
                        validationSchema={loginSchema}
                        onSubmit={(values, formikHelpers) => {
                            authenticateUser({loginRequest: values}).unwrap()
                                .then((response) => {
                                    dispatch(setCredentials(response));
                                    enqueueSnackbar(t('signIn.form.success'), {variant: 'success'});
                                    dispatch(setOpen(false));
                                })
                                .catch((error) => {
                                    //TODO: better way to handle error if no connection with BE or if errorMiddleware is already handling it
                                    if (error.data !== undefined) {
                                        formikHelpers.setStatus(error.data.message)
                                    }
                                })
                                .finally(() => {
                                    formikHelpers.setSubmitting(false);
                                })
                        }}
                    >
                        {({isSubmitting}) => (
                            <Form>
                                <Stack spacing={1}>
                                    <Field fullWidth component={TextField} name="email" label='Email'/>
                                    <Field fullWidth component={TextField} name="password"
                                           label='Password'/>
                                </Stack>
                                <Stack spacing={1} sx={{alignItems: 'center', mt: 20}}>
                                    <Button
                                        type="submit"
                                        fullWidth
                                        variant="contained"
                                        color="primary"
                                        disabled={isSubmitting}
                                    >
                                        Sign In
                                    </Button>
                                    <Typography>Doesn't have and account?{' '}
                                        <Link sx={{cursor: 'pointer'}}
                                              onClick={() => dispatch(setSignup(true))}>
                                            Sign Up
                                        </Link>
                                    </Typography>
                                </Stack>
                            </Form>
                        )}
                    </Formik>
                </Grid>
            </Grid>
        </Grid>
    );
}

const AuthDialog = () => {
    const dispatch = useAppDispatch();
    const open = useAppSelector(selectOpen);
    const isSignUp = useAppSelector(selectSignup);

    return (
        <Dialog fullWidth maxWidth='md' open={open}
                onClose={() => dispatch(setOpen(false))}>
            <DialogContent sx={{p: 0, overflow: 'hidden'}}>
                <motion.div layout>
                    <AnimatePresence mode="wait">
                        {!isSignUp ? (
                            <motion.div
                                key="sign-in"
                                initial={{opacity: 0, x: 50}}
                                animate={{opacity: 1, x: 0}}
                                exit={{opacity: 0, x: -50}}
                                transition={{duration: 0.3}}
                            >
                                <SigninForm/>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="sign-up"
                                initial={{opacity: 0, x: -50}}
                                animate={{opacity: 1, x: 0}}
                                exit={{opacity: 0, x: 50}}
                                transition={{duration: 0.3}}
                            >
                                <SignupForm/>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            </DialogContent>
        </Dialog>
    );
}

export default AuthDialog;