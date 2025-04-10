import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import {object, string} from "yup";
import {useFormik} from "formik";
import {useAuthenticateUserMutation} from "../../features/api/pcxApi";
import {Link as RouterLink, useLocation, useNavigate} from "react-router-dom";
import {Alert, Collapse, IconButton, LinearProgress} from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import {useAppDispatch} from "../hooks";
import {setCredentials} from "../../features/auth/authSlice";


const loginSchema = object({
    email: string()
        .required('Email is required')
        .email('Email Address is invalid'),
    password: string()
        .required('Password is required')
        .min(8, 'Password must be more than 8 characters')
        .max(32, 'Password must be less than 32 characters'),
});

const LoginPage = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const [loginUser] = useAuthenticateUserMutation();
    const {from} = location.state || {from: {pathname: "/"}};

    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
            role: ''
        },
        validationSchema: loginSchema,
        onSubmit: (values, formikHelpers) => {
            formikHelpers.setStatus(undefined);
            loginUser({loginRequest: values}).unwrap()
                .then((response) => {
                    dispatch(setCredentials(response));
                    navigate(from);
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
        }
    });

    return (
        (<Grid container component="main" sx={{height: '100vh'}}>
            <Grid
                sx={{
                    backgroundImage: 'url(https://source.unsplash.com/random?wallpapers)',
                    backgroundRepeat: 'no-repeat',
                    backgroundColor: (t) =>
                        t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }}
                size={{
                    xs: false,
                    sm: 4,
                    md: 7
                }} />
            <Grid
                component={Paper}
                elevation={6}
                square
                size={{
                    xs: 12,
                    sm: 8,
                    md: 5
                }}>
                <Box
                    sx={{
                        my: 8,
                        mx: 4,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Avatar sx={{m: 1, bgcolor: 'secondary.main'}}>
                        <LockOutlinedIcon/>
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Sign in
                    </Typography>
                    <Box component="form" noValidate onSubmit={formik.handleSubmit} sx={{mt: 1}}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="Email Address"
                            name="email"
                            autoComplete="email"
                            autoFocus
                            value={formik.values.email}
                            onChange={formik.handleChange}
                            error={formik.touched.email && Boolean(formik.errors.email)}
                            helperText={formik.touched.email && formik.errors.email}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                            value={formik.values.password}
                            onChange={formik.handleChange}
                            error={formik.touched.password && Boolean(formik.errors.password)}
                            helperText={formik.touched.password && formik.errors.password}
                        />
                        {formik.isSubmitting && <LinearProgress/>}
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{mt: 3, mb: 2}}
                        >
                            Sign In
                        </Button>
                        <Grid container>
                            <Grid size="grow">
                                <Link href="#" variant="body2">
                                    Forgot password?
                                </Link>
                            </Grid>
                            <Grid size="grow">
                                <Link variant='body2' component={RouterLink} to='/signup'>
                                    {"Don't have an account? Sign Up"}
                                </Link>
                            </Grid>
                        </Grid>
                        <Collapse in={formik.status !== undefined}>
                            <Alert
                                severity="error"
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
                        </Collapse>
                    </Box>
                </Box>
            </Grid>
        </Grid>)
    );
}

export default LoginPage;