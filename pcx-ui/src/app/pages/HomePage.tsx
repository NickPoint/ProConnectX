import {
    Box,
    Button,
    CardActionArea,
    CardHeader,
    Container,
    LinearProgress,
    Paper,
    Stack,
    Typography
} from '@mui/material';
import {useNavigate} from 'react-router-dom';
import Grid from "@mui/material/Grid";
import CardContent from "@mui/material/CardContent";
import Card from "@mui/material/Card";
import Rating, {RatingProps} from "../components/Rating.tsx";
import {
    OrderDto,
    OrderStatus,
    RoleType,
    useGetCurrentUserQuery,
    useGetOrdersQuery,
    useGetServicesQuery,
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
import {Group, RocketLaunch, Start} from '@mui/icons-material';
import heroImage from "../../assets/signup.jpg"
import webDesign from "../../assets/webDesign.png"
import plumbing from "../../assets/plumbing.png"
import carWash from "../../assets/carWash.png"
import CardList from "./CardList.tsx";
import {FooterWave, HeroWave} from "../components/svgs/WavesSvg.tsx";


const RatingCard: React.FC<RatingProps> = ({rating, ratingCount}) => {
    <Card variant="outlined" sx={{height: '100%', flexGrow: 1}}>
        <CardContent>
            <Typography component="h4" variant="h5" gutterBottom>
                Rating
            </Typography>
            <Rating rating={rating} ratingCount={ratingCount} withRatingCount/>
        </CardContent>
    </Card>
}

const statTypesConf: Record<RoleType, { type: StatType, size: number }[]> = {
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

const features = [
    {
        icon: <Group color="primary" fontSize="large"/>,
        title: "Trusted Community",
        description: "Join a network of verified professionals and clients.",
    },
    {
        icon: <RocketLaunch color="success" fontSize="large"/>,
        title: "Fast Onboarding",
        description: "Start working or hiring in just a few steps.",
    },
    {
        icon: <Start color="warning" fontSize="large"/>,
        title: "Top-rated Services",
        description: "Explore high-quality freelance services across industries.",
    },
];


const CategoryCard = ({image, title, buttonText, size, buttonVariant, buttonColor}: {
    image: string,
    title: string,
    buttonText: string,
    size: any
    buttonVariant: any
    buttonColor: any
}) => {
    const {t} = useTranslation();
    const navigate = useNavigate();
    return (
        <Grid component={Card} size={size} container sx={{
            background: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${image}) no-repeat center`,
            backgroundSize: 'cover',
            minHeight: '350px'
        }}>
            <CardActionArea onClick={() => navigate('/services')} component='div'
                            sx={{display: 'flex', alignItems: 'flex-end', justifyContent: 'flex-start', p: 2,}}>
                <Stack color='white'>
                    <Typography variant='h5'>{title}</Typography>
                    <Button color={buttonColor} onClick={() => navigate('/services')}
                            variant={buttonVariant}>{buttonText}</Button>
                </Stack>
            </CardActionArea>
        </Grid>
    )
}

const categoryCards = [
    {
        image: webDesign,
        titleKey: 'enum.categories.WEB_DESIGN',
        buttonTextKey: 'buttons.findTalents',
        size: {xs: 12, md: 6},
    },
    {
        image: plumbing,
        titleKey: 'enum.categories.PLUMBING_SERVICES',
        buttonTextKey: 'buttons.findTalents',
        size: {xs: 12, md: 3},
    },
    {
        image: carWash,
        titleKey: 'enum.categories.CAR_WASHING',
        buttonTextKey: 'buttons.findTalents',
        size: {xs: 12, md: 3},
    },
];

const LandingPage: React.FC = () => {
    const {t} = useTranslation();
    const navigate = useNavigate();

    const {data, error, isLoading, isFetching} = useGetServicesQuery({
        sort: [
            'visitCounter,desc'
        ],
        page: 0,
        size: 4,
    });

    return (
        <Grid container spacing={8}>
            <Grid container size={12} sx={{position: 'relative', color: 'white', minHeight: '400px'}}>
                <Grid container component={Container} spacing={10} maxWidth='lg' size={12} sx={{py: 4}}
                      alignItems='center'>
                    <Grid size={{xs: 12, md: 6}} container spacing={1}>
                        <Grid>
                            <Typography fontFamily='"Special Gothic Expanded One", sans-serif' variant="h3"
                                        component='h1'>
                                {t('landingPage.hero.title')}
                            </Typography>
                        </Grid>
                        <Grid>
                            <Button onClick={() => navigate('/auth')} color='secondary' variant="contained" size="large"
                                    sx={{mr: 2}}>
                                {t('buttons.join')}
                            </Button>
                            <Button onClick={() => navigate('/services')} color='secondary' variant="outlined"
                                    size="large">
                                {t('buttons.searchServices')}
                            </Button>
                        </Grid>
                    </Grid>
                    <Grid size={6} display={{xs: 'none', md: 'block'}}>
                        <Paper
                            component="img"
                            src={heroImage}
                            sx={theme => ({
                                borderTopLeftRadius: theme.spacing(10),
                                borderTopRightRadius: theme.spacing(10),
                                objectFit: 'cover',
                            })}
                        />
                    </Grid>
                </Grid>
                <HeroWave style={{
                    position: 'absolute', width: '100%',
                    height: '100%', zIndex: -1
                }}/>
            </Grid>
            <Grid container component={Container} maxWidth='lg' size={12} spacing={2}>
                <Grid size={12}>
                    <Typography variant='h4'>{t('landingPage.popularServices.title')}</Typography>
                </Grid>
                <Grid size={12}>
                    <CardList lastListSize={4} isLoading={isLoading || isFetching} data={data?.content}/>
                </Grid>
            </Grid>
            <Grid size={12} sx={{position: 'relative'}}>
                <Grid container component={Container} maxWidth='lg' sx={{py: 4}} spacing={2}>
                    <Grid size={12}>
                        <Typography variant='h4'>{t('landingPage.categories.title')}</Typography>
                    </Grid>
                    <Grid size={12} container spacing={2} sx={{minHeight: '300px'}}>
                        {categoryCards.map((card, index) => (
                            <CategoryCard
                                key={index}
                                image={card.image}
                                title={t(card.titleKey)}
                                buttonText={t(card.buttonTextKey)}
                                buttonVariant={index === 0 ? 'contained' : 'outlined'}
                                buttonColor={index === 0 ? 'primary' : 'inherit'}
                                size={card.size}
                            />
                        ))}
                    </Grid>
                </Grid>
                <FooterWave style={{
                    position: 'absolute', width: '100%',
                    height: '100%', zIndex: -1, top: 0, bottom: 0
                }}/>
            </Grid>
        </Grid>
        /*<Box sx={{ minHeight: "100vh", bgcolor: "#f5f5f5" }}>
            {/!* Hero Section *!/}
            <Box
                sx={{
                    py: 10,
                    textAlign: "center",
                    backgroundColor: "background.paper",
                }}
            >
                <Container maxWidth="md">
                    <Typography variant="h3" fontWeight={700} gutterBottom>
                        Welcome to ProConnectX
                    </Typography>
                    <Typography variant="h6" color="text.secondary" paragraph>
                        Connect with skilled freelancers or offer your services with ease and confidence.
                    </Typography>
                    <Box mt={4}>
                        <Button variant="contained" size="large" sx={{ mr: 2 }}>
                            Get Started
                        </Button>
                        <Button variant="outlined" size="large">
                            Learn More
                        </Button>
                    </Box>
                </Container>
            </Box>


            <Box sx={{ py: 10 }}>
                <Container>
                    <Typography variant="h4" align="center" fontWeight={600} gutterBottom>
                        Why ProConnectX?
                    </Typography>
                    <Grid container spacing={4} mt={4}>
                        {features.map((feature, index) => (
                            <Grid size={{xs: 12, md: 4}} key={index}>
                                <Card sx={{ textAlign: "center", height: "100%" }}>
                                    <CardContent>
                                        <Box mb={2}>{feature.icon}</Box>
                                        <Typography variant="h6" fontWeight={600}>
                                            {feature.title}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            {feature.description}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Container>
            </Box>
        </Box>*/
    );
};

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
    const {data: user, isLoading, isFetching} = useGetCurrentUserQuery();
    const {t} = useTranslation();
    const {data: cards} = useGetStatsOverviewQuery(queryArgs, {
        skip: !user?.activeRole || [RoleType.RoleUnverified, RoleType.RoleAdmin].includes(user?.activeRole)
    });
    const {data: activeOrders} = useGetOrdersQuery({
        statuses: [OrderStatus.Approved, OrderStatus.Disputed, OrderStatus.InProgress],
        page: 0, size: 4
    }, {
        skip: !user?.activeRole || [RoleType.RoleUnverified, RoleType.RoleAdmin].includes(user?.activeRole),
    });
    const {data: newOrders} = useGetOrdersQuery({
        statuses: [OrderStatus.Created],
        page: 0, size: 4
    }, {
        skip: !user?.activeRole || [RoleType.RoleUnverified, RoleType.RoleAdmin].includes(user?.activeRole),
    });
    if (!isLoading && !isFetching && (!user || RoleType.RoleFreelancer !== user?.activeRole)) {
        return <LandingPage/>
    }
    if (!cards) {
        return <GlobalLoadingBackdrop/>
    }

    return (
        <Grid component={Container} maxWidth='lg' container spacing={4}>
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
                {activeOrders && activeOrders.numberOfElements > 0 && activeOrders.content?.map((order, index) => (
                    <Grid size={{xs: 12, md: 6}} key={index}>
                        <OrderCard {...order} />
                    </Grid>
                ))}
                {(activeOrders?.numberOfElements === 0 || !activeOrders) &&
                    <Grid size={12} textAlign='center'>
                        <Typography variant='body2'>{t('general.nothingToDisplay')}</Typography>
                    </Grid>
                }
            </Grid>
            <Grid container size={{xs: 12, md: 6}} spacing={2}>
                <Typography variant='h4'>{t('homePage.newOrders')}</Typography>
                {newOrders && newOrders.numberOfElements > 0 && newOrders.content?.map((order, index) => (
                    <Grid size={{xs: 12, md: 6}} key={index}>
                        <OrderCard {...order} />
                    </Grid>
                ))}
                {(newOrders?.numberOfElements === 0 || !newOrders) &&
                    <Grid size={12} textAlign='center'>
                        <Typography variant='body2'>{t('general.nothingToDisplay')}</Typography>
                    </Grid>
                }
            </Grid>
        </Grid>
    );
};

// TODO: Create Freelancer's and Client's pages

export default HomePage;