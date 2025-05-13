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
    Stack,
} from "@mui/material"
import {
    DisputeStatus,
    EventDto,
    OrderDto,
    OrderStatus,
    ProfileType,
    TransactionStatus,
    useAcceptOrderMutation,
    useAcceptProposalMutation,
    useApproveOrderMutation,
    useCancelOrderMutation,
    useDisputeOrderMutation,
    useForceRefundMutation,
    useForceReleaseMutation,
    useGetCurrentUserQuery,
    useGetDisputeQuery,
    useGetOrdersQuery,
    useNotifyAdminMutation,
    usePostClientReviewMutation,
    usePostServiceReviewMutation,
    useProposeSolutionMutation,
    useRejectProposalMutation,
    useSubmitOrderForReviewMutation,
} from "../../../features/api/pcxApi.ts"
import Typography from "@mui/material/Typography"
import Card from "@mui/material/Card"
import Chip from "@mui/material/Chip"
import {useTranslation} from "react-i18next"
import CardContent from "@mui/material/CardContent"
import {parseOffsetDateTime, parseOffsetDateTimeToString,} from "../../../utils/dateParser.ts"
import UserCard from "../UserCard.tsx"
import React, {useState} from "react"
import Timeline from "@mui/lab/Timeline"
import TimelineItem from "@mui/lab/TimelineItem"
import TimelineOppositeContent from "@mui/lab/TimelineOppositeContent"
import TimelineSeparator from "@mui/lab/TimelineSeparator"
import TimelineDot from "@mui/lab/TimelineDot"
import TimelineConnector from "@mui/lab/TimelineConnector"
import TimelineContent from "@mui/lab/TimelineContent"
import {Form, Formik} from "formik"
import {generateInitialValuesFromConfig, generateValidationSchema,} from "../formUtils.ts"
import {FieldRenderer} from "../FieldRenderer.tsx"
import {enqueueSnackbar} from "notistack"
import dayjs, {Dayjs} from "dayjs"
import FileCard from "../FileCard.tsx"
import ReviewCard from "../ReviewCard.tsx";

interface EventsTimelineProps {
    events: EventDto[]
}

const EventsTimeline = ({events}: EventsTimelineProps) => {
    const {t} = useTranslation()
    const [openProposalDialog, setOpenProposalDialog] = useState(false)
    const [disputeId, setDisputeId] = useState<number>()

    return (
        <>
            <Timeline position="left">
                {events.map((event, index) => (
                    <TimelineItem key={index}>
                        <TimelineOppositeContent color="text.secondary">
                            {parseOffsetDateTimeToString(event.createdAt)}
                        </TimelineOppositeContent>
                        <TimelineSeparator>
                            <TimelineDot/>
                            {index !== events.length - 1 && <TimelineConnector/>}
                        </TimelineSeparator>
                        {event.type === "ORDER_DISPUTED" && event.disputeId ? (
                            <TimelineContent
                                sx={{textDecoration: "underline", cursor: "pointer"}}
                                onClick={() => {
                                    setDisputeId(event.disputeId)
                                    setOpenProposalDialog(true)
                                }}
                            >
                                {t(`enum.eventType.${event.type}`)}
                            </TimelineContent>
                        ) : (
                            <TimelineContent>
                                {t(`enum.eventType.${event.type}`)}
                            </TimelineContent>
                        )}
                    </TimelineItem>
                ))}
            </Timeline>
            {disputeId && (
                <ProposalDialog
                    open={openProposalDialog}
                    onClose={() => setOpenProposalDialog(false)}
                    disputeId={disputeId}
                />
            )}
        </>
    )
}

export function getOrderStatusChipColor(status: OrderStatus) {
    switch (status) {
        case OrderStatus.Approved:
        case OrderStatus.Completed:
            return "success"
        case OrderStatus.Canceled:
        case OrderStatus.Disputed:
            return "error"
        case OrderStatus.InProgress:
        case OrderStatus.SubmittedForReview:
            return "warning"
        default:
            return "default"
    }
}

export function getTransactionStatusChipColor(status: TransactionStatus) {
    switch (status) {
        case TransactionStatus.Released:
        case TransactionStatus.Refunded:
            return "success"
        case TransactionStatus.Canceled:
            return "error"
        case TransactionStatus.Escrowed:
            return "warning"
        default:
            return "default"
    }
}

export function calculateProgress(
    createdAt: string,
    status: OrderStatus,
    deadline?: string,
) {
    if (status === OrderStatus.Completed || status === OrderStatus.Canceled) {
        return 100
    }
    if (!deadline) {
        return 0
    }
    const createdAtDate = new Date(createdAt).getTime()
    const deadlineDate = new Date(deadline).getTime()
    const now = Date.now()

    const totalDuration = deadlineDate - createdAtDate
    const elapsed = now - createdAtDate

    return totalDuration > 0
        ? Math.min((elapsed / totalDuration) * 100, 100)
        : 100
}

