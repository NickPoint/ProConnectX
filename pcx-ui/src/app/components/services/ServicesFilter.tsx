import {useLazyGetServicesQuery} from "../../../features/api/enhancedApi";
import {
    Collapse,
    debounce,
    Divider,
    FormControl,
    InputLabel,
    MenuItem,
    Pagination,
    Select,
    SelectProps,
    Slider,
    Typography
} from "@mui/material";
import Grid from "@mui/material/Grid"
import TextField from "@mui/material/TextField";
import React, {useEffect, useState} from "react";
import {useFormik} from "formik";
import GenericSearch from "../GenericSearch.tsx";
import {CategoryType} from "../../../features/api/pcxApi.ts";
import CardList from "../../pages/CardList.tsx";
import {useTranslation} from "react-i18next";

const initialValues = {
    title: '',
    categories: [],
    location: '',
    rating: 3,
    minBudget: 0,
    maxBudget: 1000,
}

const SelectWithLabel = React.forwardRef<HTMLDivElement, SelectProps>(
    function SelectWithLabel(props, ref) {
        const {children, label, error, fullWidth, ...other} = props;
        return (
            <FormControl ref={ref} fullWidth={fullWidth} error={error}>
                <InputLabel id={label as string}>{label}</InputLabel>
                <Select label={label} {...other}>
                    {children}
                </Select>
            </FormControl>
        );
    });

const ServicesFilter = () => {
    const [budgetValues, setBudgetValues] = useState({min: 0, max: 1000});
    const [ratingValue, setRatingValue] = useState(3);
    const [getFilteredServices, {data, isLoading, isFetching}] = useLazyGetServicesQuery();
    const [filterOpened, setFilterOpened] = React.useState(false);
    const [page, setPage] = useState(0);
    const {t} = useTranslation();

    const handleFilterToggle = () => {
        setFilterOpened((prev) => !prev);
    };

    const formik = useFormik({
        initialValues,
        onSubmit: () => {
        }
    });

    useEffect(() => {
        const debounce1 = debounce(() => {
            getFilteredServices({
                page: page,
                size: 12,
                ...formik.values
            });
        }, 1000);
        debounce1();
        return debounce1.clear;
    }, [formik.values, page]);

    return (
        <Grid container spacing={4} sx={{justifyContent: "center"}}>
            <Grid size={{xs: 12, md: 6}} component='form' noValidate container spacing={2}>
                <Grid size={12}>
                    <GenericSearch
                        name='title'
                        fullWidth
                        value={formik.values.title}
                        onChange={formik.handleChange}
                        error={formik.touched.title && Boolean(formik.errors.title)}
                        placeholder='Marketing strategy'
                        onEndButtonClick={handleFilterToggle}
                        filterButtonVisible/>
                </Grid>
                <Collapse unmountOnExit in={filterOpened} sx={{width: '100%'}}>
                    <Grid container spacing={2}>
                        <Grid size={12}>
                            <SelectWithLabel fullWidth
                                             error={formik.touched.categories && Boolean(formik.errors.categories)}
                                             label='Categories'
                                             name='categories'
                                             multiple
                                             value={formik.values.categories}
                                             onChange={formik.handleChange}
                            >
                                {Object.values(CategoryType).map((category, index) => (
                                    <MenuItem key={index} value={category}>
                                        {t(`enum.categories.${category}`)}
                                    </MenuItem>
                                ))}
                            </SelectWithLabel>
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
                </Collapse>
            </Grid>
            <Grid size={12}>
                <Divider/>
            </Grid>
            <Grid size={12}>
                <CardList lastListSize={4} isLoading={isLoading || isFetching} data={data?.content}/>
            </Grid>
            <Grid size={12}>
                <Pagination
                    count={data?.totalPages || 0}
                    page={page + 1}
                    onChange={(event, value) => setPage(value - 1)}
                />
            </Grid>
        </Grid>
    );
};

export default ServicesFilter;