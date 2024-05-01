import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Unstable_Grid2';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import {useRegisterUserMutation} from "../../features/api/pcxApi";
import {object, ref, string} from "yup";
import {useFormik} from "formik";
import {Link as RouterLink} from "react-router-dom";
import {Alert, Collapse, IconButton} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

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
});

const RegisterPage = () => {
    const [registerUser] = useRegisterUserMutation();

    const formik= useFormik({
        initialValues: {
            firstName: '',
            lastName: '',
            email: '',
            password: '',
            passwordConfirm: '',
        },
        validationSchema: signUpSchema,
        onSubmit: (values, formikHelpers) => {
            formikHelpers.setStatus(undefined);
            const mergedValues = {
                ...values,
                name: values.firstName + ' ' + values.lastName,
            }
            registerUser({signupRequest: mergedValues}).unwrap()
                .catch((error) => {
                    if (error.data !== undefined) {
                        formikHelpers.setStatus(error.data.message)
                    }
                })
                .finally(() => {
                    formikHelpers.setSubmitting(false);
                })
        }
    });

    return (
        <Container component="main" maxWidth="xs">
            <Box
                sx={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Avatar sx={{m: 1, bgcolor: 'secondary.main'}}>
                    <LockOutlinedIcon/>
                </Avatar>
                <Typography component="h1" variant="h5">
                    Sign up
                </Typography>
                <Box component="form" noValidate onSubmit={formik.handleSubmit} sx={{mt: 3}}>
                    <Grid container spacing={2}>
                        <Grid xs={12} sm={6}>
                            <TextField
                                autoComplete="given-name"
                                name="firstName"
                                required
                                fullWidth
                                id="firstName"
                                label="First Name"
                                autoFocus
                                value={formik.values.firstName}
                                onChange={formik.handleChange}
                                error={formik.touched.firstName && Boolean(formik.errors.firstName)}
                                helperText={formik.touched.firstName && formik.errors.firstName}
                            />
                        </Grid>
                        <Grid xs={12} sm={6}>
                            <TextField
                                required
                                fullWidth
                                id="lastName"
                                label="Last Name"
                                name="lastName"
                                autoComplete="family-name"
                                value={formik.values.lastName}
                                onChange={formik.handleChange}
                                error={formik.touched.lastName && Boolean(formik.errors.lastName)}
                                helperText={formik.touched.lastName && formik.errors.lastName}
                            />
                        </Grid>
                        <Grid xs={12}>
                            <TextField
                                required
                                fullWidth
                                id="email"
                                label="Email Address"
                                name="email"
                                autoComplete="email"
                                value={formik.values.email}
                                onChange={formik.handleChange}
                                error={formik.touched.email && Boolean(formik.errors.email)}
                                helperText={formik.touched.email && formik.errors.email}
                            />
                        </Grid>
                        <Grid xs={12}>
                            <TextField
                                required
                                fullWidth
                                name="password"
                                label="Password"
                                type="password"
                                id="password"
                                autoComplete="new-password"
                                value={formik.values.password}
                                onChange={formik.handleChange}
                                error={formik.touched.password && Boolean(formik.errors.password)}
                                helperText={formik.touched.password && formik.errors.password}
                            />
                        </Grid>
                    </Grid>
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{mt: 3, mb: 2}}
                    >
                        Sign Up
                    </Button>
                    <Grid container justifyContent="flex-end">
                        <Grid>
                            <Link variant='body2' component={RouterLink} to='/login'>
                                Already have an account? Sign in
                            </Link>
                        </Grid>
                    </Grid>
                    <Collapse in={formik.status !== undefined}>
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
                                    <CloseIcon fontSize="inherit" />
                                </IconButton>
                            }
                            sx={{ mb: 2 }}
                        >
                            {formik.status}
                        </Alert>
                    </Collapse>
                </Box>
            </Box>
        </Container>
    );
}

export default RegisterPage;