const disputeFormConf = {
    reason: {
        label: "disputeReason",
        required: true,
        type: "text",
        size: 12,
        multiline: true,
        maxRows: 4,
    },
}

const rejectFormConf = {
    reason: {
        label: "rejectionReason",
        required: true,
        type: "text",
        size: 12,
        multiline: true,
        maxRows: 4,
    },
}

const acceptFormConf = {
    deadlineDate: {
        label: "deadlineDate",
        required: true,
        type: "date",
        size: 12,
        min: new Date(),
    },
}

const serviceReviewFormConf = {
    rating: {
        label: "rating",
        required: true,
        type: "rating",
        size: 12,
        min: 0,
        max: 5,
    },
    review: {
        label: "review",
        required: false,
        type: "text",
        size: 12,
        multiline: true,
        rows: 4,
    },
}

const clientReviewFormConf = {
    rating: {
        label: "rating",
        required: true,
        type: "rating",
        size: 12,
        min: 0,
        max: 5,
    },
    review: {
        label: "review",
        required: false,
        type: "text",
        size: 12,
        multiline: true,
        rows: 4,
    },
}

const OrderCard = (order: OrderDto) => {
    const [openOrderDialog, setOpenOrderDialog] = useState<boolean>(false)
    const [openReviewDialog, setOpenReviewDialog] = useState(false)
    const [openDisputeDialog, setOpenDisputeDialog] = useState(false)
    const [openRejectDialog, setOpenRejectDialog] = useState(false)
    const [openAcceptDialog, setOpenAcceptDialog] = useState(false)
    const {data: user} = useGetCurrentUserQuery()
    const [acceptOrder] = useAcceptOrderMutation()
    const [rejectOrder] = useCancelOrderMutation()
    const [approveOrder, {isLoading: approveLoading}] =
        useApproveOrderMutation()
    const [disputeOrder] = useDisputeOrderMutation()
    const [submitOrderForReview, {isLoading: submitReviewLoading}] =
        useSubmitOrderForReviewMutation()
    const {t} = useTranslation()

    const deadlineOverdue = dayjs(order.deadlineDate).isBefore(dayjs(), "day")
    const canLeaveReview =
        ((user?.activeProfile.profileType === ProfileType.Freelancer &&
                !order.reviews?.some(
                    ({reviewer}) => reviewer.profileType === ProfileType.Freelancer,
                )) ||
            (user?.activeProfile.profileType === ProfileType.Client &&
                !order.reviews?.some(
                    ({reviewer}) => reviewer.profileType === ProfileType.Client,
                ))) &&
        order.status === OrderStatus.Completed &&
        parseOffsetDateTime(order.updatedAt)?.isAfter(dayjs().subtract(7, "day"))

    return (
        <>
            <Card>
                <CardHeader
                    title={
                        <Stack direction="row" spacing={1} sx={{alignItems: "center"}}>
                            <Typography>#{order.id}</Typography>
                            <Chip
                                color={getOrderStatusChipColor(order.status)}
                                size="small"
                                variant="filled"
                                label={t(`enum.orderStatus.${order.status}`)}
                            />
                        </Stack>
                    }
                />
                <CardActionArea onClick={() => setOpenOrderDialog(true)}>
                    <CardContent>
                        <Stack spacing={3}>
                            <Typography variant="h6">{order.service.title}</Typography>
                            <Box>
                                <Box sx={{display: "flex", justifyContent: "space-between"}}>
                                    <Typography variant="body2">
                                        {parseOffsetDateTimeToString(order.createdAt)}
                                    </Typography>
                                    <Typography variant="body2">
                                        {parseOffsetDateTimeToString(order.deadlineDate)}
                                    </Typography>
                                </Box>
                                <LinearProgress
                                    variant="determinate"
                                    value={calculateProgress(
                                        order.createdAt,
                                        order.status,
                                        order.deadlineDate,
                                    )}
                                />
                            </Box>
                            {user?.activeProfile.profileType === ProfileType.Client ? (
                                <UserCard variant="box" {...order.service.freelancer} />
                            ) : (
                                <UserCard variant="box" {...order.client} />
                            )}
                        </Stack>
                    </CardContent>
                </CardActionArea>
            </Card>
            <Dialog
                open={openOrderDialog}
                onClose={() => setOpenOrderDialog(false)}
                fullWidth
                maxWidth="sm"
            >
                <DialogContent>
                    <Grid container spacing={2}>
                        <Grid size={12}>
                            <Typography variant="h6" component="h2">
                                #{order.id}
                            </Typography>
                            <Typography variant="h4" component="h1">
                                {t("order.title")}
                            </Typography>
                        </Grid>
                        <Grid size={12}>
                            <Divider/>
                        </Grid>
                        <Grid container size={12} spacing={1}>
                            <Grid size={{xs: 6, sm: 3}}>
                                <Typography variant="body2">{t("order.createdAt")}</Typography>
                                <Typography variant="body1">
                                    {parseOffsetDateTimeToString(order.createdAt)}
                                </Typography>
                            </Grid>
                            <Grid size={{xs: 6, sm: 3}}>
                                <Typography variant="body2">{t("order.deadline")}</Typography>
                                <Typography variant="body1">
                                    {parseOffsetDateTimeToString(order.deadlineDate)}
                                </Typography>
                            </Grid>
                            <Grid size={{xs: 6, sm: 3}}>
                                <Typography variant="body2">{t("order.payment")}</Typography>
                                <Chip
                                    color={getTransactionStatusChipColor(
                                        order.transaction.status,
                                    )}
                                    variant="filled"
                                    label={t(
                                        `enum.transactionStatus.${order.transaction.status}`,
                                    )}
                                />
                            </Grid>
                            <Grid size={{xs: 6, sm: 3}}>
                                <Typography variant="body2">{t("order.status")}</Typography>
                                <Chip
                                    color={getOrderStatusChipColor(order.status)}
                                    variant="filled"
                                    label={t(`enum.orderStatus.${order.status}`)}
                                />
                            </Grid>
                        </Grid>
                        <Grid size={12}>
                            <Divider/>
                        </Grid>
                        <Grid container size={12} spacing={1}>
                            <Grid size={{xs: 12}}>
                                <Typography variant="h6">
                                    {user?.activeProfile.profileType === ProfileType.Client
                                        ? t("enum.profileType.FREELANCER")
                                        : t("enum.profileType.CLIENT")}
                                </Typography>
                            </Grid>

                            <Grid size={4}>
                                <Typography>{t("user.fullName")}:</Typography>
                            </Grid>
                            <Grid size={8}>
                                <Typography>
                                    {user?.activeProfile.profileType === ProfileType.Client
                                        ? `${order.service.freelancer.firstName} ${order.service.freelancer.lastName}`
                                        : `${order.client.firstName} ${order.client.lastName}`}
                                </Typography>
                            </Grid>

                            <Grid size={4}>
                                <Typography>{t("user.email")}:</Typography>
                            </Grid>
                            <Grid size={8}>
                                <Typography>
                                    {user?.activeProfile.profileType === ProfileType.Client
                                        ? order.service.freelancer.email
                                        : order.client.email}
                                </Typography>
                            </Grid>

                            <Grid size={4}>
                                <Typography>{t("user.phoneNumber")}:</Typography>
                            </Grid>
                            <Grid size={8}>
                                <Typography>
                                    {user?.activeProfile.profileType === ProfileType.Client
                                        ? order.service.freelancer.phoneNumber
                                        : order.client.phoneNumber}
                                </Typography>
                            </Grid>
                        </Grid>
                        <Grid size={12}>
                            <Divider/>
                        </Grid>
                        <Grid container size={12} spacing={1} alignItems='center'>
                            <Grid size={12}>
                                <Typography variant='h6'>{t('order.serviceDetails')}</Typography>
                            </Grid>
                            <Grid size={4}>
                                <Typography>{t("order.serviceName")}:</Typography>
                            </Grid>
                            <Grid size={8}>
                                <Typography>{order.service.title}</Typography>
                            </Grid>
                            <Grid size={4}>
                                <Typography>{t("order.servicePrice")}:</Typography>
                            </Grid>
                            <Grid size={8}>
                                <Typography>{order.service.price}</Typography>
                            </Grid>
                            <Grid size={4}>
                                <Typography>{t("order.servicePackage")}:</Typography>
                            </Grid>
                            <Grid size={8}>
                                <Typography>{t('service.package.basic')}</Typography>
                            </Grid>
                        </Grid>
                        <Grid size={12}>
                            <Divider/>
                        </Grid>
                        {order.rejectionReason && (
                            <>
                                <Grid container size={12} spacing={1}>
                                    <Grid size={12}>
                                        <Typography variant="h6">
                                            {t("order.rejectionReason")}
                                        </Typography>
                                    </Grid>
                                    <Grid size={12}>
                                        <Typography>{order.rejectionReason}</Typography>
                                    </Grid>
                                </Grid>
                                <Grid size={12}>
                                    <Divider/>
                                </Grid>
                            </>
                        )}
                        {order.additionalNotes && (
                            <>
                                <Grid container size={12} spacing={1}>
                                    <Grid size={12}>
                                        <Typography variant="h6">
                                            {t("order.additionalNotes")}
                                        </Typography>
                                    </Grid>
                                    <Grid size={12}>
                                        <Typography>{order.additionalNotes}</Typography>
                                    </Grid>
                                </Grid>
                                <Grid size={12}>
                                    <Divider/>
                                </Grid>
                            </>
                        )}
                        {order.files?.length > 0 && (
                            <>
                                <Grid container size={12} spacing={1}>
                                    <Grid size={12}>
                                        <Typography variant="h6">
                                            {t("order.additionalFiles")}
                                        </Typography>
                                    </Grid>
                                    <Grid container size={12} spacing={1}>
                                        {order.files.map((file, index) => (
                                            <Grid key={index} size={12}>
                                                <FileCard file={file}/>
                                            </Grid>
                                        ))}
                                    </Grid>
                                </Grid>
                                <Grid size={12}>
                                    <Divider/>
                                </Grid>
                            </>
                        )}
                        {order.reviews.length > 0 && (
                            <Grid container size={12} spacing={1}>
                                <Grid size={{xs: 12}}>
                                    <Typography variant="h6">{t("order.reviews")}</Typography>
                                </Grid>
                                <Grid container size={{xs: 12}} spacing={2}>
                                    {order.reviews.map((review, index) => (
                                        <Grid key={index} size={12}>
                                            <ReviewCard {...review} />
                                        </Grid>
                                    ))}
                                </Grid>
                                <Grid size={12}>
                                    <Divider/>
                                </Grid>
                            </Grid>
                        )}
                        <Grid container size={12} spacing={1}>
                            <Grid size={{xs: 12}}>
                                <Typography variant="h6">{t("order.timeline")}</Typography>
                            </Grid>
                            <Grid size={{xs: 12}}>
                                <EventsTimeline events={order.events}/>
                            </Grid>
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    {user?.activeProfile.profileType === ProfileType.Client && (
                        <>
                            {(order.status === "SUBMITTED_FOR_REVIEW" || deadlineOverdue) && (
                                <Button
                                    color="warning"
                                    variant="contained"
                                    onClick={() => setOpenDisputeDialog(true)}
                                >
                                    {t("buttons.dispute")}
                                </Button>
                            )}

                            {order.status === "SUBMITTED_FOR_REVIEW" && (
                                <Button
                                    loading={approveLoading}
                                    color="success"
                                    variant="contained"
                                    onClick={() =>
                                        approveOrder({orderId: order.id}).then(() =>
                                            enqueueSnackbar(t("order.approve.success"), {
                                                variant: "success",
                                            }),
                                        )
                                    }
                                >
                                    {t("buttons.approve")}
                                </Button>
                            )}
                        </>
                    )}

                    {user?.activeProfile.profileType === ProfileType.Freelancer && (
                        <>
                            {order.status === "CREATED" && (
                                <>
                                    <Button
                                        color="error"
                                        variant="contained"
                                        onClick={() => setOpenRejectDialog(true)}
                                    >
                                        {t("buttons.reject")}
                                    </Button>
                                    <Button
                                        color="success"
                                        variant="contained"
                                        onClick={() => setOpenAcceptDialog(true)}
                                    >
                                        {t("buttons.accept")}
                                    </Button>
                                </>
                            )}

                            {order.status === "IN_PROGRESS" && (
                                <Button
                                    loading={submitReviewLoading}
                                    color="success"
                                    variant="contained"
                                    onClick={() => {
                                        submitOrderForReview({orderId: order.id})
                                            .unwrap()
                                            .then(() =>
                                                enqueueSnackbar(t("order.submitForReview.success"), {
                                                    variant: "success",
                                                }),
                                            )
                                    }}
                                >
                                    {t("buttons.submitForReview")}
                                </Button>
                            )}
                        </>
                    )}

                    {canLeaveReview && (
                        <Button
                            color="success"
                            variant="contained"
                            onClick={() => setOpenReviewDialog(true)}
                        >
                            {t("buttons.leaveReview")}
                        </Button>
                    )}

                    {user?.activeProfile.profileType === ProfileType.Admin && (
                        <>
                            <Button color="error" variant="contained">
                                {t("buttons.reject")}
                            </Button>
                            <Button color="warning" variant="contained">
                                {t("buttons.dispute")}
                            </Button>
                            <Button color="success" variant="contained">
                                {t("buttons.accept")}
                            </Button>
                            <Button color="success" variant="contained">
                                {t("buttons.approve")}
                            </Button>
                            <Button color="success" variant="contained">
                                {t("buttons.complete")}
                            </Button>
                        </>
                    )}
                </DialogActions>
            </Dialog>
            <Dialog
                open={openDisputeDialog}
                fullWidth
                maxWidth="xs"
                onClose={() => setOpenDisputeDialog(false)}
            >
                <Formik
                    initialValues={generateInitialValuesFromConfig(disputeFormConf)}
                    validationSchema={generateValidationSchema(disputeFormConf)}
                    onSubmit={(values: { reason: string }, formikHelpers) => {
                        disputeOrder({orderId: order.id, body: values.reason})
                            .unwrap()
                            .then(() =>
                                enqueueSnackbar(t("order.dispute.success"), {
                                    variant: "success",
                                }),
                            )
                            .finally(() => {
                                formikHelpers.setSubmitting(false)
                                setOpenDisputeDialog(false)
                            })
                    }}
                >
                    {({isSubmitting}) => (
                        <Form>
                            <DialogTitle>{t("order.dispute.title")}</DialogTitle>
                            <DialogContent
                                sx={theme => ({pt: `${theme.spacing(1)}!important`})}
                            >
                                {Object.entries(disputeFormConf).map(
                                    ([fieldName, fieldConfig]) => (
                                        <FieldRenderer
                                            key={fieldName}
                                            fieldName={fieldName}
                                            fieldConfig={fieldConfig}
                                        />
                                    ),
                                )}
                            </DialogContent>
                            <DialogActions sx={{justifyContent: "space-between"}}>
                                <Button
                                    onClick={() => setOpenDisputeDialog(false)}
                                    color="error"
                                    variant="contained"
                                >
                                    {t("buttons.cancel")}
                                </Button>
                                <Button
                                    loading={isSubmitting}
                                    type="submit"
                                    color="success"
                                    variant="contained"
                                >
                                    {t("buttons.submit")}
                                </Button>
                            </DialogActions>
                        </Form>
                    )}
                </Formik>
            </Dialog>
            <Dialog
                open={openRejectDialog}
                fullWidth
                maxWidth="xs"
                onClose={() => setOpenRejectDialog(false)}
            >
                <Formik
                    initialValues={generateInitialValuesFromConfig(rejectFormConf)}
                    validationSchema={generateValidationSchema(rejectFormConf)}
                    onSubmit={(values: { reason: string }, formikHelpers) => {
                        rejectOrder({orderId: order.id, body: values.reason})
                            .unwrap()
                            .then(() =>
                                enqueueSnackbar(t("order.reject.success"), {
                                    variant: "success",
                                }),
                            )
                            .finally(() => {
                                formikHelpers.setSubmitting(false)
                                setOpenRejectDialog(false)
                            })
                    }}
                >
                    {({isSubmitting}) => (
                        <Form>
                            <DialogTitle>{t("order.reject.title")}</DialogTitle>
                            <DialogContent
                                sx={theme => ({pt: `${theme.spacing(1)}!important`})}
                            >
                                {Object.entries(rejectFormConf).map(
                                    ([fieldName, fieldConfig]) => (
                                        <FieldRenderer
                                            key={fieldName}
                                            fieldName={fieldName}
                                            fieldConfig={fieldConfig}
                                        />
                                    ),
                                )}
                            </DialogContent>
                            <DialogActions sx={{justifyContent: "space-between"}}>
                                <Button
                                    onClick={() => setOpenRejectDialog(false)}
                                    color="error"
                                    variant="contained"
                                >
                                    {t("buttons.cancel")}
                                </Button>
                                <Button
                                    loading={isSubmitting}
                                    type="submit"
                                    color="success"
                                    variant="contained"
                                >
                                    {t("buttons.submit")}
                                </Button>
                            </DialogActions>
                        </Form>
                    )}
                </Formik>
            </Dialog>
            <Dialog
                open={openAcceptDialog}
                fullWidth
                maxWidth="xs"
                onClose={() => setOpenAcceptDialog(false)}
            >
                <Formik
                    initialValues={generateInitialValuesFromConfig(acceptFormConf)}
                    validationSchema={generateValidationSchema(acceptFormConf)}
                    onSubmit={(values: { deadlineDate: Dayjs }, formikHelpers) => {
                        acceptOrder({
                            orderId: order.id,
                            deadlineDate: values.deadlineDate.format("YYYY-MM-DD"),
                        })
                            .unwrap()
                            .then(() =>
                                enqueueSnackbar(t("order.accept.success"), {
                                    variant: "success",
                                }),
                            )
                            .finally(() => {
                                formikHelpers.setSubmitting(false)
                                setOpenAcceptDialog(false)
                            })
                    }}
                >
                    {({isSubmitting}) => (
                        <Form>
                            <DialogTitle>{t("order.accept.title")}</DialogTitle>
                            <DialogContent
                                sx={theme => ({pt: `${theme.spacing(1)}!important`})}
                            >
                                {Object.entries(acceptFormConf).map(
                                    ([fieldName, fieldConfig]) => (
                                        <FieldRenderer
                                            key={fieldName}
                                            fieldName={fieldName}
                                            fieldConfig={fieldConfig}
                                        />
                                    ),
                                )}
                            </DialogContent>
                            <DialogActions sx={{justifyContent: "space-between"}}>
                                <Button
                                    onClick={() => setOpenAcceptDialog(false)}
                                    color="error"
                                    variant="contained"
                                >
                                    {t("buttons.cancel")}
                                </Button>
                                <Button
                                    loading={isSubmitting}
                                    type="submit"
                                    color="success"
                                    variant="contained"
                                >
                                    {t("buttons.submit")}
                                </Button>
                            </DialogActions>
                        </Form>
                    )}
                </Formik>
            </Dialog>
            {user?.activeProfile.profileType === ProfileType.Client &&
                canLeaveReview && (
                    <ServiceReviewDialog
                        open={openReviewDialog}
                        onClose={() => setOpenReviewDialog(false)}
                        orderId={order.id}
                    />
                )}
            {user?.activeProfile.profileType === ProfileType.Freelancer &&
                canLeaveReview && (
                    <ClientReviewDialog
                        open={openReviewDialog}
                        onClose={() => setOpenReviewDialog(false)}
                        orderId={order.id}
                    />
                )}
        </>
    )
}

