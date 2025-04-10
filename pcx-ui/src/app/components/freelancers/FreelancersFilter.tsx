import {useAppDispatch} from "../../hooks";
import {setData, setLoading} from "../../../features/filter/filterSlice";
import {useGetFilteredFreelancersMutation} from "../../../features/api/pcxApi";
import {debounce, IconButton, MenuItem, Select, Slider, SwipeableDrawer, Typography} from "@mui/material";
import Grid from "@mui/material/Grid"
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
    firstName: string,
    lastName: string,
    categories: Category[];
    location: string;
    rating: number;
}

// TODO: hardcoded values
const initialValues: FilterValues = {
    firstName: '',
    lastName: '',
    categories: [],
    location: '',
    rating: 3,
}

const DrawerHeader = styled('div')(({theme}) => ({
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: 'flex-start',
}));


const FreelancersFilter = () => {
    const dispatch = useAppDispatch();
    const [ratingValue, setRatingValue] = useState(3);
    const [opened, setOpened] = useState(false);

    const [getFilteredFreelancers] = useGetFilteredFreelancersMutation();

    const formik= useFormik({
        initialValues,
        onSubmit: values => {
            const convertedValues = replaceEmptyStringsWithNull(values);
            getFilteredFreelancers({freelancerFilter: convertedValues}).unwrap()
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
                        label='First name'
                        name='firstName'
                        value={formik.values.firstName}
                        onChange={formik.handleChange}
                        error={formik.touched.firstName && Boolean(formik.errors.firstName)}
                        helperText={formik.touched.firstName && formik.errors.firstName}
                    />
                </Grid>
                <Grid size={12}>
                    <TextField
                        fullWidth
                        label='Last name'
                        name='lastName'
                        value={formik.values.lastName}
                        onChange={formik.handleChange}
                        error={formik.touched.lastName && Boolean(formik.errors.lastName)}
                        helperText={formik.touched.lastName && formik.errors.lastName}
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
            </Grid>
        </SwipeableDrawer>
    </>);
};

export default FreelancersFilter;