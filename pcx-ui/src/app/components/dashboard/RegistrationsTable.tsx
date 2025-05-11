import {
    LightweightRegistrationRequestDto,
    ProfileStatus,
    ProfileType,
    useApproveRegistrationRequestMutation,
    useGetClientsRegistrationRequestsQuery,
    useGetCurrentUserQuery,
    useGetFreelancersRegistrationRequestsQuery,
    useGetRegistrationRequestsQuery,
    useRejectRegistrationRequestMutation,
} from "../../../features/api/pcxApi.ts";
import {GridColDef} from "@mui/x-data-grid";
import CustomizedDataGrid from "./CustomizedDataGrid.tsx";
import {t} from "i18next";
import {parseOffsetDateTime} from "../../../utils/dateParser.ts";
import Chip from "@mui/material/Chip";
import {Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid, Stack} from "@mui/material";
import Typography from "@mui/material/Typography";
import * as React from "react";
import {Form, Formik} from "formik";
import {FieldRenderer} from "../FieldRenderer.tsx";
import {generateInitialValuesFromConfig, generateValidationSchema} from "../formUtils.ts";
import {enqueueSnackbar} from "notistack";

function statusColor(status: ProfileStatus) {
    switch (status) {
        case 'ACTIVE':
            return 'success';
        case 'REJECTED':
            return 'error';
        default:
            return 'warning';
    }
}


const columns: GridColDef<LightweightRegistrationRequestDto>[] = [
    {field: 'firstName', headerName: t('form.fields.firstName'), width: 150},
    {field: 'lastName', headerName: t('form.fields.lastName'), width: 150},
    {field: 'email', headerName: t('form.fields.email'), width: 200},
    {field: 'phoneNumber', headerName: t('form.fields.phoneNumber'), width: 150},
    {
        field: 'profileStatus',
        headerName: t('form.fields.profileStatus'),
        width: 130,
        renderCell: (params) => (
            <Chip
                color={statusColor(params.value)}
                label={t(`enum.profileStatus.${params.value}`)}
                size="small"
            />
        ),
    },
    {
        field: 'registrationDate',
        headerName: t('form.fields.registrationDate'),
        width: 180,
        valueGetter: params => parseOffsetDateTime(params)
    },
];

const formConf = {
    rejectionReason: {
        label: 'rejectionReason',
        required: true,
        type: 'text',
        size: 12,
        multiline: true,
        maxRows: 4
    }
};

const adminColumns: GridColDef<LightweightRegistrationRequestDto>[] = [
    ...columns,
    {
        field: 'actions',
        headerName: t('general.actions'),
        width: 200,
        sortable: false,
        filterable: false,
        renderCell: (params) => {
            const [open, setOpen] = React.useState(false);
            const [approveRegistrationRequest] = useApproveRegistrationRequestMutation();
            const [rejectRegistrationRequest] = useRejectRegistrationRequestMutation();

            return (<Stack direction="row" spacing={1}>
                    {params.row.status === ProfileStatus.Pending &&
                        (<>
                            <Button
                                variant="contained"
                                color="success"
                                size="small"
                                onClick={() => approveRegistrationRequest({
                                    type: params.row.profileType,
                                    id: params.row.id,
                                }).unwrap()
                                    .then(() => {
                                        enqueueSnackbar(t('dashboard.registrations.registrationRequestApproved'), {variant: 'success'});
                                    })}
                            >
                                {t('buttons.approve')}
                            </Button>
                            <Button
                                variant="contained"
                                color="error"
                                size="small"
                                onClick={() => setOpen(true)}
                            >
                                {t('buttons.reject')}
                            </Button>
                        </>)}
                    <Dialog
                        open={open}
                        onClose={() => setOpen(false)}
                        fullWidth maxWidth='sm'
                    >
                        <Formik initialValues={generateInitialValuesFromConfig(formConf)}
                                validationSchema={generateValidationSchema(formConf)}
                                onSubmit={(values, formikHelpers) =>
                                    rejectRegistrationRequest({
                                        type: params.row.profileType,
                                        id: params.row.id,
                                        body: values.rejectionReason,
                                    }).unwrap()
                                        .then(() => {
                                            enqueueSnackbar(t('dashboard.registrations.registrationRequestRejected'), {variant: 'success'});
                                            setOpen(false);
                                        })
                                        .finally(() => formikHelpers.setSubmitting(false))}>
                            <Form noValidate>
                                <DialogTitle>{t('form.fields.rejectionReason')}</DialogTitle>
                                <DialogContent>
                                    <DialogContentText>
                                        {t('dashboard.registrations.rejectionReasonDialogText')}
                                    </DialogContentText>
                                    <Grid container spacing={1}>
                                        {Object.entries(formConf).map(([fieldName, fieldConfig]) => (
                                            <FieldRenderer key={fieldName} fieldName={fieldName}
                                                           fieldConfig={fieldConfig}/>
                                        ))}
                                    </Grid>
                                </DialogContent>
                                <DialogActions>
                                    <Button onClick={() => setOpen(false)}>{t('buttons.cancel')}</Button>
                                    <Button color='error' type="submit">{t('buttons.reject')}</Button>
                                </DialogActions>
                            </Form>
                        </Formik>
                    </Dialog>
                </Stack>
            )
        },
    },
]