function getDisputeStatusChipColor(status: DisputeStatus) {
    switch (status) {
        case DisputeStatus.Open:
        case DisputeStatus.InReview:
            return "warning"
        case DisputeStatus.Rejected:
            return "error"
        case DisputeStatus.ResolvedFreelancerPaid:
        case DisputeStatus.ResolvedRefunded:
            return "success"
        default:
            return "default"
    }
}

const proposalFormConf = {
    proposal: {
        label: "proposal",
        required: true,
        type: "text",
        size: 12,
        multiline: true,
        rows: 4,
    },
}

interface ProposalDialogProps {
    open: boolean
    onClose: () => void
    disputeId: number
}

const ProposalDialog = ({open, onClose, disputeId}: ProposalDialogProps) => {
    const [acceptProposal] = useAcceptProposalMutation()
    const [rejectProposal] = useRejectProposalMutation()
    const [proposeSolution] = useProposeSolutionMutation()
    const [notifyAdmin] = useNotifyAdminMutation()
    const [forceRelease] = useForceReleaseMutation()
    const [forceRefund] = useForceRefundMutation()
    const {data: dispute} = useGetDisputeQuery({
        disputeId: disputeId,
    })
    const [openRejectDialog, setOpenRejectDialog] = useState(false)
    const {data: user} = useGetCurrentUserQuery()
    const {t} = useTranslation()

    if (!dispute) {
        return
    }

    const showFreelancerProposalForm =
        user?.activeProfile.profileType === ProfileType.Freelancer &&
        DisputeStatus.Open === dispute.status

    return (
        <>
            <Dialog open={open} fullWidth maxWidth="sm" onClose={onClose}>
                <DialogTitle>
                    <Stack direction="row" spacing={1}>
                        <Typography variant="h6">{t("dispute.title")}</Typography>
                        <Chip
                            color={getDisputeStatusChipColor(dispute.status)}
                            variant="filled"
                            label={t(`enum.disputeStatus.${dispute.status}`)}
                        />
                    </Stack>
                </DialogTitle>

                <Formik
                    enableReinitialize
                    initialValues={generateInitialValuesFromConfig(proposalFormConf)}
                    validationSchema={generateValidationSchema(proposalFormConf)}
                    onSubmit={(values, formikHelpers) => {
                        proposeSolution({disputeId: dispute.id, body: values.proposal})
                            .unwrap()
                            .then(() =>
                                enqueueSnackbar(t("dispute.proposal.submitted"), {
                                    variant: "success",
                                }),
                            )
                            .finally(() => formikHelpers.setSubmitting(false))
                    }}
                >
                    {({isSubmitting}) => (
                        <Form>
                            <DialogContent>
                                <Grid container spacing={2}>
                                    <Grid size={12}>
                                        <Typography variant="h6">{t("dispute.reason")}</Typography>
                                        <Typography variant="body1" gutterBottom>
                                            {dispute.reason}
                                        </Typography>
                                    </Grid>

                                    <Grid size={12}>
                                        <Divider/>
                                    </Grid>

                                    {showFreelancerProposalForm ? (
                                        <Grid size={12}>
                                            {Object.entries(proposalFormConf).map(
                                                ([fieldName, fieldConfig]) => (
                                                    <FieldRenderer
                                                        key={fieldName}
                                                        fieldName={fieldName}
                                                        fieldConfig={fieldConfig}
                                                    />
                                                ),
                                            )}
                                        </Grid>
                                    ) : (
                                        <>
                                            <Grid size={12}>
                                                <Typography variant="h6">
                                                    {t("dispute.proposal.title")}
                                                </Typography>
                                                <Typography variant="body1" gutterBottom>
                                                    {dispute.proposal
                                                        ? dispute.proposal
                                                        : user?.activeProfile.profileType ===
                                                        ProfileType.Client
                                                            ? t("dispute.proposal.clientNone")
                                                            : t("dispute.proposal.freelancerNone")}
                                                </Typography>
                                            </Grid>

                                            {dispute.proposalRejectionReason && (
                                                <>
                                                    <Grid size={12}>
                                                        <Divider/>
                                                    </Grid>
                                                    <Grid size={12}>
                                                        <Typography variant="h6">
                                                            {t("dispute.reject.title")}
                                                        </Typography>
                                                        <Typography variant="body1" gutterBottom>
                                                            {dispute.proposalRejectionReason}
                                                        </Typography>
                                                    </Grid>
                                                </>
                                            )}
                                        </>
                                    )}
                                </Grid>
                            </DialogContent>

                            {/* Action Buttons */}
                            <DialogActions>
                                {[DisputeStatus.Open, DisputeStatus.InReview].includes(
                                    dispute.status,
                                ) && (
                                    <Button
                                        color="warning"
                                        onClick={() =>
                                            notifyAdmin({disputeId: dispute.id}).then(() =>
                                                enqueueSnackbar(t("dispute.notifyAdmin.success"), {
                                                    variant: "success",
                                                }),
                                            )
                                        }
                                    >
                                        {t("buttons.notifyAdministrator")}
                                    </Button>
                                )}
                                {showFreelancerProposalForm && (
                                    <>
                                        <Button onClick={onClose} color="error" variant="contained">
                                            {t("buttons.cancel")}
                                        </Button>
                                        <Button
                                            type="submit"
                                            color="success"
                                            variant="contained"
                                            loading={isSubmitting}
                                        >
                                            {t("buttons.submit")}
                                        </Button>
                                    </>
                                )}
                                {user?.activeProfile.profileType === ProfileType.Client &&
                                    dispute.status === "IN_REVIEW" && (
                                        <>
                                            <Button
                                                color="error"
                                                variant="contained"
                                                onClick={() => setOpenRejectDialog(true)}
                                            >
                                                {t("buttons.reject")}
                                            </Button>
                                            <Button
                                                color="success"
                                                variant="contained"
                                                onClick={() =>
                                                    acceptProposal({disputeId: dispute.id})
                                                        .unwrap()
                                                        .then(() =>
                                                            enqueueSnackbar(t("dispute.accept.success"), {
                                                                variant: "success",
                                                            }),
                                                        )
                                                }
                                            >
                                                {t("buttons.accept")}
                                            </Button>
                                        </>
                                    )}
                                {user?.activeProfile.profileType === ProfileType.Admin &&
                                    dispute.status === DisputeStatus.AdminActionRequired && (
                                        <>
                                            <Button
                                                color="warning"
                                                variant="contained"
                                                onClick={() =>
                                                    forceRelease({disputeId: dispute.id})
                                                        .unwrap()
                                                        .then(() =>
                                                            enqueueSnackbar(
                                                                t("dispute.forceRelease.success"),
                                                                {
                                                                    variant: "success",
                                                                },
                                                            ),
                                                        )
                                                }
                                            >
                                                {t("buttons.forceRelease")}
                                            </Button>
                                            <Button
                                                color="warning"
                                                variant="contained"
                                                onClick={() =>
                                                    forceRefund({disputeId: dispute.id})
                                                        .unwrap()
                                                        .then(() =>
                                                            enqueueSnackbar(
                                                                t("dispute.forceRefund.success"),
                                                                {
                                                                    variant: "success",
                                                                },
                                                            ),
                                                        )
                                                }
                                            >
                                                {t("buttons.forceRefund")}
                                            </Button>
                                        </>
                                    )}
                            </DialogActions>
                        </Form>
                    )}
                </Formik>
            </Dialog>
            {/*TODO: Make one reusable for such types of dialogs*/}
            <Dialog
                open={openRejectDialog}
                fullWidth
                maxWidth="xs"
                onClose={() => setOpenRejectDialog(false)}
            >
                <Formik
                    initialValues={generateInitialValuesFromConfig(rejectFormConf)}
                    validationSchema={generateValidationSchema(rejectFormConf)}
                    onSubmit={(values: { reason: string }, formikHelpers) => {
                        rejectProposal({disputeId: dispute.id, body: values.reason})
                            .unwrap()
                            .then(() =>
                                enqueueSnackbar(t("dispute.reject.success"), {
                                    variant: "success",
                                }),
                            )
                            .finally(() => {
                                formikHelpers.setSubmitting(false)
                                setOpenRejectDialog(false)
                            })
                    }}
                >
                    <Form>
                        <DialogTitle>{t("order.reject.title")}</DialogTitle>
                        <DialogContent
                            sx={theme => ({pt: `${theme.spacing(1)}!important`})}
                        >
                            {Object.entries(rejectFormConf).map(
                                ([fieldName, fieldConfig]) => (
                                    <FieldRenderer
                                        key={fieldName}
                                        fieldName={fieldName}
                                        fieldConfig={fieldConfig}
                                    />
                                ),
                            )}
                        </DialogContent>
                        <DialogActions sx={{justifyContent: "space-between"}}>
                            <Button
                                onClick={() => setOpenRejectDialog(false)}
                                color="error"
                                variant="contained"
                            >
                                {t("buttons.cancel")}
                            </Button>
                            <Button type="submit" color="success" variant="contained">
                                {t("buttons.submit")}
                            </Button>
                        </DialogActions>
                    </Form>
                </Formik>
            </Dialog>
        </>
    )
}

