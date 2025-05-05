import {Box, CardActionArea, CardHeader, LinearProgress, Stack, Typography} from '@mui/material';
import {useNavigate} from 'react-router-dom';
import Grid from "@mui/material/Grid";
import CardContent from "@mui/material/CardContent";
import Card from "@mui/material/Card";
import Rating, {RatingProps} from "../components/Rating.tsx";
import {
    OrderDto,
    RoleType,
    useGetActiveOrdersQuery,
    useGetCurrentUserQuery,
    useGetStatsOverviewQuery
} from "../../features/api/pcxApi.ts";
import {useTranslation} from "react-i18next";
import * as React from "react";
import {useMemo} from "react";
import dayjs from "dayjs";
import {GlobalLoadingBackdrop} from "../components/GlobalLoadingBackdrop.tsx";
import StatCard, {StatType} from "../components/dashboard/StatCard.tsx";
import Chip from "@mui/material/Chip";
import {parseOffsetDateTime} from "../../utils/dateParser.ts";
import UserCard from "../components/UserCard.tsx";
import {calculateProgress, getOrderStatusChipColor} from '../components/dashboard/OrdersTab.tsx';

const RatingCard: React.FC<RatingProps> = ({rating, ratingCount}) => {
    <Card variant="outlined" sx={{height: '100%', flexGrow: 1}}>
        <CardContent>
            <Typography component="h4" variant="h5" gutterBottom>
                Rating
            </Typography>
            <Rating rating={rating} ratingCount={ratingCount} withRatingCount />
        </CardContent>
    </Card>
}

const statTypesConf: Record<RoleType, {type: StatType, size: number}[]> = {
    ROLE_FREELANCER: [
        {type: 'DAILY_TOTAL_EARNINGS', size: 12},
        {type: 'ORDERS_COMPLETED', size: 6},
        {type: 'ORDER_SUCCESS_RATE', size: 6},
    ],
    ROLE_CLIENT: [
        // ...
    ],
    ROLE_ADMIN: [
        // ...
    ],
};

const OrderCard = (props: OrderDto) => {
    const {t} = useTranslation();
    const navigate = useNavigate();
    const {data: user} = useGetCurrentUserQuery();

    return (
        <Card>
            <CardHeader title={
                <Stack direction='row' spacing={1} sx={{alignItems: 'center'}}>
                    <Typography>#{props.id}</Typography>
                    <Chip color={getOrderStatusChipColor(props.status)} size="small" variant='filled'
                          label={t(`enum.orderStatus.${props.status}`)}/>
                </Stack>
            }/>
            <CardActionArea onClick={() => navigate('/dashboard/orders')}>
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
    );
}



const HomePage = () => {
    const queryArgs = useMemo(() => {
        const end = dayjs();
        const start = end.subtract(30, 'days');

        return {
            start: start.startOf('day').toISOString(),
            end: end.endOf('day').toISOString(),
            zoneId: Intl.DateTimeFormat().resolvedOptions().timeZone
        };
    }, []);
    const {data: user} = useGetCurrentUserQuery();
    const {t} = useTranslation();
    const {data: cards} = useGetStatsOverviewQuery(queryArgs, {
        skip: user?.activeRole === RoleType.RoleUnverified
    });
    const {data: orders} = useGetActiveOrdersQuery({page: 0, size: 4}, {
        skip: [RoleType.RoleUnverified, RoleType.RoleAdmin].includes(user?.activeRole)
    });
    if (!cards) {
        return <GlobalLoadingBackdrop />
    }


    return (
        <Grid container spacing={4}>
            <Grid container size={{xs: 12, md: 6}} spacing={1}>
                {statTypesConf[user?.activeRole].map((conf, index) => {
                    const card = cards[conf.type];
                    if (!card) return null;

                    return (
                        <Grid key={index} size={conf.size}>
                            <StatCard
                                type={conf.type}
                                title={t(`enum.statistics.${conf.type}`)}
                                value={card.value}
                                percentGrow={card.percentGrow}
                                interval={t('dashboard.stats.last30Days')}
                                startDate={queryArgs.start}
                                endDate={queryArgs.end}
                                trend={card.trend}
                                data={card.data}
                            />
                        </Grid>
                    );
                })}
                {/*<Grid size={{xs: 6}}>*/}
                {/*    <RatingCard rating={} ratingCount={}*/}
                {/*</Grid>*/}
            </Grid>
            <Grid container size={{xs: 12, md: 6}} spacing={2}>
                <Typography variant='h4'>{t('homePage.yourActiveOrders')}</Typography>
                {orders && orders.numberOfElements > 0 && orders.content?.map((order, index) => (
                    <Grid size={{xs: 12, md: 6}} key={index}>
                        <OrderCard {...order} />
                    </Grid>
                ))}
                {(orders?.numberOfElements === 0 || !orders) &&
                    <Grid size={12} textAlign='center'>
                        <Typography variant='body2'>{t('general.nothingToDisplay')}</Typography>
                    </Grid>
                }
            </Grid>
        </Grid>
    );
};

export default HomePage;