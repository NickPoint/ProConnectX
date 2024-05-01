import {useFormik} from "formik";
import {mixed, object, string} from "yup";
import {useCreateProjectMutation} from "../../features/api/pcxApi";
import {useAppDispatch, useAppSelector} from "../hooks";
import Grid from "@mui/material/Unstable_Grid2";
import {Alert, Box, IconButton, MenuItem, Typography} from "@mui/material";
import TextField from "@mui/material/TextField";
import * as React from "react";
import {decreaseStep, increaseStep, selectStep} from "../../features/serviceForm/serviceFormSlice";
import Button from "@mui/material/Button";
import CloseIcon from "@mui/icons-material/Close";
import {Category} from "../../features/enums";

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
            shortDescription: '',
            description: '',
            budget: 0,
            location: '',
            category: Category.WEB_DESIGN,
            image: '',
        },
        validationSchema: postServiceSchema,
        onSubmit: (values, formikHelpers) => {
            formikHelpers.setStatus(undefined);
            postService({projectCreateDto: values}).unwrap()
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


    return (
        <Grid container spacing={2}>
            <Grid xs={12} md={6} sx={{
                alignContent: "center",
            }}>
                <Typography variant='h4'>Post a Service</Typography>
            </Grid>
            <Grid xs={12} md={6}>
                <Box component='form' noValidate onSubmit={formik.handleSubmit} sx={{mt: 3}}>
                    <Grid xs={12}>
                        <TextField
                            fullWidth
                            id='title'
                            name='title'
                            label='Title'
                            value={formik.values.title}
                            onChange={formik.handleChange}
                            error={formik.touched.title && Boolean(formik.errors.title)}
                            helperText={formik.touched.title && formik.errors.title}
                        />
                    </Grid>
                    <Grid xs={12}>
                        <TextField
                            fullWidth
                            id='short-description'
                            name='shortDescription'
                            label='Short Description'
                            value={formik.values.shortDescription}
                            onChange={formik.handleChange}
                            error={formik.touched.shortDescription && Boolean(formik.errors.shortDescription)}
                            helperText={formik.touched.shortDescription && formik.errors.shortDescription}
                        />
                    </Grid>
                    <Grid xs={12}>
                        <TextField
                            fullWidth
                            id='description'
                            name='description'
                            label='Description'
                            multiline
                            rows={4}
                            value={formik.values.description}
                            onChange={formik.handleChange}
                            error={formik.touched.description && Boolean(formik.errors.description)}
                            helperText={formik.touched.description && formik.errors.description}
                        />
                    </Grid>
                    <Grid xs={12}>
                        <TextField
                            fullWidth
                            id='budget'
                            name='budget'
                            label='Budget'
                            value={formik.values.budget}
                            onChange={formik.handleChange}
                            error={formik.touched.budget && Boolean(formik.errors.budget)}
                            helperText={formik.touched.budget && formik.errors.budget}
                        />
                    </Grid>
                    <Grid xs={12}>
                        <TextField
                            fullWidth
                            id='location'
                            name='location'
                            label='Location'
                            value={formik.values.location}
                            onChange={formik.handleChange}
                            error={formik.touched.location && Boolean(formik.errors.location)}
                            helperText={formik.touched.location && formik.errors.location}
                        />
                    </Grid>
                    <Grid xs={12}>
                        <TextField
                            fullWidth
                            id='category'
                            select
                            name='category'
                            label='Category'
                            value={formik.values.category}
                            onChange={formik.handleChange}
                            error={formik.touched.category && Boolean(formik.errors.category)}
                            helperText={formik.touched.category && formik.errors.category}>
                            {Object.values(Category).map((category) => (
                                <MenuItem key={category} value={category}>
                                    {category}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Grid>
                    <Grid xs={12}>
                        <Button type='submit' variant='contained' color='primary'>Submit</Button>
                    </Grid>
                    {formik.status !== undefined &&
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
                    }

                </Box>
            </Grid>
        </Grid>
    )
}

export default PostServicePage;