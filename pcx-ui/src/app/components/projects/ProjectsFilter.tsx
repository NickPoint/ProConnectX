import {useAppDispatch} from "../../hooks";
import {setData, setLoading} from "../../../features/filter/filterSlice";
import {useGetFilteredProjectsMutation} from "../../../features/api/pcxApi";
import {
    Button,
    FormControl,
    FormHelperText,
    IconButton,
    InputLabel,
    MenuItem,
    Select,
    Slider,
    SwipeableDrawer,
    Typography,
    TextField,
    Grid,
} from "@mui/material";
import {Category, ProjectType} from "../../../features/enums";
import {useEffect, useState} from "react";
import {useFormik} from "formik";
import {styled} from "@mui/material/styles";
import theme from "../../theme/theme";
import {ChevronLeft, ChevronRight} from '@mui/icons-material';

import {replaceEmptyStringsWithNull} from "../../../features/filter/formikHelper";
import GenericSearch from "../GenericSearch.tsx";

interface FilterValues {
    title: string;
    categories: Category[];
    location: string;
    minBudget: number;
    maxBudget: number;
    projectType: ProjectType
}

// TODO: hardcoded values
const initialValues: FilterValues = {
    title: '',
    categories: [],
    location: '',
    minBudget: 0,
    maxBudget: 1000,
    projectType: '' as ProjectType
}

const DrawerHeader = styled('div')(({theme}) => ({
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: 'flex-start',
}));


const ProjectsFilter = () => {
    const dispatch = useAppDispatch();
    const [sliderValues, setSliderValues] = useState({min: 0, max: 1000});
    const [opened, setOpened] = useState(false);

    const [getFilteredProjects] = useGetFilteredProjectsMutation();

    const formik = useFormik({
        initialValues,
        onSubmit: values => {
            const convertedValues = replaceEmptyStringsWithNull(values);
            getFilteredProjects({projectFilter: convertedValues}).unwrap()
                .then((response) => {
                    dispatch(setData(response));
                    dispatch(setLoading(false));
                });
        }
    });

    useEffect(() => {
        formik.submitForm();
    }, []);

    return (<>
        <GenericSearch filterButtonVisible onClick={() => setOpened(true)}/>
        {/*TODO: Additional fields can be moved inside GenericSearch and be hidden in Collapse component*/}
        <SwipeableDrawer
            sx={{position: 'relative'}}
            anchor="right"
            open={opened}
            onClose={() => setOpened(false)}
            onOpen={() => setOpened(true)}
            disableSwipeToOpen={false}
            allowSwipeInChildren={true}
        >
            <DrawerHeader>
                <IconButton onClick={() => setOpened(false)}>
                    {theme.direction === 'ltr' ? <ChevronRight/> : <ChevronLeft/>}
                </IconButton>
            </DrawerHeader>
            <Grid component='form' noValidate onSubmit={formik.handleSubmit} container rowSpacing={3}
                  sx={{px: 3, my: 1}}>
                <Grid size={12}>
                    <TextField
                        fullWidth
                        label='Title'
                        name='title'
                        value={formik.values.title}
                        onChange={formik.handleChange}
                        error={formik.touched.title && Boolean(formik.errors.title)}
                        helperText={formik.touched.title && formik.errors.title}
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
                        label='Location'
                        name='location'
                        fullWidth
                        value={formik.values.location}
                        onChange={formik.handleChange}
                        error={formik.touched.location && Boolean(formik.errors.location)}
                        helperText={formik.touched.location && formik.errors.location}
                    />
                </Grid>
                <Grid id='budget' size={12}>
                    <Typography gutterBottom>Budget</Typography>
                    <Slider
                        name='budget'
                        getAriaLabel={() => 'Budget range'}
                        value={[sliderValues.min, sliderValues.max]}
                        onChange={(_, value) => setSliderValues({min: value[0], max: value[1]})}
                        onChangeCommitted={(_, value) => {
                            formik.setFieldValue('minBudget', value[0]);
                            formik.setFieldValue('maxBudget', value[1]);
                        }}
                        valueLabelDisplay="auto"
                        getAriaValueText={value => `${value}`}
                        min={0}
                        max={1000}
                    />
                </Grid>
                <Grid size={12}>
                    <TextField
                        label='Project Type'
                        name='projectType'
                        select
                        fullWidth
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
                <Grid size={12} sx={{
                    textAlign: 'center'
                }}>
                    <Button variant='contained' type='submit'>Apply Filter</Button>
                </Grid>
            </Grid>
        </SwipeableDrawer>
    </>);
};

export default ProjectsFilter;