export default function RegistrationsTable() {
    const {data: user} = useGetCurrentUserQuery();

    if (user) {
        return (
            user.activeProfile.profileType === ProfileType.Admin ?
                <>
                    <Grid size={12}>
                        <FreelancerRegistrationsTable/>
                    </Grid>
                    <Grid size={12}>
                        <ClientRegistrationsTable/>
                    </Grid>
                </> :
                <UserRegistrationsTable />
        );
    }
}

export function UserRegistrationsTable() {
    const {data: user} = useGetCurrentUserQuery();
    const pendingProfiles = user?.allProfiles.some(profile => profile.status !== ProfileStatus.Active);
    const {data: registrationRequests} = useGetRegistrationRequestsQuery(undefined, {
        skip: !pendingProfiles
    });
    return (
        registrationRequests &&
        <>
            <Grid size={12}>
                <Typography component="h2" variant="h6" sx={{mb: 2}}>
                    {t('dashboard.registrations.freelancersRegistrationRequests')}
                </Typography>
            </Grid>
            <Grid size={12}>
                <CustomizedDataGrid
                    rows={registrationRequests}
                    columns={columns}
                    disableRowSelectionOnClick
                />
            </Grid>
        </>
    );
}

export function FreelancerRegistrationsTable() {
    const {data: registrationRequests} = useGetFreelancersRegistrationRequestsQuery();

    return (
        registrationRequests &&
        <Grid container>
            <Grid size={12}>
                <Typography component="h2" variant="h6" sx={{mb: 2}}>
                    {t('dashboard.registrations.freelancersRegistrationRequests')}
                </Typography>
            </Grid>
            <Grid size={12}>
                <CustomizedDataGrid
                    rows={registrationRequests}
                    columns={adminColumns}
                    disableRowSelectionOnClick
                />
            </Grid>
        </Grid>
    );
}

export function ClientRegistrationsTable() {
    const {data: registrationRequests} = useGetClientsRegistrationRequestsQuery();

    return (
        registrationRequests &&
        <Grid container>
            <Grid size={12}>
                <Typography component="h2" variant="h6" sx={{mb: 2}}>
                    {t('dashboard.registrations.clientsRegistrationRequests')}
                </Typography>
            </Grid>
            <Grid size={12}>
                <CustomizedDataGrid
                    rows={registrationRequests}
                    columns={adminColumns}
                    disableRowSelectionOnClick
                />
            </Grid>
        </Grid>
    );
}