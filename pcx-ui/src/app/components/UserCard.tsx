import {Avatar, Box, Paper, Stack, Typography } from "@mui/material";

interface UserCardProps {
    id: number;
    firstName: string;
    lastName: string;
    avatarUrl?: string;
    rating?: number;
    variant?: 'box' | 'paper';
}

const UserCard = ({id, firstName, lastName, avatarUrl, rating, variant = 'paper'}: UserCardProps) => {
    const Container: React.ElementType = variant === 'paper' ? Paper : Box;

    return (
        <Container sx={{p: 1}}>
            <Stack direction='row' spacing={1} sx={{alignItems: 'center'}}>
                {avatarUrl ? <Avatar sx={{width:56, height: 56}} src={avatarUrl}/>
                    : <Avatar sx={{width:56, height: 56}}>{`${firstName.charAt(0)}${lastName.charAt(0)}`}</Avatar>}
                <Typography variant='h6'>{`${firstName} ${lastName}`}</Typography>
            </Stack>
        </Container>
    );
};

export default UserCard;