import {RoleType, EventDto, useGetCurrentUserQuery, useGetOrderQuery} from "../../features/api/pcxApi.ts";
import {useParams} from "react-router-dom";
import {useAppDispatch} from "../hooks.ts";
import Grid from "@mui/material/Grid";
import {Chip} from "@mui/material";
import Typography from "@mui/material/Typography";
import React from "react";
import Paper from "@mui/material/Paper";
import Container from "@mui/material/Container";
import Timeline from '@mui/lab/Timeline';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';
import TimelineOppositeContent from '@mui/lab/TimelineOppositeContent';
import UserCard from "../components/UserCard.tsx";

interface EventsTimelineProps {
    events: EventDto[];
}

const EventsTimeline = ({events}: EventsTimelineProps) => {
    return (
        <Timeline position='left'>
            {events.map(((event, index) => (
                <TimelineItem key={index}>
                    <TimelineOppositeContent color="text.secondary">
                        {event.createdAt}
                    </TimelineOppositeContent>
                    <TimelineSeparator>
                        <TimelineDot/>
                        {index !== events.length - 1 && <TimelineConnector/>}
                    </TimelineSeparator>
                    <TimelineContent>{event.type}</TimelineContent>
                </TimelineItem>
            )))}
        </Timeline>
    );
}


const OrderPage = () => {
    const {data: user} = useGetCurrentUserQuery();
    const dispatch = useAppDispatch();
    const {id} = useParams<{ id: string }>();
    if (!id) {
        return <div>Error</div>;
    }
    const {data: order, isSuccess, isLoading, isFetching}
        = useGetOrderQuery({orderId: Number.parseInt(id)});

    return (
        <Container component={Paper} maxWidth='sm' sx={{p: 2}}>
            <Grid container spacing={4}>
                <Grid size={12}>
                    <Typography variant='h6' component='h2'>{`#${order.id}`}</Typography>
                    <Typography variant='h4' component='h1'>Order Details</Typography>
                </Grid>
                <Grid container size={12} spacing={1}>
                    <Grid size={4}>
                        <Typography variant='body2'>Created at</Typography>
                        <Typography variant='body1'>{order.createdAt}</Typography>
                    </Grid>
                    <Grid size={4}>
                        <Typography variant='body2'>Payment</Typography>
                        <Chip variant='filled' label='ToDo'/>
                    </Grid>
                    <Grid size={4}>
                        <Typography variant='body2'>Status</Typography>
                        <Chip variant='filled' label={order.status}/>
                    </Grid>
                </Grid>
                <Grid container size={12} spacing={1}>
                    <Grid size={{xs: 12}}>
                        {user?.activeRoleType === RoleType.RoleClient ?
                            <Typography variant='h6'>Freelancer</Typography> :
                            <Typography variant='h6'>Client</Typography>}
                    </Grid>
                    <Grid size={{xs: 12}}>
                        {user?.activeRoleType === RoleType.RoleClient
                            ? <UserCard variant='paper' {...order.service?.freelancer} />
                            : <UserCard variant='paper' {...order.client}/>}
                    </Grid>
                </Grid>
                <Grid container size={12} spacing={1}>
                    <Grid size={{xs: 12}}>
                        <Typography variant='h6'>Timeline</Typography>
                    </Grid>
                    <Grid size={{xs: 12}}>
                        <EventsTimeline events={order.events} />
                    </Grid>
                </Grid>
            </Grid>
        </Container>
    );
}

export default OrderPage;