import Button from '@mui/material/Button';
import {
    ProfileType,
    LoginRequest,
    SignupFormRequest,
    useAddProfileMutation,
    useAuthenticateUserMutation,
    useCheckEmailMutation,
    useGetCurrentUserQuery,
    useRegisterUserMutation
} from "../../features/api/pcxApi";
import {object, string} from "yup";
import {TextField} from "formik-mui";
import {Field, Form, Formik} from 'formik';
import {CardActionArea, Dialog, DialogContent, Grid, IconButton, InputAdornment, Link, Stack, Typography} from "@mui/material";
import {enqueueSnackbar} from "notistack";
import {useNavigate} from 'react-router-dom';
import {useAppDispatch, useAppSelector} from "../hooks.ts";
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
import {Visibility, VisibilityOff } from '@mui/icons-material';

interface AddAccountProps {
    open: boolean;
    onClose: () => void;
}

export const AddAccountDialog: React.FC<AddAccountProps> = ({open, onClose}) => {
    const {t} = useTranslation();
    const navigate = useNavigate();
    const {data: user} = useGetCurrentUserQuery();
    const [addAccount] = useAddProfileMutation();

    const hasClientAccount = user?.allProfiles.some((profile) => profile.profileType === ProfileType.Client);
    const hasFreelancerAccount = user?.allProfiles.some((profile) => profile.profileType === ProfileType.Freelancer);

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogContent>
                <Grid container spacing={4}>
                    <Grid size={12}>
                        <Typography variant='h3'>{t('join.page.title')}</Typography>
                    </Grid>
                    <Grid container spacing={2} size={12}>
                        {!hasClientAccount &&
                            <Grid component={Card} variant='outlined' size={{xs: 12, md: 6}}>
                                <CardActionArea
                                    sx={{height: '100%'}}
                                    onClick={() => addAccount({profileType: ProfileType.Client}).unwrap()
                                                .then(() => {
                                                    enqueueSnackbar(t('registration.addAccount.success', {profileType: t(`enum.profileType.${ProfileType.Client}`)}), {variant: 'success'});
                                                    onClose();
                                                    navigate('/client-verification');
                                                })}
                                >
                                    <CardContent>
                                        <Typography
                                            variant="h4">{t('join.page.client.title')}</Typography>
                                        <Typography
                                            variant="body1">{t('join.page.client.description')}</Typography>
                                    </CardContent>
                                </CardActionArea>
                            </Grid>
                        }
                        {!hasFreelancerAccount &&
                            <Grid component={Card} variant='outlined' size={{xs: 12, md: 6}}>
                                <Card>
                                    <CardActionArea
                                        sx={{height: '100%'}}
                                        onClick={() => addAccount({profileType: ProfileType.Freelancer}).unwrap()
                                            .then(() => {
                                                enqueueSnackbar(t('registration.addAccount.success', {profileType: t(`enum.profileType.${ProfileType.Freelancer}`)}), {variant: 'success'});
                                                onClose();
                                                navigate('/freelancer-verification');
                                            })}
                                    >
                                        <CardContent>
                                            <Typography
                                                variant="h4">{t('join.page.freelancer.title')}</Typography>
                                            <Typography
                                                variant="body1">{t('join.page.freelancer.description')}</Typography>
                                        </CardContent>
                                    </CardActionArea>
                                </Card>
                            </Grid>
                        }
                    </Grid>
                </Grid>
            </DialogContent>
        </Dialog>
    );
}

