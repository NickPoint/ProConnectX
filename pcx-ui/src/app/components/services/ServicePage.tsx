import Grid from "@mui/material/Grid"
import {Box, BoxProps, Chip, Container, Divider, Fab, Stack, Typography} from "@mui/material";
import {Message, Place, Star, StarRate} from "@mui/icons-material";
import {styled, useTheme} from "@mui/material/styles";
import {useParams} from "react-router-dom";
import {useAppDispatch, useAppSelector} from "../../hooks";
import React, {useEffect} from "react";
import {setPageTitle} from "../../../features/header/headerSlice";
import {FreelancerDto, useGetServiceQuery} from "../../../features/api/pcxApi";
import background from "../../../assets/background_service.jpg";
import BookServiceForm from "../BookServiceForm.tsx";
import {hasClientRole} from "../../../features/auth/authSlice.ts";
import Avatar from "@mui/material/Avatar";
import UserCard from "../UserCard.tsx";
import Carousel from "react-material-ui-carousel";
import Paper from "@mui/material/Paper";
import Timeline from "@mui/lab/Timeline";
import TimelineItem from "@mui/lab/TimelineItem";
import TimelineOppositeContent from "@mui/lab/TimelineOppositeContent";

const BoxMainInfo = styled(Box)<BoxProps>(({theme}) => ({
    borderRadius: theme.spacing(2),
    borderColor: theme.palette.grey["400"],
    borderStyle: 'solid',
    borderWidth: theme.spacing(0.3),
    height: '100%',
}));

