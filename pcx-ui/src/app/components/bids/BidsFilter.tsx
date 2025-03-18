import TextField from "@mui/material/TextField";
import {
    debounce, FormControl,
    IconButton,
    InputAdornment, InputLabel,
    MenuItem,
    Select,
    Slider,
    SwipeableDrawer,
    Typography
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import {FilterAlt} from "@mui/icons-material";
import {useEffect, useRef, useState} from "react";
import {useParams} from "react-router-dom";
import {useFormik} from "formik";
import {BidStatus} from "../../../features/enums";
import {useAppDispatch} from "../../hooks";
import {setData, setLoading} from "../../../features/filter/filterSlice";
import theme from "../../theme/theme";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import Grid from "@mui/material/Grid2"
import * as React from "react";
import {styled} from "@mui/material/styles";
import Button from "@mui/material/Button";
import {useLazyGetFilteredBidsQuery} from "../../../features/api/enhancedApi";
import {setPageTitle} from "../../../features/header/headerSlice";

const initialValues = {
    firstName: '',
    lastName: '',
    minPrice: 0,
    maxPrice: 1000,
    statuses: [] as BidStatus[],
}

const DrawerHeader = styled('div')(({theme}) => ({
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: 'flex-start',
}));

const BidsFilter = () => {
    const dispatch = useAppDispatch();
    const [ratingValue, setRatingValue] = useState(3);
    const [budgetValues, setBudgetValues] = useState({min: 0, max: 1000});
    const [opened, setOpened] = useState(false);
    const [realTimeSearch, setRealTimeSearch] = useState('');
    const {id} = useParams<{ id: string }>();
    if (!id) {
        return <div>Can't find chose project</div>;
    }

    const [getFilteredBids, {data}]
        = useLazyGetFilteredBidsQuery(); //TODO: is it better to use query or mutation for filtering?

    const formik = useFormik({
        initialValues,
        onSubmit: (values) => {
            dispatch(setLoading(true));
            setOpened(false);
            // const filter = replaceEmptyStringsWithNull(values) as FormikValues;
            const valuesWithId = {...values, projectId: Number.parseInt(id)};
            getFilteredBids(valuesWithId).unwrap()
                .then((response) => {
                    dispatch(setData(response));
                });
            dispatch(setLoading(false));
        }
    });

    useEffect(() => {
        dispatch(setPageTitle('Bids'));
        formik.handleSubmit();
    }, [dispatch]);

    const handleRealTimeSearch = () => {
        const filteredData = data?.filter((bid) => {
            const search = realTimeSearch.toLowerCase();
            if (!search) {
                return true;
            }
            return bid?.shortCoverLetter?.toLowerCase().includes(search)
        });
        dispatch(setData(filteredData));
    }

    useEffect(() => {
        if (!data) {
            return;
        }
        dispatch(setLoading(true));
        const debounced = debounce(() => {
            handleRealTimeSearch();
            dispatch(setLoading(false));
        }, 500);

        debounced();
        return debounced.clear;
    }, [realTimeSearch]);

    return (<>
        <TextField
            name='search'
            label='Search bids'
            value={realTimeSearch}
            onChange={(e) => setRealTimeSearch(e.target.value)}
            slotProps={{
                input: {
                    startAdornment: (
                        <InputAdornment position="start">
                            <SearchIcon/>
                        </InputAdornment>
                    ),
                    endAdornment: (
                        <IconButton color='primary' onClick={() => setOpened(true)}>
                            <FilterAlt/>
                        </IconButton>
                    )
                }
            }}
        />
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
            <Grid component='form' noValidate container onSubmit={formik.handleSubmit} spacing={3} sx={{px: 3, my: 1}}>
                <Grid size={6}>
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
                <Grid size={6}>
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
                    <FormControl fullWidth
                                 error={formik.touched.statuses && Boolean(formik.errors.statuses)}>
                        <InputLabel id='status'>Status</InputLabel>
                        <Select
                            label='Status'
                            name='status'
                            labelId='status'
                            multiple
                            fullWidth
                            value={formik.values.statuses}
                            onChange={formik.handleChange}
                        >
                            {Object.values(BidStatus).map((bid, index) => (
                                <MenuItem key={index} value={bid}>
                                    {bid}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>
                <Grid size={12}>
                    <Typography gutterBottom>Price</Typography>
                    <Slider
                        name='price'
                        getAriaLabel={() => 'Price range'}
                        value={[budgetValues.min, budgetValues.max]}
                        onChange={(_, value) => setBudgetValues({min: value[0], max: value[1]})}
                        onChangeCommitted={(_, value) => {
                            formik.setFieldValue('minPrice', value[0]);
                            formik.setFieldValue('maxPrice', value[1]);
                        }}
                        valueLabelDisplay="auto"
                        getAriaValueText={value => `${value}`}
                        min={0}
                        max={1000}
                    />
                </Grid>
                <Grid size={12} sx={{
                    textAlign: 'center'
                }}>
                    <Button variant='contained' type='submit'>Apply Filter</Button>
                </Grid>
            </Grid>
        </SwipeableDrawer>
    </>);
}

export default BidsFilter;