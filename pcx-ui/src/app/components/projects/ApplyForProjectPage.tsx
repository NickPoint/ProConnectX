import Grid from "@mui/material/Grid"
import {Alert, AlertColor, Collapse, IconButton, Paper, Typography} from "@mui/material";
import {useAppDispatch} from "../../hooks";
import * as React from "react";
import {useEffect, useState} from "react";
import {setPageTitle} from "../../../features/header/headerSlice";
import {useMakeBidMutation} from "../../../features/api/enhancedApi";
import {useFormik} from "formik";
import {number, object, string} from "yup";
import TextField from "@mui/material/TextField";
import {useNavigate, useParams} from "react-router-dom";
import {FloatingButton} from "./ProjectPage";
import CloseIcon from "@mui/icons-material/Close";
import {BidRequest} from "../../../features/api/pcxApi";
import Button from "@mui/material/Button";

interface ApplyForProjectPageProps {
    id: string;
}

const validationSchema = object({
    amount: number()
        .required('Price is required'),
    dueDate: string(),
    coverLetter: string(),
    shortCoverLetter: string(),
});

interface FormValues {
    amount: number | undefined;
    dueDate: string | undefined;
    coverLetter: string | undefined;
    shortCoverLetter: string | undefined;
}

const initialValues: BidRequest = {
    amount: 0,
    dueDate: '',
    coverLetter: '',
    shortCoverLetter: ''
}

const ApplyForProjectPage = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const [alert, setAlert] = useState({message: '', severity: 'info'});
    const {id} = useParams<{ id: string }>();
    if (!id) {
        return <div>Error</div>;
    }

    useEffect(() => {
        dispatch(setPageTitle('Submit Proposal'));
    }, [dispatch]);

    const [makeBid] = useMakeBidMutation();

    const formik = useFormik({
        initialValues,
        validationSchema,
        onSubmit: (values, formikHelpers) => {
            setAlert({message: 'Sending proposal...', severity: 'info'});
            makeBid({projectId: Number.parseInt(id), bidRequest: values}).unwrap()
                .catch((error) => {
                    if (error.data !== undefined) {
                        setAlert({message: error.data.message, severity: 'error'});
                    }
                })
                .then((response) => {
                    if (response && response.message) {
                        setAlert({message: response.message, severity: 'success'});
                        formik.setStatus(true);
                    }
                })
                .finally(() => {
                    formikHelpers.setSubmitting(false);
                })
        }
    });

    //TODO: Add milestone possibilities
    return (<>
        <Grid container spacing={3} sx={{
            textAlign: 'left'
        }}>
            <Grid size={12}>
                <Typography variant='h4' component='h2'>Project Bid</Typography>
            </Grid>
            <Grid size={12}>
                <Grid component='form' noValidate onSubmit={formik.handleSubmit} container spacing={2}>
                    <Grid size={6}>
                        <TextField
                            fullWidth
                            name='amount'
                            label='Amount'
                            type='number'
                            value={formik.values.amount}
                            onChange={formik.handleChange}
                            error={formik.touched.amount && Boolean(formik.errors.amount)}
                            helperText={formik.touched.amount && formik.errors.amount}
                            slotProps={{
                                input: {
                                    readOnly: formik.status,
                                }
                            }}
                        />
                    </Grid>
                    <Grid size={6}>
                        <TextField
                            fullWidth
                            name='dueDate'
                            type='date'
                            label='Due Date'
                            value={formik.values.dueDate}
                            onChange={formik.handleChange}
                            error={formik.touched.dueDate && Boolean(formik.errors.dueDate)}
                            helperText={formik.touched.dueDate && formik.errors.dueDate}
                            slotProps={{
                                input: {
                                    readOnly: formik.status,
                                },

                                htmlInput: {min: new Date().toISOString().split('T')[0]},
                                inputLabel: {shrink: true}
                            }} />
                    </Grid>
                    <Grid size={12}>
                        <TextField
                            fullWidth
                            name='shortCoverLetter'
                            label='Short Cover Letter'
                            multiline
                            rows={2}
                            value={formik.values.shortCoverLetter}
                            onChange={formik.handleChange}
                            error={formik.touched.shortCoverLetter && Boolean(formik.errors.shortCoverLetter)}
                            helperText={formik.touched.shortCoverLetter && formik.errors.shortCoverLetter}
                            slotProps={{
                                input: {
                                    readOnly: formik.status,
                                }
                            }}
                        />
                    </Grid>
                    <Grid size={12}>
                        <TextField
                            fullWidth
                            name='coverLetter'
                            label='Cover Letter'
                            multiline
                            rows={4}
                            value={formik.values.coverLetter}
                            onChange={formik.handleChange}
                            error={formik.touched.coverLetter && Boolean(formik.errors.coverLetter)}
                            helperText={formik.touched.coverLetter && formik.errors.coverLetter}
                            slotProps={{
                                input: {
                                    readOnly: formik.status,
                                }
                            }}
                        />
                    </Grid>
                    {!formik.status && <FloatingButton type='submit' variant='contained' color='primary'>Send
                        Proposal</FloatingButton>}
                </Grid>
            </Grid>
            <Grid size={12}>
                <Collapse in={formik.status}
                          onExited={() => setAlert({message: '', severity: 'info'})}>
                    <Alert
                        severity={alert.severity as AlertColor}
                        action={!formik.status &&
                            <IconButton
                                aria-label="close"
                                color="inherit"
                                size="small"
                                onClick={() => {
                                    formik.setStatus(false);
                                }}
                            >
                                <CloseIcon fontSize="inherit"/>
                            </IconButton>
                        }
                        sx={{mb: 2}}
                    >
                        {alert.message}
                    </Alert>
                </Collapse>
            </Grid>
            {formik.status &&
                <Grid size={12}>
                    <Paper sx={{p: 2, textAlign: 'center'}}>
                        <Grid container spacing={2}>
                            <Grid size={12}>
                                <Typography variant='h4'>Thank you for your proposal!</Typography>
                            </Grid>
                            <Grid size={12}>
                                <Typography variant='body1'>Your proposal has been sent to the client. You will be
                                    notified
                                    if the client accepts your proposal.</Typography>
                            </Grid>
                            <Grid size={12}>
                                <Typography variant='body1'>You can view your proposals in the Bids
                                    page.</Typography>
                            </Grid>
                            <Grid size={12}>
                                <Button variant='contained' onClick={() => navigate(-1)}>Back to Project</Button>
                            </Grid>
                        </Grid>
                    </Paper>
                </Grid>
            }
        </Grid>
    </>);
}

export default ApplyForProjectPage;