const Hero = () => {
    return (
        <Stack color='white' sx={{
            backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${signupImage})`,
            backgroundPosition: '0 10%',
            backgroundSize: 'cover',
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
    profileType: '' as ProfileType,
}

interface SignupFormProps {
    onSubmit: (values: SignupFormRequest) => Promise<any>
}


export const SignupForm: React.FC<SignupFormProps> = ({onSubmit}) => {
    const dispatch = useAppDispatch();
    const [checkEmail] = useCheckEmailMutation();
    const navigate = useNavigate();
    const [activeStep, setActiveStep] = useState(0);
    const {t} = useTranslation();
    const [showPassword, setShowPassword] = useState(false);

    return (
        <Formik
            initialValues={signUpInitialValues}
            validationSchema={signUpSchema}
            onSubmit={(values, helpers) => {
                if (activeStep === 0) {
                    checkEmail({email: values.email}).unwrap()
                        .then(() => {
                            setActiveStep((prev) => prev + 1);
                        })
                        .catch(({status}) => {
                            if (status === 400) {
                                dispatch(setEmail(values.email));
                                dispatch(setSignup(false));
                            }
                        })
                        .finally(() => helpers.setSubmitting(false));
                    return;
                }
                onSubmit(values)
                    .then(() => {
                        enqueueSnackbar(t('registration.addAccount.success', {profileType: t(`enum.profileType.${values.profileType}`)}), {variant: 'success'});
                        if (values.profileType === ProfileType.Freelancer) {
                            navigate('/freelancer-verification');
                        } else {
                            navigate('/client-verification');
                        }
                    })
                    .catch(({status, data}) => {
                        if (status === 400) {
                            dispatch(setEmail(values.email));
                            dispatch(setSignup(false));
                        } else if (data !== undefined) {
                            helpers.setErrors(data.errors);
                            setActiveStep((prev) => prev - 1);
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
                                        <Grid size={6} display={{xs: 'none', md: 'block'}}>
                                            <Hero/>
                                        </Grid>
                                        <Grid size={{xs: 12, md: 6}} container spacing={4} padding={4}>
                                            <Grid size={12}>
                                                <Typography variant="h4">Create new profile</Typography>
                                            </Grid>
                                            <Grid size={12}>
                                                <Stack spacing={1}>
                                                    <Field fullWidth component={TextField} name="email"
                                                           label={t('form.fields.email')}/>
                                                    <Field fullWidth component={TextField}
                                                           InputProps={{
                                                               endAdornment: (
                                                                   <InputAdornment position="end">
                                                                       <IconButton
                                                                           aria-label={
                                                                               showPassword ? 'hide the password' : 'display the password'
                                                                           }
                                                                           onClick={() => setShowPassword((show) => !show)}
                                                                           onMouseDown={(event) => event.preventDefault()}
                                                                           onMouseUp={(event) => event.preventDefault()}
                                                                           edge="end"
                                                                       >
                                                                           {showPassword ? <VisibilityOff/> :
                                                                               <Visibility/>}
                                                                       </IconButton>
                                                                   </InputAdornment>
                                                               )
                                                           }}
                                                           name="password" type={showPassword ? "text" : "password"} label={t('form.fields.password')}/>
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
                                                    <Typography>Already has profile?{' '}
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
                                                                onClick={() => setFieldValue('profileType', ProfileType.Client)}
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
                                                                    onClick={() => setFieldValue('profileType', ProfileType.Freelancer)}
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

interface SigninFormProps {
    onSubmit: (values: LoginRequest) => Promise<any>
}

export const SigninForm: React.FC<SigninFormProps> = ({onSubmit}) => {
    const dispatch = useAppDispatch();
    const email = useAppSelector(selectEmail);
    const {t} = useTranslation();
    const [showPassword, setShowPassword] = useState(false);

    const signInInitialValues = {
        email: email,
        password: '',
    }

    return (
        <Grid container>
            <Grid size={6} display={{xs: 'none', md: 'block'}}>
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
                            onSubmit(values)
                                .then(() => {
                                    enqueueSnackbar(t('signIn.form.success'), {variant: 'success'});
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
                                    <Field fullWidth component={TextField} name="email"
                                           label={t('form.fields.email')}/>
                                    <Field fullWidth component={TextField}
                                           InputProps={{
                                               endAdornment: (
                                                   <InputAdornment position="end">
                                                       <IconButton
                                                           aria-label={
                                                               showPassword ? 'hide the password' : 'display the password'
                                                           }
                                                           onClick={() => setShowPassword((show) => !show)}
                                                           onMouseDown={(event) => event.preventDefault()}
                                                           onMouseUp={(event) => event.preventDefault()}
                                                           edge="end"
                                                       >
                                                           {showPassword ? <VisibilityOff/> :
                                                               <Visibility/>}
                                                       </IconButton>
                                                   </InputAdornment>
                                               )
                                           }}
                                           name="password" type={showPassword ? "text" : "password"} label={t('form.fields.password')}/>
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
                                    <Typography>Doesn't have and profile?{' '}
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

// TODO: Easier make props and controlled component
const AuthDialog = () => {
    const dispatch = useAppDispatch();
    const open = useAppSelector(selectOpen);
    const isSignUp = useAppSelector(selectSignup);
    const [authenticateUser] = useAuthenticateUserMutation();
    const [registerUser] = useRegisterUserMutation();


    return (
        <Dialog fullWidth maxWidth='md' open={open}
                onClose={() => dispatch(setOpen(false))}>
            <DialogContent sx={{p: 0, overflowX: 'hidden'}}>
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
                                <SigninForm
                                    onSubmit={(values: LoginRequest) =>
                                        authenticateUser({loginRequest: values}).unwrap()
                                            .then(() => dispatch(setOpen(false)))}/>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="sign-up"
                                initial={{opacity: 0, x: -50}}
                                animate={{opacity: 1, x: 0}}
                                exit={{opacity: 0, x: 50}}
                                transition={{duration: 0.3}}
                            >
                                <SignupForm onSubmit={(values) =>
                                    registerUser({signupFormRequest: values}).unwrap()
                                        .then(() => dispatch(setOpen(false)))}/>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            </DialogContent>
        </Dialog>
    );
}

export default AuthDialog;