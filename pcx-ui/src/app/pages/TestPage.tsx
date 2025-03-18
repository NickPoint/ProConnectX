import { Button } from "@mui/material";
import {Field, Form, Formik} from "formik";
import {TextField} from "formik-mui";

const initialValues = {
    firstName: '',
    lastName: '',
    email: '',
}

const TestPage = () => {
    return (
        <Formik initialValues={initialValues}
                onSubmit={(values, formikHelpers) => {
                    console.log(values);
                }}>
            {({submitForm, isSubmitting}) => (
                <Form>
                    <Field component={TextField} name='firstName' label='First Name'/>
                    <Field component={TextField} name='lastName' label='Last Name'/>
                    <Field component={TextField} name='email' label='Email'/>
                    <Button onClick={submitForm}>Submit</Button>
                </Form>
            )}

        </Formik>
    );
}

export default TestPage;