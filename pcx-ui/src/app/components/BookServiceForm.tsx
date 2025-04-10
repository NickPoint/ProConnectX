import {object, string} from 'yup';
import {Field, Form, Formik} from 'formik';
import {TextField} from 'formik-mui';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Fab,
    FabProps,
    Stack,
    Typography
} from '@mui/material';
import {useState} from "react";
import {styled} from "@mui/material/styles";
import {FreelancerDto, useBookServiceMutation} from "../../features/api/pcxApi.ts";
import Avatar from "@mui/material/Avatar";
import {enqueueSnackbar} from "notistack";

const FloatingButton = styled(Fab)<FabProps>(({theme}) => ({
    position: 'fixed',
    bottom: theme.spacing(5),
    left: '50%',
    transform: 'translateX(-50%)'
}));

interface Props {
    serviceId: number;
    serviceName: string;
    freelancer: FreelancerDto;
}

const initialState = {
    additionalNotes: ''
}

const validationSchema = object({
    additionalNotes: string(),
})

const BookServiceForm = (props: Props) => {
    const {serviceId, serviceName, freelancer} = props;
    const [dialogOpen, setDialogOpen] = useState(false);
    const [bookService] = useBookServiceMutation();
    return (
        <>
            <Dialog fullWidth={true} maxWidth='md' open={dialogOpen}>
                <DialogTitle>{serviceName}</DialogTitle>
                <DialogContent>
                    <Stack spacing={2}>
                        <Stack direction="row" spacing={2} sx={{alignItems: 'center'}}>
                            {freelancer.avatarUrl !== undefined ?
                                <Avatar src={freelancer.avatarUrl}/> :
                                <Avatar>
                                    {`${freelancer.firstName.charAt(0)}${freelancer.lastName.charAt(0)}`}
                                </Avatar>
                            }
                            <Typography>{`${freelancer.firstName} ${freelancer.lastName}`}</Typography>
                        </Stack>
                        <Formik
                            initialValues={initialState}
                            validationSchema={validationSchema}
                            onSubmit={(values, {setSubmitting}) => {
                                console.log(serviceId);
                                bookService({serviceId: serviceId, body: values.additionalNotes}).unwrap()
                                    .then((response) => {
                                        enqueueSnackbar(response.message, {variant: 'success'});
                                    })
                                    .finally(() => {
                                        setDialogOpen(false);
                                        setSubmitting(false);
                                    })
                            }}
                        >
                            {({submitForm, isSubmitting}) => (
                                <Form>
                                    <Field
                                        component={TextField}
                                        name="additionalNotes"
                                        label="Additional Notes / Requirements"
                                        fullWidth
                                        multiline
                                        rows={4}
                                    />
                                    <DialogActions>
                                        <Button onClick={() => setDialogOpen(false)} color="primary">
                                            Cancel
                                        </Button>
                                        <Button onClick={submitForm} disabled={isSubmitting} color="primary">
                                            Send Request
                                        </Button>
                                    </DialogActions>
                                </Form>
                            )}
                        </Formik>
                    </Stack>
                </DialogContent>
            </Dialog>
            <FloatingButton size='large' color='primary' variant='extended' onClick={() => setDialogOpen(true)}>
                Connect</FloatingButton>
        </>
    );
};

export default BookServiceForm;