interface ReviewDialogProps {
    open: boolean
    onClose: () => void
    orderId: number
}

const ServiceReviewDialog = ({open, onClose, orderId}: ReviewDialogProps) => {
    const {t} = useTranslation()
    const [postServiceReview] = usePostServiceReviewMutation()

    return (
        <Dialog open={open} fullWidth maxWidth="xs" onClose={onClose}>
            <Formik
                initialValues={generateInitialValuesFromConfig(serviceReviewFormConf)}
                validationSchema={generateValidationSchema(serviceReviewFormConf)}
                onSubmit={(values, formikHelpers) => {
                    postServiceReview({
                        orderId: orderId,
                        postReviewDto: {rating: values.rating, body: values.review},
                    })
                        .unwrap()
                        .then(() =>
                            enqueueSnackbar(t("order.review.success"), {
                                variant: "success",
                            }),
                        )
                        .finally(() => {
                            formikHelpers.setSubmitting(false)
                            onClose
                        })
                }}
            >
                <Form>
                    <DialogTitle>{t("order.review.serviceReview")}</DialogTitle>
                    <DialogContent
                        sx={theme => ({pt: `${theme.spacing(1)}!important`})}
                    >
                        <Grid container spacing={1}>
                            {Object.entries(serviceReviewFormConf).map(
                                ([fieldName, fieldConfig]) => (
                                    <FieldRenderer
                                        key={fieldName}
                                        fieldName={fieldName}
                                        fieldConfig={fieldConfig}
                                    />
                                ),
                            )}
                        </Grid>
                    </DialogContent>
                    <DialogActions sx={{justifyContent: "space-between"}}>
                        <Button onClick={onClose} color="error" variant="contained">
                            {t("buttons.cancel")}
                        </Button>
                        <Button type="submit" color="success" variant="contained">
                            {t("buttons.submit")}
                        </Button>
                    </DialogActions>
                </Form>
            </Formik>
        </Dialog>
    )
}

