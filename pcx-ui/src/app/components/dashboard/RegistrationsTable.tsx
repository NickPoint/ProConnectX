import {
    RegistrationRequestDto,
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
import {parseOffsetDateTimeToString} from "../../../utils/dateParser.ts";
import Chip from "@mui/material/Chip";
import {Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid, Stack} from "@mui/material";
import Typography from "@mui/material/Typography";
import * as React from "react";
import {Form, Formik} from "formik";
import {FieldRenderer} from "../FieldRenderer.tsx";
import {generateInitialValuesFromConfig, generateValidationSchema} from "../formUtils.ts";
import {enqueueSnackbar} from "notistack";
import {useCallback, useMemo, useState} from "react"
import {useTranslation} from "react-i18next";

function useRegistrationColumns(isAdmin: boolean) {
    const { t, i18n } = useTranslation();

    const statusColor = useCallback((status) => {
        switch (status) {
            case 'ACTIVE':  return 'success';
            case 'REJECTED':return 'error';
            default:        return 'warning';
        }
    }, []);

    const base: GridColDef[] = useMemo(() => [
        { field: 'firstName',    headerName: t('form.fields.firstName'),    width: 150 },
        { field: 'lastName',     headerName: t('form.fields.lastName'),     width: 150 },
        { field: 'email',        headerName: t('form.fields.email'),        width: 200 },
        { field: 'phoneNumber',  headerName: t('form.fields.phoneNumber'),  width: 150 },
        { field: 'profileType',  headerName: t('form.fields.profileType'),  width: 150 },
        {
            field: 'profileStatus',
            headerName: t('form.fields.profileStatus'),
            width: 130,
            renderCell: params => (
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
            valueGetter: (value) => parseOffsetDateTimeToString(value),
        },
    ], [t, i18n.language, statusColor]);

    return useMemo(() => isAdmin
            ? [...base, { field: 'actions', headerName: t('general.actions'), width: 200, sortable: false, filterable: false, renderCell: ActionsCell }]
            : base
        , [base, isAdmin, t, i18n.language]);
}

const formConf = {
    rejectionReason: { label: 'rejectionReason', required: true, type: 'text', size: 12, multiline: true, maxRows: 4 }
};

function RejectDialog({ open, onClose, onSubmit }) {
    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <Formik
                initialValues={generateInitialValuesFromConfig(formConf)}
                validationSchema={generateValidationSchema(formConf)}
                onSubmit={(values, { setSubmitting }) =>
                    onSubmit(values.rejectionReason).finally(() => setSubmitting(false))
                }
            >
                <Form noValidate>
                    <DialogTitle>{t('form.fields.rejectionReason')}</DialogTitle>
                    <DialogContent>
                        <DialogContentText>{t('dashboard.registrations.rejectionReasonDialogText')}</DialogContentText>
                        <Grid container spacing={1}>
                            {Object.entries(formConf).map(([name, config]) => (
                                <FieldRenderer key={name} fieldName={name} fieldConfig={config} />
                            ))}
                        </Grid>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={onClose}>{t('buttons.cancel')}</Button>
                        <Button color="error" type="submit">{t('buttons.reject')}</Button>
                    </DialogActions>
                </Form>
            </Formik>
        </Dialog>
    );
}

function ActionsCell({ row }) {
    const [open, setOpen] = useState(false);
    const [approveReq] = useApproveRegistrationRequestMutation();
    const [rejectReq]  = useRejectRegistrationRequestMutation();

    const handleApprove = useCallback(() => {
        approveReq({ type: row.profileType, id: row.id }).unwrap()
            .then(() => enqueueSnackbar(t('dashboard.registrations.registrationRequestApproved'), { variant: 'success' }));
    }, [approveReq, row]);

    const handleReject = useCallback((reason) => {
        return rejectReq({ type: row.profileType, id: row.id, body: reason }).unwrap()
            .then(() => enqueueSnackbar(t('dashboard.registrations.registrationRequestRejected'), { variant: 'success' }));
    }, [rejectReq, row]);

    return (
        <Stack direction="row" spacing={1}>
            {row.profileStatus === ProfileStatus.Pending && (
                <>
                    <Button variant="contained" color="success" size="small" onClick={handleApprove}>
                        {t('buttons.approve')}
                    </Button>
                    <Button variant="contained" color="error" size="small" onClick={() => setOpen(true)}>
                        {t('buttons.reject')}
                    </Button>
                </>
            )}
            <RejectDialog
                open={open}
                onClose={() => setOpen(false)}
                onSubmit={reason => handleReject(reason).then(() => setOpen(false))}
            />
        </Stack>
    );
}

export default function RegistrationsTable() {
    const { data: user } = useGetCurrentUserQuery();
    return user?.activeProfile.profileType === ProfileType.Admin ? (
        <Grid container spacing={2}>
            <Grid size={12}>
                <AdminRegistrationsTable
                    fetchHook={useGetFreelancersRegistrationRequestsQuery}
                    titleKey="dashboard.registrations.freelancersRegistrationRequests"
                />
            </Grid>
            <Grid size={12}>
                <AdminRegistrationsTable
                    fetchHook={useGetClientsRegistrationRequestsQuery}
                    titleKey="dashboard.registrations.clientsRegistrationRequests"
                />
            </Grid>
        </Grid>
    ) : (
        <UserRegistrationsTable />
    );
}

export function UserRegistrationsTable() {
    const { data: user } = useGetCurrentUserQuery();
    const { data: rows } = useGetRegistrationRequestsQuery(undefined, { skip: !user?.allProfiles.some(p => p.status !== ProfileStatus.Active) });
    const columns = useRegistrationColumns(false);
    const getRowId = React.useCallback(row => `${row.id}-${row.profileType}`, []);

    return rows ? (
        <>
            <Typography variant="h6">{t('dashboard.registrations.yourRegistrationRequests')}</Typography>
            <CustomizedDataGrid rows={rows} columns={columns} getRowId={getRowId} disableRowSelectionOnClick />
        </>
    ) : null;
}

export function AdminRegistrationsTable({ fetchHook, titleKey }) {
    const { data: rows } = fetchHook();
    const columns = useRegistrationColumns(true);
    const getRowId = React.useCallback(row => `${row.id}-${row.profileType}`, []);

    return rows ? (
        <>
            <Typography variant="h6">{t(titleKey)}</Typography>
            <CustomizedDataGrid rows={rows} columns={columns} getRowId={getRowId} disableRowSelectionOnClick />
        </>
    ) : null;
}