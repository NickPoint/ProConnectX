import {useAppDispatch, useAppSelector} from "../../hooks";
import {setData, setLoading} from "../../../features/filter/filterSlice";
import {useGetFilteredServicesMutation} from "../../../features/api/pcxApi";
import {
    debounce, IconButton,
    MenuItem,
    Select,
    Slider, SwipeableDrawer,
    Typography
} from "@mui/material";
import Grid from "@mui/material/Grid2"
import TextField from "@mui/material/TextField";
import {Category} from "../../../features/enums";
import * as React from "react";
import {useEffect, useState} from "react";
import {useFormik} from "formik";
import {FilterAlt} from "@mui/icons-material";
import {styled} from "@mui/material/styles";
import Button from "@mui/material/Button";
import theme from "../../theme/theme";
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import {replaceEmptyStringsWithNull} from "../../../features/filter/formikHelper";

interface FilterValues {
    title: string;
    categories: Category[];
    location: string;
    rating: number;
    minBudget: number;
    maxBudget: number;
}

// TODO: hardcoded values
const initialValues: FilterValues = {
    title: '',
    categories: [],
    location: '',
    rating: 3,
    minBudget: 0,
    maxBudget: 1000,
}

const DrawerHeader = styled('div')(({theme}) => ({
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: 'flex-start',
}));


const ServicesFilter = () => {
    const dispatch = useAppDispatch();
    const [budgetValues, setBudgetValues] = useState({min: 0, max: 1000});
    const [ratingValue, setRatingValue] = useState(3);
    const [opened, setOpened] = useState(false);

    const [getFilteredServices] = useGetFilteredServicesMutation();

    const formik = useFormik({
        initialValues,
        onSubmit: values => {
            const convertedValues = replaceEmptyStringsWithNull(values);
            getFilteredServices({serviceFilter: convertedValues}).unwrap()
                .then((response) => {
                    dispatch(setData(response));
                    dispatch(setLoading(false));
                });
        }
    });

    useEffect(() => {
        dispatch(setLoading(true));
        const debounce1 = debounce(() => {
            formik.handleSubmit();
        }, 1000);
        debounce1();
        return debounce1.clear;
    }, [formik.values]);

    return (<>
        <Button
            onClick={() => setOpened(true)} startIcon={<FilterAlt/>}>Filter</Button>
        <SwipeableDrawer
            anchor="right"
            open={opened}
            onClose={() => setOpened(false)}
            onOpen={() => setOpened(true)}
            disableSwipeToOpen={false}
            allowSwipeInChildren={true}
        >
            <DrawerHeader>
                <IconButton onClick={() => setOpened(false)}>
                    {theme.direction === 'ltr' ? <ChevronRightIcon/> : <ChevronLeftIcon/>}
                </IconButton>
            </DrawerHeader>
            <Grid component='form' noValidate container rowSpacing={3} sx={{px: 3, my: 1}}>
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
                <Grid id='rating' size={12}>
                    <Typography gutterBottom>Rating</Typography>
                    <Slider
                        name='rating'
                        getAriaLabel={() => 'Rating range'}
                        value={ratingValue}
                        onChange={(_, value) => setRatingValue(value)}
                        onChangeCommitted={(_, value) => {
                            formik.setFieldValue('rating', value);
                        }}
                        valueLabelDisplay="auto"
                        getAriaValueText={value => `${value}`}
                        min={0}
                        max={5}
                        step={0.1}
                    />
                </Grid>
                <Grid size={12}>
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
                        value={[budgetValues.min, budgetValues.max]}
                        onChange={(_, value) => setBudgetValues({min: value[0], max: value[1]})}
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
    </>);
};

export default ServicesFilter;