import {useAppDispatch, useAppSelector} from "../hooks";
import {
    selectTitle,
    selectCategories,
    selectLocation,
    setData, setTitle, setCategories, setLocation, setBudget, selectMinBudget, selectMaxBudget, setLoading
} from "../../features/projectFilter/projectFilterSlice";
import {useGetFilteredProjectsMutation} from "../../features/api/pcxApi";
import {
    Accordion,
    AccordionDetails,
    AccordionSummary, Box,
    debounce, IconButton,
    MenuItem,
    Paper,
    Select, Skeleton,
    Slider, SwipeableDrawer,
    Typography
} from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import TextField from "@mui/material/TextField";
import {Category} from "../../features/enums";
import * as React from "react";
import {useEffect, useState} from "react";
import {FormikValues, useFormik} from "formik";
import {ExpandMore, FilterAlt} from "@mui/icons-material";
import {styled} from "@mui/material/styles";
import {grey} from "@mui/material/colors";
import {Global} from "@emotion/react";
import Button from "@mui/material/Button";
import theme from "../theme/theme";
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

interface FilterValues {
    title: string;
    categories: Category[];
    location: string;
    minBudget: number;
    maxBudget: number;
}

// TODO: hardcoded values
const initialValues: FilterValues = {
    title: '',
    categories: [],
    location: '',
    minBudget: 0,
    maxBudget: 1000,
}

const replaceEmptyStringsWithNull = (values: FormikValues) => {
    const result: Record<string, any> = {};
    for (let key in values) {
        if (values.hasOwnProperty(key)) {
            result[key] = values[key] === '' || Array.isArray(values[key]) ? null : values[key];
        }
    }
    return result;
}

const DrawerHeader = styled('div')(({theme}) => ({
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: 'flex-start',
}));


const Filter = () => {
    const dispatch = useAppDispatch();
    const [sliderValues, setSliderValues] = useState({min: 0, max: 1000});
    const [opened, setOpened] = useState(false);

    const [getFilteredProjects, {isLoading}] = useGetFilteredProjectsMutation();

    useEffect(() => {
        dispatch(setLoading(isLoading));
    }, [dispatch, isLoading]);

    const formik = useFormik({
        initialValues,
        onSubmit: values => {
            const convertedValues = replaceEmptyStringsWithNull(values);
            getFilteredProjects({projectFilter: convertedValues}).unwrap()
                .then((response) => {
                    dispatch(setData(response));
                });
        }
    });

    useEffect(() => {
        const debounce1 = debounce(() => {
            formik.handleSubmit();
        }, 1000);
        debounce1();
        return debounce1.clear;
    }, [formik.values]);

    const container = window !== undefined ? () => window().document.body : undefined;

    return (
        <>
            <Grid container>
                <Grid xs={12}>
                    <Button
                        onClick={() => setOpened(true)} startIcon={<FilterAlt/>}>Filter</Button>
                </Grid>
            </Grid>
            <SwipeableDrawer
                anchor="right"
                open={opened}
                onClose={() => setOpened(false)}
                onOpen={() => setOpened(true)}
                disableSwipeToOpen={false}
            >
                <DrawerHeader>
                    <IconButton onClick={() => setOpened(false)}>
                        {theme.direction === 'ltr' ? <ChevronRightIcon/> : <ChevronLeftIcon/>}
                    </IconButton>
                </DrawerHeader>
                <Grid component='form' noValidate container rowSpacing={3} sx={{mx: 3, my: 1}}>
                    <Grid xs={12}>
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
                    <Grid xs={12}>
                        <Select
                            label='Categories'
                            name='categories'
                            multiple
                            fullWidth
                            value={formik.values.categories}
                            onChange={formik.handleChange('categories')}
                            error={formik.touched.categories && Boolean(formik.errors.categories)}
                        >
                            {Object.values(Category).map((category, index) => (
                                <MenuItem key={index} value={category}>
                                    {category}
                                </MenuItem>
                            ))}
                        </Select>
                    </Grid>
                    <Grid xs={12}>
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
                    <Grid xs={12}>
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
                </Grid>
            </SwipeableDrawer>
        </>
        // <Grid component='form' noValidate container spacing={2} sx={{flexDirection: 'column', m: 2}}>
        //     <Grid>
        //         <TextField
        //             fullWidth
        //             label='Title'
        //             name='title'
        //             value={formik.values.title}
        //             onChange={formik.handleChange}
        //             error={formik.touched.title && Boolean(formik.errors.title)}
        //             helperText={formik.touched.title && formik.errors.title}
        //         />
        //     </Grid>
        //     <Grid>
        //         <Select
        //             label='Categories'
        //             name='categories'
        //             multiple
        //             fullWidth
        //             value={formik.values.categories}
        //             onChange={formik.handleChange('categories')}
        //             error={formik.touched.categories && Boolean(formik.errors.categories)}
        //         >
        //             {Object.values(Category).map((category, index) => (
        //                 <MenuItem key={index} value={category}>
        //                     {category}
        //                 </MenuItem>
        //             ))}
        //         </Select>
        //     </Grid>
        //     <Grid>
        //         <TextField
        //             label='Location'
        //             name='location'
        //             fullWidth
        //             value={formik.values.location}
        //             onChange={formik.handleChange}
        //             error={formik.touched.location && Boolean(formik.errors.location)}
        //             helperText={formik.touched.location && formik.errors.location}
        //         />
        //     </Grid>
        //     <Grid>
        //         <Slider
        //             name='budget'
        //             getAriaLabel={() => 'Budget range'}
        //             value={[sliderValues.min, sliderValues.max]}
        //             onChange={(_, value) => setSliderValues({min: value[0], max: value[1]})}
        //             onChangeCommitted={(_, value) => {
        //                 formik.setFieldValue('minBudget', value[0]);
        //                 formik.setFieldValue('maxBudget', value[1]);
        //             }}
        //             valueLabelDisplay="auto"
        //             getAriaValueText={value => `${value}`}
        //             min={0}
        //             max={1000}
        //         />
        //     </Grid>
        // </Grid>
    );
};

export default Filter;