import {
    Grid,
    Typography,
    Box,
    Card,
    CardContent,
    CardHeader,
    Chip,
    IconButton,
    Stack,
    Divider,
    ChipProps,
    CardActionArea, ButtonGroup
} from "@mui/material";
import {ServiceFilterResponse} from "../../../features/api/pcxApi";
import {useNavigate} from "react-router-dom";
import background from "../../../assets/background_service.jpg";
import Avatar from "@mui/material/Avatar";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import {styled} from "@mui/material/styles";
import React from "react";
import {LocationOn, Star} from "@mui/icons-material";

const CustomCardMediaRoot = styled(Box, {
    name: "CustomCardMedia",
    slot: "root",
})<{ ownerState: CustomCardMediaState }>(({theme, ownerState}) => ({
    display: 'flex',
    backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${ownerState.image})`,
    backgroundRepeat: 'no-repeaSt',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    minHeight: 200,
    padding: theme.spacing(2),
}));

interface CustomCardMediaProps {
    chips: ChipProps[];
    image: string;
}

interface CustomCardMediaState extends CustomCardMediaProps {
}

const CustomCardMedia =
    React.forwardRef<HTMLDivElement, CustomCardMediaProps>(
        function CustomCardMedia(props, ref) {
            const {chips, image, ...other} = props;
            const ownerState = {...props, image};
            return (
                <CustomCardMediaRoot ref={ref} ownerState={ownerState} {...other}>
                    <Stack direction='row' spacing={1} sx={{alignSelf: 'flex-end'}}>
                        {chips.map((chip, index) => (
                            <Chip key={index} {...chip}/>))
                        }
                    </Stack>
                </CustomCardMediaRoot>
            );
        }
    );


const ServiceCard = (props: ServiceFilterResponse) => {
    const navigate = useNavigate();

    return (
        <Card>
            <CardHeader color='primary'
                        avatar={props.freelancer?.profilePicture ?
                            <Avatar src={props.freelancer?.profilePicture}/> :
                            <Avatar>
                                {`${props.freelancer?.firstName?.charAt(0)}${props.freelancer?.lastName?.charAt(0)}`}
                            </Avatar>}
                        action={<ButtonGroup>
                            <IconButton><Star/></IconButton>
                            <IconButton aria-label="settings"><MoreVertIcon/></IconButton>
                        </ButtonGroup>}
                        title={
                            <Typography>{`${props.freelancer?.firstName} ${props.freelancer?.lastName}`}</Typography>}
            />
            <CardActionArea onClick={() => navigate(`/service/${props.id}`)}>
                <CustomCardMedia image={background}
                                 chips={[
                                     {label: props.rating, color: 'primary', icon: <Star/>},
                                     {label: 'Easy Work', color: 'secondary'},
                                     {label: 'Chip offer', color: 'secondary'},
                                 ]}/>
                <CardContent>
                    <Stack spacing={2}>
                        <Grid container sx={{alignItems: 'center'}}>
                            <Grid size={{xs: 8}}>
                                <Typography variant='body1'>{props.title}</Typography>
                                <Typography variant='body2'>23 minutes ago</Typography>
                            </Grid>
                            <Grid size={{xs: 4}} sx={{textAlign: 'right'}}>
                                <Typography variant='h5'>${props.price}</Typography>
                            </Grid>
                        </Grid>
                        <Typography variant='body1'
                                    sx={{
                                        display: '-webkit-box',
                                        WebkitBoxOrient: 'vertical',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        WebkitLineClamp: 4,
                                    }}
                        >{props.description}</Typography>
                        <Divider/>
                        <Stack direction='row' spacing={1} sx={{overflowX: 'auto', scrollbarWidth: 'none'}}>
                            <Chip icon={<LocationOn/>} color='secondary' label={props.location}/>
                            <Chip variant='outlined' color='primary' label={props.category}/>
                            <Chip variant='outlined' color='primary' label={props.category}/>
                            <Chip variant='outlined' color='primary' label={props.category}/>
                            <Chip variant='outlined' color='primary' label={props.category}/>
                        </Stack>
                    </Stack>
                </CardContent>
            </CardActionArea>
        </Card>);
}

// TODO: Сделать свечение сзади карточки и сделать возможнсть избанных карточек. И добавить им свечение

export default ServiceCard;