import {Avatar, Box, Paper, Stack, Typography } from "@mui/material";
import {ReviewerDto} from "../../features/api/pcxApi.ts";
import Rating from "./Rating.tsx";

interface UserCardProps extends ReviewerDto{
    variant?: 'box' | 'paper';
    withRating?: boolean;
}

const UserCard = ({id, firstName, lastName, avatarUrl, rating, variant = 'paper', withRating}: UserCardProps) => {
    const Container: React.ElementType = variant === 'paper' ? Paper : Box;

    return (
        <Container sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
        }}>
            <Stack direction='row' spacing={1} sx={{alignItems: 'center'}}>
                {avatarUrl ? <Avatar sx={{width:56, height: 56}} src={avatarUrl}/>
                    : <Avatar sx={{width:56, height: 56}}>{`${firstName.charAt(0)}${lastName?.charAt(0)}`}</Avatar>}
                <Typography variant='h6'>{`${firstName} ${lastName}`}</Typography>
            </Stack>
            {withRating &&
                <Rating rating={rating}/>
            }
        </Container>
    );
};

export default UserCard;