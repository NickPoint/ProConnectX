import {useFormik} from "formik";
import {mixed, object, string} from "yup";
import {Category, useCreateProjectMutation} from "../../features/api/pcxApi";
import {useAppDispatch, useAppSelector} from "../hooks";
import Grid from "@mui/material/Unstable_Grid2";
import {Box, Typography} from "@mui/material";
import TextField from "@mui/material/TextField";
import * as React from "react";
import {decreaseStep, increaseStep, selectStep} from "../../features/serviceForm/serviceFormSlice";
import Button from "@mui/material/Button";

const postServiceSchema = object({
    title: string()
        .required('Title is required'),
    description: string()
        .required('Description is required'),
    budget: string()
        .required('Budget is required'),
    location: string()
        .required('Location is required'),
    category: string()
        .required('Category is required'),
    image: string()
});

const stepsFields = {
    1: ['title', 'description'],
    2: ['budget', 'location', 'category']
}

const PostServicePage = () => {
    const dispatch = useAppDispatch();
    const step = useAppSelector(selectStep);

    const [postService] = useCreateProjectMutation();
    const formik = useFormik({
        initialValues: {
            title: '',
            description: '',
            budget: 0,
            location: '',
            category: undefined,
            image: '',
        },
        validationSchema: postServiceSchema,
        onSubmit: (values, formikHelpers) => {
            formikHelpers.setStatus(undefined);
            postService({project: values}).unwrap()
                .catch((error) => {
                    if (error.data !== undefined) {
                        formikHelpers.setStatus(error.data.message)
                    }
                })
                .finally(() => {
                    formikHelpers.setSubmitting(false);
                })
        },
    });

    const handleNext = () => {
        formik.validateForm()
            .then((errors) => {
                if (Object.keys(errors).length === 0) {
                    dispatch(increaseStep())
                } else {
                    formik.setTouched({
                        title: true,
                        description: true,
                    })
                }
            })
    }

    const Step1 = () => {
        return (
            <Grid container spacing={2}>
                <Grid xs={12}>
                    <TextField
                        autoComplete="title"
                        name="title"
                        required
                        fullWidth
                        id="title"
                        label="Title"
                        value={formik.values.title}
                        onChange={formik.handleChange}
                        error={formik.touched.title && Boolean(formik.errors.title)}
                        helperText={formik.touched.title && formik.errors.title}
                    />
                </Grid>
                <Grid xs={12}>
                    <TextField
                        autoComplete="description"
                        name="description"
                        required
                        fullWidth
                        id="description"
                        label="Description"
                        value={formik.values.description}
                        onChange={formik.handleChange}
                        error={formik.touched.description && Boolean(formik.errors.description)}
                        helperText={formik.touched.description && formik.errors.description}
                    />
                </Grid>
            </Grid>
        )
    }

    const Step2 = () => {
        return (
            <Grid container spacing={2}>
                <Grid xs={12}>
                    <TextField
                        autoComplete="budget"
                        name="budget"
                        required
                        fullWidth
                        id="budget"
                        label="Budget"
                        value={formik.values.budget}
                        onChange={formik.handleChange}
                        error={formik.touched.budget && Boolean(formik.errors.budget)}
                        helperText={formik.touched.budget && formik.errors.budget}
                    />
                </Grid>
                <Grid xs={12}>
                    <TextField
                        autoComplete="location"
                        name="location"
                        required
                        fullWidth
                        id="location"
                        label="Location"
                        value={formik.values.location}
                        onChange={formik.handleChange}
                        error={formik.touched.location && Boolean(formik.errors.location)}
                        helperText={formik.touched.location && formik.errors.location}
                    />
                </Grid>
                <Grid xs={12}>
                    <TextField
                        autoComplete="category"
                        name="category"
                        required
                        fullWidth
                        id="category"
                        label="Category"
                        value={formik.values.category}
                        onChange={formik.handleChange}
                        error={formik.touched.category && Boolean(formik.errors.category)}
                        helperText={formik.touched.category && formik.errors.category}
                    />
                </Grid>
            </Grid>
        )
    }

    return (
        <Box component='form' noValidate onSubmit={formik.handleSubmit} sx={{mt: 3}}>
            <Grid container spacing={2}>
                <Grid xs={12} md={6} sx={{
                    alignContent: "center",
                }}>
                    <Box textAlign='left'>
                        <Typography variant='h4'>Post a Service</Typography>
                    </Box>
                </Grid>
                <Grid xs={12} md={6}>
                    {step === 1 && <Step1/>}
                    {step === 2 && <Step2/>}
                    <Grid container spacing={2} sx={{
                        mt: 3,
                        justifyContent: 'center',
                    }}>
                        <Grid xs={6}>
                            <Button
                                disabled={step === 1}
                                variant='contained'
                                color='primary'
                                onClick={() => dispatch(decreaseStep())
                                }>Back</Button>
                        </Grid>
                        <Grid xs={6} >
                            {step === 1 &&
                                <Button
                                    variant='contained'
                                    color='primary'
                                    onClick={handleNext}>
                                    Next</Button>}
                            {step === 2 && <Button type='submit' variant='contained' color='primary'>Submit</Button>}
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </Box>
    )
}

export default PostServicePage;