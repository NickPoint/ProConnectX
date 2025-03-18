import {useFormik} from "formik";
import {array, number, object, string} from "yup";
import {useCreateProjectMutation} from "../../../features/api/pcxApi";
import Grid from "@mui/material/Grid2"
import {Alert, FormControl, FormHelperText, IconButton, InputLabel, MenuItem, Select, Typography} from "@mui/material";
import TextField from "@mui/material/TextField";
import * as React from "react";
import Button from "@mui/material/Button";
import CloseIcon from "@mui/icons-material/Close";
import {Category, ProjectType} from "../../../features/enums";

const postProjectSchema = object({
    title: string()
        .required('Title is required'),
    shortDescription: string()
        .required('Short Description is required'),
    description: string()
        .required('Description is required'),
    location: string()
        .required('Location is required'),
    categories: array(string())
        .required('At least one category is required'),
    projectType: string()
        .required('Project Type is required'),
    budget: number().when('projectType', {
        is: 'FIXED',
        then: schema => schema.required('Budget is required'),
        otherwise: schema => schema.notRequired(),
    }),
    minSatisfyingBid: number().when('projectType', {
        is: 'BID',
        then: schema => schema.required('Minimum Satisfying Bid is required'),
        otherwise: schema => schema.notRequired(),
    }),
    bidStep: number().when('projectType', {
        is: 'BID',
        then: schema => schema.required('Bid Step is required'),
        otherwise: schema => schema.notRequired(),
    }),
});

const PostProjectPage = () => {

    const [postProject] = useCreateProjectMutation();

    const formik = useFormik({
        initialValues: {
            title: '',
            shortDescription: '',
            description: '',
            location: '',
            categories: [] as Category[],
            projectType: '' as ProjectType,
            budget: undefined,
            minSatisfyingBid: undefined,
            bidStep: undefined,
        },
        validationSchema: postProjectSchema,
        onSubmit: (values, formikHelpers) => {
            formikHelpers.setStatus(undefined);
            postProject({projectCreateDto: values}).unwrap()
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
                <Typography variant='h4'>Post a Project</Typography>
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
                            name='shortDescription'
                            label='Short Description'
                            value={formik.values.shortDescription}
                            onChange={formik.handleChange}
                            error={formik.touched.shortDescription && Boolean(formik.errors.shortDescription)}
                            helperText={formik.touched.shortDescription && formik.errors.shortDescription}
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
                        <FormControl fullWidth
                                     error={formik.touched.categories && Boolean(formik.errors.categories)}>
                            <InputLabel id='categories'>Categories</InputLabel>
                            <Select
                                label='Categories'
                                name='categories'
                                labelId='categories'
                                multiple
                                value={formik.values.categories}
                                onChange={formik.handleChange}
                            >
                                {Object.values(Category).map((category, index) => (
                                    <MenuItem key={index} value={category}>
                                        {category}
                                    </MenuItem>
                                ))}
                            </Select>
                            {formik.touched.categories && <FormHelperText>{formik.errors.categories}</FormHelperText>}
                        </FormControl>
                    </Grid>
                    <Grid size={12}>
                        <TextField
                            fullWidth
                            select
                            name='projectType'
                            label='Project Type'
                            value={formik.values.projectType}
                            onChange={formik.handleChange}
                            error={formik.touched.projectType && Boolean(formik.errors.projectType)}
                            helperText={formik.touched.projectType && formik.errors.projectType}
                        >
                            <MenuItem value=''>-</MenuItem>
                            {Object.values(ProjectType).map((projectType, index) => (
                                <MenuItem key={index} value={projectType}>
                                    {projectType}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Grid>
                    {formik.values.projectType === ProjectType.FIXED &&
                        <Grid size={12}>
                            <TextField
                                fullWidth
                                name='budget'
                                label='Budget'
                                value={formik.values.budget}
                                onChange={formik.handleChange}
                                error={formik.touched.budget && Boolean(formik.errors.budget)}
                                helperText={formik.touched.budget && formik.errors.budget}
                            />
                        </Grid>
                    }
                    {formik.values.projectType === ProjectType.BID &&
                        <Grid size={12}>
                            <Grid container spacing={2}>
                                <Grid size={6}>
                                    <TextField
                                        fullWidth
                                        name='minSatisfyingBid'
                                        label='Minimum Satisfying Bid'
                                        value={formik.values.minSatisfyingBid}
                                        onChange={formik.handleChange}
                                        error={formik.touched.minSatisfyingBid && Boolean(formik.errors.minSatisfyingBid)}
                                        helperText={formik.touched.minSatisfyingBid && formik.errors.minSatisfyingBid}
                                    />
                                </Grid>
                                <Grid size={6}>
                                    <TextField
                                        fullWidth
                                        name='bidStep'
                                        label='Bid Step'
                                        value={formik.values.bidStep}
                                        onChange={formik.handleChange}
                                        error={formik.touched.bidStep && Boolean(formik.errors.bidStep)}
                                        helperText={formik.touched.bidStep && formik.errors.bidStep}
                                    />
                                </Grid>
                            </Grid>
                        </Grid>
                    }
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

export default PostProjectPage;