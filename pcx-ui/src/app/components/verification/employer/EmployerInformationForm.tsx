import {Field} from "formik";
import {TextField} from "formik-mui";
import Grid from "@mui/material/Grid";

const EmployerInformationForm = () => {
    return (
        <Grid container spacing={1}>
            <Grid size={{xs: 6}}>
                <Field name="employerInformation.companyName" label="Company Name" component={TextField} fullWidth required/>
            </Grid>
            <Grid size={{xs: 6}}>
                <Field name="employerInformation.registrationCode" label="Registration Code" component={TextField} fullWidth required/>
            </Grid>
            <Grid size={{xs: 12}}>
                <Field name="employerInformation.email" label="Email" component={TextField} fullWidth required/>
            </Grid>
            <Grid size={{xs: 12}}>
                <Field name="employerInformation.address" label="Address" component={TextField} fullWidth required/>
            </Grid>
            <Grid size={{xs: 6}}>
                <Field name="employerInformation.phoneNumber" label="Phone Number" component={TextField} fullWidth required/>
            </Grid>
            <Grid size={{xs: 6}}>
                <Field name="employerInformation.country" label="Country" component={TextField} fullWidth required/>
            </Grid>
            <Grid size={{xs: 12}}>
                <Field name="employerInformation.description" label="Description" component={TextField} multiline fullWidth minRows={5}/>
            </Grid>
        </Grid>
    )
}

export default EmployerInformationForm;