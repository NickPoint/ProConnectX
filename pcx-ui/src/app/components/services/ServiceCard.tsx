import {
    Box,
    Card,
    CardActionArea,
    CardContent,
    CardHeader,
    Chip,
    ChipProps,
    Divider,
    Grid,
    Stack,
    Typography
} from "@mui/material";
import {LightweightAddressDto, LightweightServiceDto} from "../../../features/api/pcxApi";
import {useNavigate} from "react-router-dom";
import Avatar from "@mui/material/Avatar";
import {styled} from "@mui/material/styles";
import React from "react";
import {LocationOn, Star} from "@mui/icons-material";
import {useTranslation} from "react-i18next";
import {parseOffsetDateTimeToString} from "../../../utils/dateParser.ts";
import {t} from 'i18next';

const CustomCardMediaRoot = styled(Box, {
    name: "CustomCardMedia",
    slot: "root",
})<{ ownerState: CustomCardMediaState }>(({theme, ownerState}) => ({
    display: 'flex',
    backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${ownerState.image})`,
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    minHeight: 200,
    padding: theme.spacing(2),
}));

interface CustomCardMediaProps {
    chips: ChipProps[];
    image: string;
}

interface CustomCardMediaState extends CustomCardMediaProps{}

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

export function getAddressAsString(address: LightweightAddressDto | undefined): string {
    if (!address) {
        return t('service.location.remote');
    }
    return `${address.country}, ${address.city}`
}

interface ServiceCardProps extends LightweightServiceDto{
    publicVariant?: boolean;
}

const ServiceCard: React.FC<ServiceCardProps> = ({publicVariant = true, ...service}) => {
    const navigate = useNavigate();
    const {t} = useTranslation();

    return (
        <Card>
            {publicVariant ?
                <CardHeader color='primary'
                        avatar={<Avatar alt={service.freelancer.firstName} src={service.freelancer.avatarImageUrl}/>}
/*                        action={<ButtonGroup>
                            <IconButton><Star/></IconButton>
                            <IconButton aria-label="settings"><MoreVertIcon/></IconButton>
                        </ButtonGroup>}*/
                        title={
                            <Typography>{`${service.freelancer?.firstName} ${service.freelancer?.lastName}`}</Typography>}
                /> :
                <CardHeader color='primary'
                            title={
                                <Typography>#{service.id}</Typography>}
                />
            }
            <CardActionArea onClick={() => navigate(`/service/${service.id}`)}>
                <CustomCardMedia image={service.thumbnailUrl}
                                 chips={[
                                     {label: service.ratingCount === 0 ? t('general.new') : service.rating, color: 'primary', icon: service.ratingCount !== 0 ? <Star/> : undefined}
                                     // {label: 'Easy Work', color: 'secondary'},
                                     // {label: 'Chip offer', color: 'secondary'},
                                 ]}/>
                <CardContent>
                    <Stack spacing={2}>
                        <Grid container sx={{alignItems: 'center'}} spacing={2}>
                            <Grid size={{xs: 8}}>
                                <Typography variant='h4'>{service.title}</Typography>
                                <Typography variant='body2'>{parseOffsetDateTimeToString(service.postedAt)}</Typography>
                            </Grid>
                            <Grid size={{xs: 4}} sx={{textAlign: 'right'}}>
                                <Typography variant='h5' fontWeight={700}>€{service.price}</Typography>
                            </Grid>
                            <Grid size={12}>
                                <Divider />
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
                        >{service.shortDescription}</Typography>
                        {/*<Divider/>*/}
                        <Stack direction='row' spacing={1} sx={{overflowX: 'auto', scrollbarWidth: 'none'}}>
                            <Chip icon={<LocationOn/>} color='secondary' label={getAddressAsString(service.address)}/>
                            {service.categories.map((item, index) => (
                                <Chip key={index} label={item} color='primary' variant='outlined' />
                            ))}
                        </Stack>
                    </Stack>
                </CardContent>
            </CardActionArea>
        </Card>);
}

// TODO: Сделать свечение сзади карточки и сделать возможнсть избанных карточек. И добавить им свечение

export default ServiceCard;