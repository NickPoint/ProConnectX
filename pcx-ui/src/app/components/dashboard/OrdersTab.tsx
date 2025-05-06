import {
    Box,
    Button,
    CardActionArea,
    CardHeader,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    Grid,
    LinearProgress,
    Pagination,
    Stack
} from "@mui/material";
import {
    DisputeStatus,
    EventDto,
    EventType,
    OrderDto,
    OrderStatus,
    RoleType,
    TransactionStatus,
    useAcceptOrderMutation,
    useAcceptProposalMutation,
    useApproveOrderMutation,
    useCancelOrderMutation,
    useDisputeOrderMutation,
    useGetCurrentUserQuery,
    useGetDisputeQuery,
    useGetOrdersQuery,
    useProposeSolutionMutation,
    useRejectProposalMutation,
    useSubmitOrderForReviewMutation
} from "../../../features/api/pcxApi.ts";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import Chip from "@mui/material/Chip";
import {useTranslation} from "react-i18next";
import CardContent from "@mui/material/CardContent";
import {parseOffsetDateTime} from "../../../utils/dateParser.ts";
import UserCard from "../UserCard.tsx";
import {useState} from "react";
import Timeline from "@mui/lab/Timeline";
import TimelineItem from "@mui/lab/TimelineItem";
import TimelineOppositeContent from "@mui/lab/TimelineOppositeContent";
import TimelineSeparator from "@mui/lab/TimelineSeparator";
import TimelineDot from "@mui/lab/TimelineDot";
import TimelineConnector from "@mui/lab/TimelineConnector";
import TimelineContent from "@mui/lab/TimelineContent";
import {Form, Formik} from "formik";
import {generateInitialValuesFromConfig, generateValidationSchema} from "../formUtils.ts";
import {FieldRenderer} from "../FieldRenderer.tsx";
import {enqueueSnackbar} from "notistack";
import dayjs, {Dayjs} from "dayjs";
import {useNavigate} from "react-router-dom";
import {GlobalLoadingBackdrop} from "../GlobalLoadingBackdrop.tsx";


interface EventsTimelineProps {
    events: EventDto[];
}

const EventsTimeline = ({events}: EventsTimelineProps) => {
    const {t} = useTranslation();
    const [openProposalDialog, setOpenProposalDialog] = useState(false);
    const [disputeId, setDisputeId] = useState<number>();

    return (
        <>
            <Timeline position='left'>
                {events.map(((event, index) => (
                    <TimelineItem key={index}>
                        <TimelineOppositeContent color="text.secondary">
                            {parseOffsetDateTime(event.createdAt)}
                        </TimelineOppositeContent>
                        <TimelineSeparator>
                            <TimelineDot/>
                            {index !== events.length - 1 && <TimelineConnector/>}
                        </TimelineSeparator>
                        {event.type === EventType.OrderDisputed && event.disputeId ?
                            <TimelineContent sx={{textDecoration: 'underline', cursor: 'pointer'}}
                                             onClick={() => {
                                                 setDisputeId(event.disputeId)
                                                 setOpenProposalDialog(true)
                                             }}>{t(`enum.eventType.${event.type}`)}</TimelineContent> :
                            <TimelineContent>{t(`enum.eventType.${event.type}`)}</TimelineContent>
                        }
                    </TimelineItem>
                )))}
            </Timeline>
            {disputeId && (
                <ProposalDialog open={openProposalDialog} onClose={() => setOpenProposalDialog(false)}
                                disputeId={disputeId}/>
            )}
        </>
    );
}

export function getOrderStatusChipColor(status: OrderStatus) {
    switch (status) {
        case OrderStatus.Approved:
        case OrderStatus.Completed:
            return "success";
        case OrderStatus.Canceled:
        case OrderStatus.Disputed:
            return "error"
        case OrderStatus.InProgress:
        case OrderStatus.SubmittedForReview:
            return "warning";
        default:
            return "default";
    }
}

export function getTransactionStatusChipColor(status: TransactionStatus) {
    switch (status) {
        case TransactionStatus.Released:
        case TransactionStatus.Refunded:
            return "success";
        case TransactionStatus.Canceled:
        case TransactionStatus.Disputed:
            return "error";
        case TransactionStatus.Escrowed:
        case TransactionStatus.Pending:
            return "warning";
        default:
            return "default";
    }
}


