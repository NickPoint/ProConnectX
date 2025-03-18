import {useFormik} from "formik";
import {object, string} from "yup";
import {useCreateProjectMutation, useCreateServiceMutation} from "../../../features/api/pcxApi";
import Grid from "@mui/material/Grid2"
import {Alert, IconButton, MenuItem, Typography} from "@mui/material";
import TextField from "@mui/material/TextField";
import * as React from "react";
import Button from "@mui/material/Button";
import CloseIcon from "@mui/icons-material/Close";
import {Category} from "../../../features/enums";

const postServiceSchema = object({
    title: string()
        .required('Title is required'),
    description: string()
        .required('Description is required'),
    price: string()
        .required('Budget is required'),
    location: string()
        .required('Location is required'),
    category: string()
        .required('Category is required'),
});

const PostsServicePage = () => {

    const [postService] = useCreateServiceMutation();

    const formik = useFormik({
        initialValues: {
            title: '',
            description: '',
            price: 0,
            location: '',
            category: '' as Category,
        },
        validationSchema: postServiceSchema,
        onSubmit: (values, formikHelpers) => {
            formikHelpers.setStatus(undefined);
            postService({serviceCreateDto: values}).unwrap()
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
        (<Grid container spacing={2}>
            <Grid
                sx={{
                    alignContent: "center",
                }}
                size={{
                    xs: 12,
                    md: 6
                }}>
                <Typography variant='h4'>Post a Service</Typography>
            </Grid>
            <Grid
                size={{
                    xs: 12,
                    md: 6
                }}>
                <Grid
                    container
                    component='form'
                    noValidate
                    onSubmit={formik.handleSubmit}
                    sx={{mt: 3}}
                    spacing={2}>
                    <Grid size={12}>
                        <TextField
                            fullWidth
                            name='title'
                            label='Title'
                            value={formik.values.title}
                            onChange={formik.handleChange}
                            error={formik.touched.title && Boolean(formik.errors.title)}
                            helperText={formik.touched.title && formik.errors.title}
                        />
                    </Grid>
                    <Grid size={12}>
                        <TextField
                            fullWidth
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
                    <Grid size={12}>
                        <TextField
                            fullWidth
                            name='price'
                            label='Price'
                            value={formik.values.price}
                            onChange={formik.handleChange}
                            error={formik.touched.price && Boolean(formik.errors.price)}
                            helperText={formik.touched.price && formik.errors.price}
                        />
                    </Grid>
                    <Grid size={12}>
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
                    <Grid size={12}>
                        <TextField
                            fullWidth
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
                    <Grid size={12}>
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

                </Grid>
            </Grid>
        </Grid>)
    );
}

export default PostsServicePage;