const ClientReviewDialog = ({open, onClose, orderId}: ReviewDialogProps) => {
    const {t} = useTranslation()
    const [postClientReview] = usePostClientReviewMutation()

    return (
        <Dialog open={open} fullWidth maxWidth="xs" onClose={onClose}>
            <Formik
                initialValues={generateInitialValuesFromConfig(clientReviewFormConf)}
                validationSchema={generateValidationSchema(clientReviewFormConf)}
                onSubmit={(values, formikHelpers) => {
                    postClientReview({
                        orderId: orderId,
                        postReviewDto: {rating: values.rating, body: values.review},
                    })
                        .unwrap()
                        .then(() =>
                            enqueueSnackbar(t("order.review.success"), {
                                variant: "success",
                            }),
                        )
                        .finally(() => {
                            formikHelpers.setSubmitting(false)
                            onClose
                        })
                }}
            >
                <Form>
                    <DialogTitle>{t("order.review.clientReview")}</DialogTitle>
                    <DialogContent
                        sx={theme => ({pt: `${theme.spacing(1)}!important`})}
                    >
                        <Grid container spacing={1}>
                            {Object.entries(clientReviewFormConf).map(
                                ([fieldName, fieldConfig]) => (
                                    <FieldRenderer
                                        key={fieldName}
                                        fieldName={fieldName}
                                        fieldConfig={fieldConfig}
                                    />
                                ),
                            )}
                        </Grid>
                    </DialogContent>
                    <DialogActions sx={{justifyContent: "space-between"}}>
                        <Button onClick={onClose} color="error" variant="contained">
                            {t("buttons.cancel")}
                        </Button>
                        <Button type="submit" color="success" variant="contained">
                            {t("buttons.submit")}
                        </Button>
                    </DialogActions>
                </Form>
            </Formik>
        </Dialog>
    )
}

const OrdersTab = () => {
    const [page, setPage] = useState(0)
    const {data} = useGetOrdersQuery({
        page: page,
        size: 12,
        sort: ["id", "desc"],
    })

    return (
        <>
            <Grid
                container
                spacing={2}
                columns={12}
                sx={{mb: theme => theme.spacing(2)}}
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
    )
}

export default OrdersTab