export function calculateProgress(createdAt: string, status: OrderStatus, deadline?: string) {
    if (status === OrderStatus.Approved || status === OrderStatus.Canceled) {
        return 100;
    }
    if (!deadline) {
        return 0;
    }
    const createdAtDate = new Date(createdAt).getTime();
    const deadlineDate = new Date(deadline).getTime();
    const now = Date.now();

    const totalDuration = deadlineDate - createdAtDate;
    const elapsed = now - createdAtDate;

    return totalDuration > 0 ? Math.min((elapsed / totalDuration) * 100, 100) : 100;
}

function deadlineOverdue(deadline?: string): boolean {
    if (!deadline) return false;
    return dayjs(deadline).isBefore(dayjs(), 'day');
}

const disputeFormConf = {
    reason: {
        label: 'disputeReason',
        required: true,
        type: 'text',
        size: 12,
        multiline: true,
        maxRows: 4
    }
};

const rejectFormConf = {
    reason: {
        label: 'rejectionReason',
        required: true,
        type: 'text',
        size: 12,
        multiline: true,
        maxRows: 4
    }
};

const acceptFormConf = {
    deadlineDate: {
        label: 'deadlineDate',
        required: true,
        type: 'date',
        size: 12,
        min: new Date(),
    }
};

const OrderCard = (props: OrderDto) => {
    const [openOrderDialog, setOpenOrderDialog] = useState<boolean>(false);
    const [openDisputeDialog, setOpenDisputeDialog] = useState(false);
    const [openRejectDialog, setOpenRejectDialog] = useState(false);
    const [openAcceptDialog, setOpenAcceptDialog] = useState(false);
    const {data: user} = useGetCurrentUserQuery();
    const [acceptOrder] = useAcceptOrderMutation();
    const [rejectOrder] = useCancelOrderMutation();
    const [approveOrder] = useApproveOrderMutation();
    const [disputeOrder] = useDisputeOrderMutation();
    const [submitOrderForReview] = useSubmitOrderForReviewMutation();
    const {t} = useTranslation();

    return (
        <>
            <Card>
                <CardHeader title={
                    <Stack direction='row' spacing={1} sx={{alignItems: 'center'}}>
                        <Typography>#{props.id}</Typography>
                        <Chip color={getOrderStatusChipColor(props.status)} size="small" variant='filled'
                              label={t(`enum.orderStatus.${props.status}`)}/>
                    </Stack>
                }/>
                <CardActionArea onClick={() => setOpenOrderDialog(true)}>
                    <CardContent>
                        <Stack spacing={3}>
                            <Typography variant='h6'>{props.service.title}</Typography>
                            <Box>
                                <Box sx={{display: 'flex', justifyContent: 'space-between'}}>
                                    <Typography variant='body2'>{parseOffsetDateTime(props.createdAt)}</Typography>
                                    <Typography variant='body2'>{parseOffsetDateTime(props.deadlineDate)}</Typography>
                                </Box>
                                <LinearProgress variant='determinate'
                                                value={calculateProgress(props.createdAt, props.deadlineDate, props.status)}/>
                            </Box>
                            {user?.activeRole === RoleType.RoleClient
                                ? <UserCard variant='box' {...props.service.freelancer} />
                                : <UserCard variant='box' {...props.client}/>}
                        </Stack>
                    </CardContent>
                </CardActionArea>
            </Card>
            <Dialog open={openOrderDialog} onClose={() => setOpenOrderDialog(false)} fullWidth maxWidth='sm'>
                <DialogContent>
                    <Grid container spacing={2}>
                        <Grid size={12}>
                            <Typography variant='h6' component='h2'>#{props.id}</Typography>
                            <Typography variant='h4' component='h1'>{t('order.title')}</Typography>
                        </Grid>
                        <Grid size={12}>
                            <Divider/>
                        </Grid>
                        <Grid container size={12} spacing={1}>
                            <Grid size={{xs: 6, sm: 3}}>
                                <Typography variant='body2'>{t('order.createdAt')}</Typography>
                                <Typography variant='body1'>{parseOffsetDateTime(props.createdAt)}</Typography>
                            </Grid>
                            <Grid size={{xs: 6, sm: 3}}>
                                <Typography variant='body2'>{t('order.deadline')}</Typography>
                                <Typography variant='body1'>{parseOffsetDateTime(props.deadlineDate)}</Typography>
                            </Grid>
                            <Grid size={{xs: 6, sm: 3}}>
                                <Typography variant='body2'>{t('order.payment')}</Typography>
                                <Chip color={getTransactionStatusChipColor(props.transaction.status)} variant='filled'
                                      label={t(`enum.transactionStatus.${props.transaction.status}`)}/>
                            </Grid>
                            <Grid size={{xs: 6, sm: 3}}>
                                <Typography variant='body2'>{t('order.status')}</Typography>
                                <Chip color={getOrderStatusChipColor(props.status)} variant='filled'
                                      label={t(`enum.orderStatus.${props.status}`)}/>
                            </Grid>
                        </Grid>
                        <Grid size={12}>
                            <Divider/>
                        </Grid>
                        <Grid container size={12} spacing={1}>
                            <Grid size={{xs: 12}}>
                                <Typography variant="h6">
                                    {user?.activeRole === RoleType.RoleClient
                                        ? t('enum.accountType.FREELANCER')
                                        : t('enum.accountType.CLIENT')}
                                </Typography>
                            </Grid>

                            <Grid size={4}>
                                <Typography>{t('user.fullName')}:</Typography>
                            </Grid>
                            <Grid size={8}>
                                <Typography>
                                    {user?.activeRole === RoleType.RoleClient
                                        ? `${props.service.freelancer.firstName} ${props.service.freelancer.lastName}`
                                        : `${props.client.firstName} ${props.client.lastName}`}
                                </Typography>
                            </Grid>

                            <Grid size={4}>
                                <Typography>{t('user.email')}:</Typography>
                            </Grid>
                            <Grid size={8}>
                                <Typography>
                                    {user?.activeRole === RoleType.RoleClient
                                        ? props.service.freelancer.email
                                        : props.client.email}
                                </Typography>
                            </Grid>

                            <Grid size={4}>
                                <Typography>{t('user.phoneNumber')}:</Typography>
                            </Grid>
                            <Grid size={8}>
                                <Typography>
                                    {user?.activeRole === RoleType.RoleClient
                                        ? props.service.freelancer.phoneNumber
                                        : props.client.phoneNumber}
                                </Typography>
                            </Grid>
                        </Grid>
                        <Grid size={12}>
                            <Divider/>
                        </Grid>
                        <Grid container size={12} spacing={1}>
                            <Grid size={12}>
                                <Typography variant='h6'>{t('order.additionalNotes')}</Typography>
                            </Grid>
                            <Grid size={12}>
                                <Typography>{props.additionalNotes}</Typography>
                            </Grid>
                        </Grid>
                        <Grid size={12}>
                            <Divider/>
                        </Grid>
                        {props.rejectionReason &&
                            <>
                                <Grid container size={12} spacing={1}>
                                    <Grid size={12}>
                                        <Typography variant='h6'>{t('order.rejectionReason')}</Typography>
                                    </Grid>
                                    <Grid size={12}>
                                        <Typography>{props.rejectionReason}</Typography>
                                    </Grid>
                                </Grid>
                                <Grid size={12}>
                                    <Divider/>
                                </Grid>
                            </>
                        }
                        <Grid container size={12} spacing={1}>
                            <Grid size={{xs: 12}}>
                                <Typography variant='h6'>{t('order.timeline')}</Typography>
                            </Grid>
                            <Grid size={{xs: 12}}>
                                <EventsTimeline events={props.events}/>
                            </Grid>
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    {user?.activeRole === RoleType.RoleClient && (
                        <>
                            {(props.status === 'SUBMITTED_FOR_REVIEW' || deadlineOverdue(props.deadlineDate)) &&
                                <Button
                                    color="warning"
                                    variant="contained"
                                    onClick={() => setOpenDisputeDialog(true)}
                                >
                                    {t('buttons.dispute')}
                                </Button>
                            }

                            {props.status === 'SUBMITTED_FOR_REVIEW' && (
                                <Button color="success" variant="contained"
                                        onClick={() => approveOrder({orderId: props.id})
                                            .then(() => enqueueSnackbar(t('order.approve.success'), {variant: 'success'}))}>
                                    {t('buttons.approve')}
                                </Button>
                            )}
                        </>
                    )}

                    {user?.activeRole === RoleType.RoleFreelancer && (
                        <>
                            {props.status === 'CREATED' &&
                                <>
                                    <Button
                                        color="error"
                                        variant="contained"
                                        onClick={() => setOpenRejectDialog(true)}
                                    >
                                        {t('buttons.reject')}
                                    </Button>
                                    <Button
                                        color="success"
                                        variant="contained"
                                        onClick={() => setOpenAcceptDialog(true)}
                                    >
                                        {t('buttons.accept')}
                                    </Button>
                                </>
                            }

                            {props.status === 'IN_PROGRESS' &&
                                <Button color="success" variant="contained"
                                        onClick={() => {
                                            submitOrderForReview({orderId: props.id}).unwrap()
                                                .then(() => enqueueSnackbar(t('order.submitForReview.success'), {variant: 'success'}))
                                        }}>
                                    {t('buttons.submitForReview')}
                                </Button>
                            }
                        </>
                    )}

                    {user?.activeRole === RoleType.RoleAdmin && (
                        <>
                            <Button color="error" variant="contained">{t('buttons.reject')}</Button>
                            <Button color="warning" variant="contained">{t('buttons.dispute')}</Button>
                            <Button color="success" variant="contained">{t('buttons.accept')}</Button>
                            <Button color="success" variant="contained">{t('buttons.approve')}</Button>
                            <Button color="success" variant="contained">{t('buttons.complete')}</Button>
                        </>
                    )}
                </DialogActions>
            </Dialog>
            <Dialog open={openDisputeDialog} fullWidth maxWidth='xs' onClose={() => setOpenDisputeDialog(false)}>
                <Formik
                    initialValues={generateInitialValuesFromConfig(disputeFormConf)}
                    validationSchema={generateValidationSchema(disputeFormConf)}
                    onSubmit={(values: {reason: string}, formikHelpers) => {
                        disputeOrder({orderId: props.id, body: values.reason}).unwrap()
                            .then(() => enqueueSnackbar(t('order.dispute.success'), {variant: 'success'}))
                            .finally(() => {
                                formikHelpers.setSubmitting(false);
                                setOpenDisputeDialog(false);
                            });
                    }}
                >
                    <Form>
                        <DialogTitle>{t('order.dispute.title')}</DialogTitle>
                        <DialogContent sx={theme => ({pt: `${theme.spacing(1)}!important`})}>
                            {Object.entries(disputeFormConf).map(([fieldName, fieldConfig]) => (
                                <FieldRenderer key={fieldName} fieldName={fieldName} fieldConfig={fieldConfig}/>
                            ))}
                        </DialogContent>
                        <DialogActions sx={{justifyContent: 'space-between'}}>
                            <Button onClick={() => setOpenDisputeDialog(false)} color='error'
                                    variant='contained'>{t('buttons.cancel')}</Button>
                            <Button type='submit' color='success' variant='contained'>{t('buttons.submit')}</Button>
                        </DialogActions>
                    </Form>
                </Formik>
            </Dialog>
            <Dialog open={openRejectDialog} fullWidth maxWidth='xs' onClose={() => setOpenRejectDialog(false)}>
                <Formik
                    initialValues={generateInitialValuesFromConfig(rejectFormConf)}
                    validationSchema={generateValidationSchema(rejectFormConf)}
                    onSubmit={(values: {reason: string}, formikHelpers) => {
                        rejectOrder({orderId: props.id, body: values.reason}).unwrap()
                            .then(() => enqueueSnackbar(t('order.reject.success'), {variant: 'success'}))
                            .finally(() => {
                                formikHelpers.setSubmitting(false);
                                setOpenRejectDialog(false);
                            });
                    }}
                >
                    <Form>
                        <DialogTitle>{t('order.reject.title')}</DialogTitle>
                        <DialogContent sx={theme => ({pt: `${theme.spacing(1)}!important`})}>
                            {Object.entries(rejectFormConf).map(([fieldName, fieldConfig]) => (
                                <FieldRenderer key={fieldName} fieldName={fieldName} fieldConfig={fieldConfig}/>
                            ))}
                        </DialogContent>
                        <DialogActions sx={{justifyContent: 'space-between'}}>
                            <Button onClick={() => setOpenRejectDialog(false)} color='error'
                                    variant='contained'>{t('buttons.cancel')}</Button>
                            <Button type='submit' color='success' variant='contained'>{t('buttons.submit')}</Button>
                        </DialogActions>
                    </Form>
                </Formik>
            </Dialog>
            <Dialog open={openAcceptDialog} fullWidth maxWidth='xs' onClose={() => setOpenAcceptDialog(false)}>
                <Formik
                    initialValues={generateInitialValuesFromConfig(acceptFormConf)}
                    validationSchema={generateValidationSchema(acceptFormConf)}
                    onSubmit={(values: {deadlineDate: Dayjs}, formikHelpers) => {
                        acceptOrder({orderId: props.id, deadlineDate: values.deadlineDate.format("YYYY-MM-DD")}).unwrap()
                            .then(() => enqueueSnackbar(t('order.accept.success'), {variant: 'success'}))
                            .finally(() => {
                                formikHelpers.setSubmitting(false);
                                setOpenAcceptDialog(false);
                            });
                    }}
                >
                    <Form>
                        <DialogTitle>{t('order.accept.title')}</DialogTitle>
                        <DialogContent sx={theme => ({pt: `${theme.spacing(1)}!important`})}>
                            {Object.entries(acceptFormConf).map(([fieldName, fieldConfig]) => (
                                <FieldRenderer key={fieldName} fieldName={fieldName} fieldConfig={fieldConfig}/>
                            ))}
                        </DialogContent>
                        <DialogActions sx={{justifyContent: 'space-between'}}>
                            <Button onClick={() => setOpenAcceptDialog(false)} color='error' variant='contained'>{t('buttons.cancel')}</Button>
                            <Button type='submit' color='success' variant='contained'>{t('buttons.submit')}</Button>
                        </DialogActions>
                    </Form>
                </Formik>
            </Dialog>
        </>
    );
}

