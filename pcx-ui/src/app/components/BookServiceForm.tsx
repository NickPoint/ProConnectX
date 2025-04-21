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
import {useEffect, useRef, useState} from "react";
import {styled} from "@mui/material/styles";
import {FreelancerDto, useBookServiceMutation} from "../../features/api/pcxApi.ts";
import Avatar from "@mui/material/Avatar";
import {enqueueSnackbar} from "notistack";

interface Props {
    id: number;
    title: string;
    freelancer: FreelancerDto;
}

const initialState = {
    additionalNotes: ''
}

const validationSchema = object({
    additionalNotes: string(),
})

const BookServiceForm = (props: Props) => {
    const {id, title, freelancer} = props;
    const [dialogOpen, setDialogOpen] = useState(false);
    const [bookService] = useBookServiceMutation();
    const bottomRef = useRef<HTMLDivElement>(null);
    const [isBottomVisible, setIsBottomVisible] = useState(false);

    useEffect(() => {
        if (!bottomRef.current) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                setIsBottomVisible(entry.isIntersecting);
            },
            {
                root: null,
                threshold: 0,
            }
        );

        observer.observe(bottomRef.current);

        return () => observer.disconnect();
    }, []);

    const FloatingButton = styled(Fab)<FabProps>(({theme}) => ({
        transform: 'translateX(-50%)',
        position: isBottomVisible ? 'relative' : 'fixed',
        bottom: isBottomVisible ? undefined :  theme.spacing(5),
        left: '50%',
        transition: 'all 0.3s ease', //TODO: animation doesn't work
    }));

    return (
        <>
            <div ref={bottomRef} style={{ height: '1px' }} />
            <Dialog fullWidth={true} maxWidth='md' open={dialogOpen}>
                <DialogTitle>{title}</DialogTitle>
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
                                bookService({serviceId: id, body: values.additionalNotes}).unwrap()
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