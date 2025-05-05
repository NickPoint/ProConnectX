import {
    AccountStatus,
    LightweightRegistrationRequestDto,
    RoleType,
    useApproveRegistrationRequestMutation,
    useGetClientRegistrationRequestsQuery,
    useGetClientsRegistrationRequestsQuery,
    useGetCurrentUserQuery,
    useGetFreelancerRegistrationRequestsQuery,
    useGetFreelancersRegistrationRequestsQuery,
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

function statusColor(status: AccountStatus) {
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
        field: 'accountStatus',
        headerName: t('form.fields.accountStatus'),
        width: 130,
        renderCell: (params) => (
            <Chip
                color={statusColor(params.value)}
                label={t(`enum.accountStatus.${params.value}`)}
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
                    {params.row.accountStatus === AccountStatus.Pending &&
                        (<>
                            <Button
                                variant="contained"
                                color="success"
                                size="small"
                                onClick={() => approveRegistrationRequest({
                                    type: params.row.accountType,
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
                                        type: params.row.accountType,
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

export function FreelancerRegistrationsTable() {
    const {data: user} = useGetCurrentUserQuery();
    let registrationRequests;
    if (user.activeRole === RoleType.RoleAdmin) {
        registrationRequests = useGetFreelancersRegistrationRequestsQuery().data;
    } else {
        registrationRequests = useGetFreelancerRegistrationRequestsQuery().data;
    }

    return (
        <>
            <Typography component="h2" variant="h6" sx={{mb: 2}}>
                {t('dashboard.registrations.freelancersRegistrationRequests')}
            </Typography>
            <CustomizedDataGrid
                rows={registrationRequests}
                columns={user.activeRole === RoleType.RoleAdmin ? adminColumns : columns}
                disableRowSelectionOnClick
            />
        </>
    );
}

export function ClientRegistrationsTable() {
    const {data: user} = useGetCurrentUserQuery();
    let registrationRequests;
    if (user.activeRole === RoleType.RoleAdmin) {
        registrationRequests = useGetClientsRegistrationRequestsQuery().data;
    } else {
        registrationRequests = useGetClientRegistrationRequestsQuery().data;
    }

    return (
        <>
            <Typography component="h2" variant="h6" sx={{mb: 2}}>
                {t('dashboard.registrations.clientsRegistrationRequests')}
            </Typography>
            <CustomizedDataGrid
                rows={registrationRequests}
                columns={user.activeRole === RoleType.RoleAdmin ? adminColumns : columns}
                disableRowSelectionOnClick
            />
        </>
    );
}