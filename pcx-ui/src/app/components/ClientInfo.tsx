import Grid from "@mui/material/Grid2"
import {Avatar, Box, Typography} from "@mui/material";

interface ClientInfoProps {
    firstName: string | undefined
    lastName: string | undefined
}

const ClientInfo = (props: ClientInfoProps) => {
    return (
        (<Box
            sx={{
                display: 'flex',
                alignItems: 'center'
            }}>
            <Avatar src='https://source.unsplash.com/random?wallpapers'
                    sx={{width: '32px', height: '32px'}}/>
            <Typography variant='body1' sx={{
                ml: 1
            }}>{props.firstName} {props.lastName}</Typography>
        </Box>)
    );
}

export default ClientInfo;