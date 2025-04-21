import {Card, Box, Avatar, CardContent, Typography, Rating, Divider, Stack} from "@mui/material";
import {ClientDto, EmployerResponseDto, FreelancerDto, ReviewDto} from "../../features/api/pcxApi.ts";
import UserCard from "./UserCard.tsx";
import {parseOffsetDateTime} from "../../utils/dateParser.ts";

const ReviewCard: React.FC<ReviewDto> =
    ({id, rating, reviewer, body, createdAt}) => {
    return (
            <Card sx={{p: 2}} component={Stack} spacing={2}>
                <UserCard {...reviewer} variant='box' withRating />
                <Divider />
                <Stack direction='row' sx={{dispay: 'flex', alignItems: 'center'}} spacing={1}>
                    <Rating value={rating} precision={0.5} readOnly/>
                    <Typography variant='body2'>•</Typography>
                    <Typography variant='body2'>
                        {`${parseOffsetDateTime(createdAt)}`}
                    </Typography>
                </Stack>
                <CardContent sx={{p: 0}}>
                    <Typography variant="body1">
                        {body}
                    </Typography>
                </CardContent>
            </Card>
    );
}

export default ReviewCard;