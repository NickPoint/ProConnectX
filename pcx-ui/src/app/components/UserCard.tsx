import {Avatar, Box, Paper, Stack, Typography } from "@mui/material";
import {ReviewerDto} from "../../features/api/pcxApi.ts";
import Rating from "./Rating.tsx";

interface UserCardProps extends ReviewerDto{
    variant?: 'box' | 'paper';
    withRating?: boolean;
}

const UserCard = ({id, firstName, lastName, avatarImageUrl, rating, variant = 'paper', withRating}: UserCardProps) => {
    const Container: React.ElementType = variant === 'paper' ? Paper : Box;

    return (
        <Container sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
        }}>
            <Stack direction='row' spacing={1} sx={{alignItems: 'center'}}>
                <Avatar alt={firstName} src={avatarImageUrl}/>
                <Typography variant='body1'>{`${firstName} ${lastName}`}</Typography>
            </Stack>
            {withRating &&
                <Rating rating={rating}/>
            }
        </Container>
    );
};

export default UserCard;