function getDisputeStatusChipColor(status: DisputeStatus) {
    switch (status) {
        case DisputeStatus.Open:
        case DisputeStatus.InReview:
            return 'warning'
        case DisputeStatus.Rejected:
            return 'error'
        case DisputeStatus.ResolvedFreelancerPaid:
        case DisputeStatus.ResolvedRefunded:
            return 'success'
        default:
            return "default";
    }
}

const proposalFormConf = {
    proposal: {
        label: 'proposal',
        required: true,
        type: 'text',
        size: 12,
        multiline: true,
        rows: 4,
    }
};

interface ProposalDialogProps {
    open: boolean;
    onClose: () => void;
    disputeId: number;
}

const ProposalDialog = ({open, onClose, disputeId}: ProposalDialogProps) => {
    const [acceptProposal] = useAcceptProposalMutation();
    const [rejectProposal] = useRejectProposalMutation();
    const [proposeSolution] = useProposeSolutionMutation();
    const {data: dispute, isLoading} = useGetDisputeQuery({disputeId: disputeId});
    const [openRejectDialog, setOpenRejectDialog] = useState(false);
    const {data: user} = useGetCurrentUserQuery();
    const {t} = useTranslation();
    const navigate = useNavigate();

    if (isLoading) {
        return <GlobalLoadingBackdrop />
    }

    if (!dispute) {
        navigate('/404');
        return;
    }

    const showFreelancerProposalForm =
        user?.activeRole === RoleType.RoleFreelancer &&
        dispute?.status === 'OPEN' &&
        (dispute.proposalStatus === 'NONE' || dispute.proposalStatus === 'REJECTED');

    return (
        <>
            <Dialog open={open} fullWidth maxWidth='sm' onClose={onClose}>
                <DialogTitle>
                    <Stack direction='row' spacing={1}>
                        <Typography variant='h6'>{t('dispute.title')}</Typography>
                        <Chip
                            color={getDisputeStatusChipColor(dispute.status)}
                            variant='filled'
                            label={t(`enum.disputeStatus.${dispute.status}`)}
                        />
                    </Stack>
                </DialogTitle>

                <Formik
                    enableReinitialize
                    initialValues={generateInitialValuesFromConfig(proposalFormConf)}
                    validationSchema={generateValidationSchema(proposalFormConf)}
                    onSubmit={(values, formikHelpers) => {
                        proposeSolution({ disputeId: dispute.id, body: values.proposal }).unwrap()
                            .then(() => enqueueSnackbar(t('dispute.proposal.submitted'), { variant: 'success' }))
                            .finally(() => formikHelpers.setSubmitting(false));
                    }}
                >
                    {({ isSubmitting }) => (
                        <Form>
                            <DialogContent>
                                <Grid container spacing={2}>
                                    <Grid size={12}>
                                        <Typography variant="h6">{t('dispute.reason')}</Typography>
                                        <Typography variant="body1" gutterBottom>{dispute.reason}</Typography>
                                    </Grid>

                                    <Grid size={12}><Divider /></Grid>

                                    {showFreelancerProposalForm ? (
                                        <Grid size={12}>
                                            {Object.entries(proposalFormConf).map(([fieldName, fieldConfig]) => (
                                                <FieldRenderer
                                                    key={fieldName}
                                                    fieldName={fieldName}
                                                    fieldConfig={fieldConfig}
                                                />
                                            ))}
                                        </Grid>
                                    ) : (
                                        <>
                                            <Grid size={12}>
                                                <Typography variant="h6">{t('dispute.proposal.title')}</Typography>
                                                <Typography variant="body1" gutterBottom>{dispute.proposal}</Typography>
                                            </Grid>

                                            {dispute.proposalRejectionReason && (
                                                <>
                                                    <Grid size={12}><Divider /></Grid>
                                                    <Grid size={12}>
                                                        <Typography variant="h6">{t('dispute.reject.title')}</Typography>
                                                        <Typography variant="body1" gutterBottom>{dispute.proposalRejectionReason}</Typography>
                                                    </Grid>
                                                </>
                                            )}
                                        </>
                                    )}
                                </Grid>
                            </DialogContent>

                            {/* Action Buttons */}
                                <DialogActions>
                                    {showFreelancerProposalForm && (
                                        <>
                                            <Button onClick={onClose} color="error" variant="contained">
                                                {t('buttons.cancel')}
                                            </Button>
                                            <Button type="submit" color="success" variant="contained" loading={isSubmitting}>
                                                {t('buttons.submit')}
                                            </Button>
                                        </>
                                    )}
                                    {user?.activeRole === RoleType.RoleClient && dispute.status === 'IN_REVIEW' && (
                                        <>
                                            <Button
                                                color="error"
                                                variant="contained"
                                                onClick={() => setOpenRejectDialog(true)}
                                            >
                                                {t('buttons.reject')}
                                            </Button>
                                            <Button
                                                color="success"
                                                variant="contained"
                                                onClick={() =>
                                                    acceptProposal({ disputeId: dispute.id }).unwrap()
                                                        .then(() => enqueueSnackbar(t('dispute.accept.success'), { variant: 'success' }))
                                                }
                                            >
                                                {t('buttons.accept')}
                                            </Button>
                                        </>
                                    )}
                                </DialogActions>
                        </Form>
                    )}
                </Formik>
            </Dialog>
            {/*TODO: Make one reusable for such types of dialogs*/}
            <Dialog open={openRejectDialog} fullWidth maxWidth='xs' onClose={() => setOpenRejectDialog(false)}>
                <Formik
                    initialValues={generateInitialValuesFromConfig(rejectFormConf)}
                    validationSchema={generateValidationSchema(rejectFormConf)}
                    onSubmit={(values: { reason: string }, formikHelpers) => {
                        rejectProposal({disputeId: dispute.id, body: values.reason}).unwrap()
                            .then(() => enqueueSnackbar(t('dispute.reject.success'), {variant: 'success'}))
                            .finally(() => {
                                formikHelpers.setSubmitting(false);
                                setOpenRejectDialog(false);
                            });
                    }}
                >
                    <Form>
                        <DialogTitle>{t('order.reject.title')}</DialogTitle>
                        <DialogContent sx={theme => ({pt: `${theme.spacing(1)}!important`})}>
                            {Object.entries(rejectFormConf).map(([fieldName, fieldConfig]) => (
                                <FieldRenderer key={fieldName} fieldName={fieldName} fieldConfig={fieldConfig}/>
                            ))}
                        </DialogContent>
                        <DialogActions sx={{justifyContent: 'space-between'}}>
                            <Button onClick={() => setOpenRejectDialog(false)} color='error'
                                    variant='contained'>{t('buttons.cancel')}</Button>
                            <Button type='submit' color='success' variant='contained'>{t('buttons.submit')}</Button>
                        </DialogActions>
                    </Form>
                </Formik>
            </Dialog>
        </>
    );
}

const OrdersTab = () => {
    const [page, setPage] = useState(0);
    const {data} = useGetOrdersQuery({page: page, size: 12, sort: ['id','desc']});

    return (
        <>
            <Grid
                container
                spacing={2}
                columns={12}
                sx={{mb: (theme) => theme.spacing(2)}}
            >
                {data?.content.map((order, index) => (
                    <Grid key={index} size={{xs: 12, sm: 6, lg: 3}}>
                        <OrderCard {...order} />
                    </Grid>
                ))}
            </Grid>

            <Pagination
                count={data?.totalPages || 0}
                page={page + 1}
                onChange={(event, value) => setPage(value - 1)}
            />
        </>
    );
}

export default OrdersTab;