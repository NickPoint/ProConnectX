import {Form, Formik} from 'formik';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle, Divider,
    Fab,
    FabProps,
    Grid,
    Stack,
    Typography
} from '@mui/material';
import {useEffect, useRef, useState} from "react";
import {styled} from "@mui/material/styles";
import {BookServiceDto, ServiceDto} from "../../features/api/pcxApi.ts";
import Avatar from "@mui/material/Avatar";
import {enqueueSnackbar} from "notistack";
import {useTranslation} from 'react-i18next';
import {useNavigate} from "react-router-dom";
import {generateInitialValuesFromConfig, generateValidationSchema} from "./formUtils.ts";
import {FieldRenderer} from "./FieldRenderer.tsx";
import {useBookServiceMutation} from "../../features/api/enhancedApi.ts";

interface Props {
    service: ServiceDto;
}

const formConfig = {
    additionalNotes: {
        label: 'additionalNotes',
        required: false,
        type: 'text',
        multiline: true,
        rows: 4,
        size: 12
    },
    files: {
        label: 'additionalFiles',
        required: false,
        type: 'file',
        size: 12,
        multiple: true,
        maxSize: true,
    },
}

function mapValuesToFormData(id: number, values: BookServiceDto): FormData {
    const formData = new FormData();
    formData.append("serviceId", id.toString());
    Object.entries(values).forEach(([key, value]) => {
        if (Array.isArray(value)) {
            value.forEach((item) => {
                formData.append(key, item);
            });
        } else {
            formData.append(key, value as string | Blob);
        }
    });
    return formData;
}

const BookServiceForm = ({service}: Props) => {
    const [dialogOpen, setDialogOpen] = useState(false);
    const [bookService] = useBookServiceMutation();
    const bottomRef = useRef<HTMLDivElement>(null);
    const [isBottomVisible, setIsBottomVisible] = useState(false);
    const navigate = useNavigate();
    const {t} = useTranslation();

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
        bottom: isBottomVisible ? undefined : theme.spacing(5),
        left: '50%',
        transition: 'all 0.3s ease', //TODO: animation doesn't work
    }));

    return (
        <>
            <div ref={bottomRef} style={{height: '1px'}}/>
            <Dialog fullWidth={true} onClose={() => setDialogOpen(false)} maxWidth='md' open={dialogOpen}>
                <Formik
                    initialValues={generateInitialValuesFromConfig(formConfig)}
                    validationSchema={generateValidationSchema(formConfig)}
                    onSubmit={(values, {setSubmitting}) => {
                        bookService(mapValuesToFormData(service.id, values)).unwrap()
                            .then(() => {
                                enqueueSnackbar(t('service.form.success'), {variant: 'success'});
                                navigate('/dashboard/orders');
                            })
                            .finally(() => {
                                setDialogOpen(false);
                                setSubmitting(false);
                            })
                    }}
                >
                    {({submitForm, isSubmitting}) => (
                        <>
                            <DialogTitle>{t('service.form.title')}</DialogTitle>
                            <DialogContent>
                                <Grid container spacing={2}>
                                    <Grid size={12} container spacing={2} alignItems='center'>
                                        <Grid size={12}>
                                            <Divider/>
                                        </Grid>
                                        <Grid size={6}>
                                            <Stack spacing={1}>
                                                <Typography variant='h4'>{service.title}</Typography>
                                                <Stack direction="row" spacing={1} sx={{alignItems: 'center'}}>
                                                    <Avatar alt={service.freelancer.firstName}
                                                            src={service.freelancer.avatarImageUrl}/>
                                                    <Typography>{`${service.freelancer.firstName} ${service.freelancer.lastName}`}</Typography>
                                                </Stack>
                                            </Stack>
                                        </Grid>
                                        <Grid size={6} textAlign='right'>
                                            <Typography variant='h4' fontWeight='700'>${service.price}</Typography>
                                            <Typography variant='body2'>{t('service.package.basic')}</Typography>
                                        </Grid>
                                        <Grid size={12}>
                                            <Divider/>
                                        </Grid>
                                    </Grid>
                                    <Grid size={12}>
                                        <Form>
                                            <Grid size={12} container spacing={1}>
                                                {Object.entries(formConfig).map(([fieldName, fieldConfig]) => (
                                                    <FieldRenderer key={fieldName} fieldName={fieldName}
                                                                   fieldConfig={fieldConfig}/>
                                                ))}
                                            </Grid>
                                        </Form>
                                    </Grid>
                                </Grid>
                            </DialogContent>
                            <DialogActions>
                                <Stack width='100%' direction='row' justifyContent='space-between'>
                                    <Button onClick={() => setDialogOpen(false)} color="error">
                                        {t('buttons.cancel')}
                                    </Button>
                                    <Button variant='contained' onClick={submitForm} disabled={isSubmitting}
                                            color="primary">
                                        {t('buttons.sendRequest')}
                                    </Button>
                                </Stack>
                            </DialogActions>
                        </>
                    )}
                </Formik>
            </Dialog>
            <FloatingButton size='large' color='primary' variant='extended' onClick={() => setDialogOpen(true)}>
                {t('buttons.connect')}</FloatingButton>
        </>
    );
};

export default BookServiceForm;