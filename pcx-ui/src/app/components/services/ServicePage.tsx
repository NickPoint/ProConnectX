import Grid from "@mui/material/Grid2"
import {Box, BoxProps, ButtonProps, Chip, Container, Stack, Typography} from "@mui/material";
import {Place, Star} from "@mui/icons-material";
import Button from "@mui/material/Button";
import {styled} from "@mui/material/styles";
import {useParams} from "react-router-dom";
import {Link as RouterLink} from "react-router-dom";
import {useAppDispatch} from "../../hooks";
import {useEffect} from "react";
import {setPageTitle} from "../../../features/header/headerSlice";
import {useGetServiceQuery} from "../../../features/api/pcxApi";
import background from "../../../assets/background_service.jpg";

export const FloatingButton = styled(Button)<ButtonProps>(({theme}) => ({
    position: 'fixed',
    bottom: theme.spacing(5),
    left: '50%',
    transform: 'translateX(-50%)'
}));

const BoxMainInfo = styled(Box)<BoxProps>(({theme}) => ({
    borderRadius: theme.spacing(2),
    borderColor: theme.palette.grey["400"],
    borderStyle: 'solid',
    borderWidth: theme.spacing(0.3),
    height: '100%',
}));

const ServicePage = () => {
    const dispatch = useAppDispatch();
    const {id} = useParams<{ id: string }>();
    if (!id) {
        return <div>Error</div>;
    }

    useEffect(() => {
        dispatch(setPageTitle('Service'));
    }, [dispatch]);

    const {data, isSuccess, isLoading, isFetching}
        = useGetServiceQuery({id: Number.parseInt(id)});

    if (isLoading || isFetching) {
        return <div>Loading...</div>;
    }

    if (!isSuccess || !data) {
        return <div>Error</div>;
    }

    return (<>
        <Grid container spacing={2}>
            <Grid container
                sx={{
                    backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)) ,url(${background})`,
                    backgroundRepeat: 'no-repeat',
                    // i need to make image a bit darker
                    opacity: 'rgba(0, 0, 0, 0.5)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    minHeight: 300,
                    p: 2,
                }}
                size={12}>
                <Stack direction='row' spacing={1} sx={{alignSelf: 'flex-end'}}>
                    {
                        [...Array(3)].map((_, index) => (
                            <Chip key={index} color='primary' variant='filled' label={data.category?.name}/>
                        ))
                    }
                    <Chip color='secondary' icon={<Place/>} variant='filled' label={data.location}/>
                </Stack>
            </Grid>
            <Grid size={12}>
                <Container maxWidth='xl'>
                    <Grid container spacing={2}>
                        <Grid size={12}>
                            <Typography variant='h2' component='h1'>{data.title}</Typography>
                        </Grid>
                        <Grid size={12} sx={{
                            textAlign: 'center'
                        }}>
                            <Grid container spacing={1}>
                                <Grid size={6}>
                                    <BoxMainInfo display='flex' justifyContent='center' alignItems='center'
                                                 flexDirection='column'>
                                        <Typography variant='body1'>{data.price}</Typography>
                                        <Typography variant='body2'>Price</Typography>
                                    </BoxMainInfo>
                                </Grid>
                                <Grid size={6}>
                                    <BoxMainInfo display='flex' justifyContent='center' alignItems='center'
                                                 flexDirection='column'>
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                alignItems: 'center'
                                            }}>
                                            <Star sx={{color: 'primary.main'}}/>
                                            <Typography variant='body1'>{data.rating}</Typography>
                                        </Box>
                                        <Typography variant='body2'>Rating</Typography>
                                    </BoxMainInfo>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid size={12}>
                            <Typography variant='h4'>Description</Typography>
                            <Typography variant='body1'>{data.description}</Typography>
                        </Grid>
                    </Grid>
                </Container>
            </Grid>
        </Grid>
        <FloatingButton component={RouterLink} variant='contained' color='primary'
                        to='write'>Connect</FloatingButton>
    </>);
}

export default ServicePage;