const ServicePage = () => {
    const theme = useTheme();
    const userHasClientRole = useAppSelector(hasClientRole);
    const dispatch = useAppDispatch();
    const {id} = useParams<{ id: string }>();
    if (!id) {
        return <div>Error</div>;
    }

    useEffect(() => {
        dispatch(setPageTitle('Service'));
    }, [dispatch]);

    const {data: service, isSuccess, isLoading, isFetching}
        = useGetServiceQuery({id: Number.parseInt(id)});

    if (isLoading || isFetching) {
        return <div>Loading...</div>;
    }

    if (!isSuccess || !service) {
        return <div>Error</div>;
    }

    return (<>
        <Grid container spacing={2}>
            <Grid size={{xs: 12}} sx={{
                position: 'relative',
            }}>
                <Carousel
                    indicatorContainerProps={{
                        style: {
                            left: 0,
                            right: 0,
                            bottom: theme.spacing(14),
                            position: 'absolute',
                            zIndex: 1,
                        }
                    }}>
                    <img src={background}/>
                    <img src={background}/>
                    <img src={background}/>
                    <img src={background}/>
                </Carousel>
                <Box sx={(theme) => ({
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    zIndex: 1,
                    pointerEvents: 'none',
                    background: `linexar-gradient(to bottom, transparent 85%, #000)`,
                })}>
                </Box>
                <Box sx={{
                    position: 'absolute',
                    left: 0,
                    right: 0,
                    bottom: theme.spacing(2),
                    zIndex: 1,
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    display: 'flex',
                    p: 1,
                    color: 'white'
                }}>
                    <UserCard variant='box' {...service.freelancer} />
                    <Fab color='primary'>
                        <Message/>
                    </Fab>
                </Box>
            </Grid>
            <Grid size={12} container component={Container} maxWidth='xl'>
                <Grid container size={12} spacing={2}>
                    <Grid size={12}>
                        <Typography variant='h3' component='h1'>{service.title}</Typography>
                    </Grid>
                    <Grid size={6}>
                        <Stack direction='row' spacing={1}>
                            <StarRate/>
                            <Typography variant='body1'>{`${service.rating}/5 - Todo`}</Typography>
                        </Stack>
                        <Typography component='a'
                                    variant='body2'>{`${service.ratingCount} reviews`}</Typography>
                    </Grid>
                    <Grid size={6} textAlign='right'>
                        <Typography variant='h4' fontWeight='700'>${service.price}</Typography>
                        <Typography variant='body2'>Basic</Typography>
                    </Grid>
                    <Grid size={12}>
                        <Divider/>
                    </Grid>
                </Grid>
                <Grid container size={12} spacing={2}>
                    <Typography variant='h4' component='h2'>Description</Typography>
                    <Typography variant='body1'>{service.description}</Typography>
                    <Stack direction='row' spacing={1} sx={{alignSelf: 'flex-end'}}>
                        {
                            [...Array(3)].map((_, index) => (
                                <Chip key={index} color='primary' variant='outlined' label={service.category?.name}/>
                            ))
                        }
                        <Chip color='secondary' icon={<Place/>} variant='filled' label={service.location}/>
                    </Stack>
                    <Divider/>
                </Grid>
                {/*TODO: add packages*/}
                <Grid container size={12} spacing={2}>
                    <Grid>
                        <Typography variant='h4' component='h2'>Workflow</Typography>
                        <Paper sx={{p: 2}}>
                            <TimelineItem>
                                <TimelineOppositeContent
                                    sx={{ m: 'auto 0' }}
                                    align="right"
                                    variant="body2"
                                    color="text.secondary"
                                >
                                    9:30 am
                                </TimelineOppositeContent>
                                <TimelineSeparator>
                                    <TimelineConnector />
                                    <TimelineDot>
                                        <FastfoodIcon />
                                    </TimelineDot>
                                    <TimelineConnector />
                                </TimelineSeparator>
                                <TimelineContent sx={{ py: '12px', px: 2 }}>
                                    <Typography variant="h6" component="span">
                                        Eat
                                    </Typography>
                                    <Typography>Because you need strength</Typography>
                                </TimelineContent>
                            </TimelineItem>
                            <TimelineItem>
                                <TimelineOppositeContent
                                    sx={{ m: 'auto 0' }}
                                    variant="body2"
                                    color="text.secondary"
                                >
                                    10:00 am
                                </TimelineOppositeContent>
                                <TimelineSeparator>
                                    <TimelineConnector />
                                    <TimelineDot color="primary">
                                        <LaptopMacIcon />
                                    </TimelineDot>
                                    <TimelineConnector />
                                </TimelineSeparator>
                                <TimelineContent sx={{ py: '12px', px: 2 }}>
                                    <Typography variant="h6" component="span">
                                        Code
                                    </Typography>
                                    <Typography>Because it&apos;s awesome!</Typography>
                                </TimelineContent>
                            </TimelineItem>
                            <TimelineItem>
                                <TimelineSeparator>
                                    <TimelineConnector />
                                    <TimelineDot color="primary" variant="outlined">
                                        <HotelIcon />
                                    </TimelineDot>
                                    <TimelineConnector sx={{ bgcolor: 'secondary.main' }} />
                                </TimelineSeparator>
                                <TimelineContent sx={{ py: '12px', px: 2 }}>
                                    <Typography variant="h6" component="span">
                                        Sleep
                                    </Typography>
                                    <Typography>Because you need rest</Typography>
                                </TimelineContent>
                            </TimelineItem>
                            <TimelineItem>
                                <TimelineSeparator>
                                    <TimelineConnector sx={{ bgcolor: 'secondary.main' }} />
                                    <TimelineDot color="secondary">
                                        <RepeatIcon />
                                    </TimelineDot>
                                    <TimelineConnector />
                                </TimelineSeparator>
                                <TimelineContent sx={{ py: '12px', px: 2 }}>
                                    <Typography variant="h6" component="span">
                                        Repeat
                                    </Typography>
                                    <Typography>Because this is the life you love!</Typography>
                                </TimelineContent>
                            </TimelineItem>
                        </Paper>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
        {userHasClientRole &&
            <BookServiceForm serviceName={service.title} freelancer={service.freelancer} serviceId={service.id}/>
        }
    </>);
}

export default ServicePage;

/*| Hero Section + CTA (Book) |
|----------------------------|
| Image / Gallery Carousel   |
|----------------------------|
| Service Description        |
|----------------------------|
| Freelancer Card            |
|----------------------------|
| Service Packages (if any)  |
|----------------------------|
| Booking Form               |
|----------------------------|
| Reviews                    |
|----------------------------|
| FAQ                        |
|----------------------------|
| Related Services           |*/