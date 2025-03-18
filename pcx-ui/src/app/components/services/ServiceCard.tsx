import {Box, Chip, Divider, Paper, Stack, Typography} from "@mui/material";
import Grid from "@mui/material/Grid2"
import {ServiceFilterResponse} from "../../../features/api/pcxApi";
import {useNavigate} from "react-router-dom";
import Rating from "../Rating";
import ClientInfo from "../ClientInfo";
import background from "../../../assets/background_service.jpg";
import {Place} from "@mui/icons-material";

const ServiceCard = (props: ServiceFilterResponse) => {
    const navigate = useNavigate();

    return (
        (<Paper sx={{borderRadius: 4, overflow: 'hidden'}} onClick={() => navigate(`/service/${props.id}`)}>
            <Grid container spacing={1}>
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
                        <Chip color='primary' variant='filled' label={props.category}/>
                        <Chip color='secondary' icon={<Place/>} variant='filled' label={props.location}/>
                    </Stack>
                </Grid>
                <Grid size={12}>
                    <Grid
                        container
                        spacing={1}
                        sx={{
                            p: 1.5,
                            alignItems: 'center'
                        }}>
                        <Grid size={9}>
                            <Box
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center'
                                }}>
                                <ClientInfo firstName={props.freelancer?.firstName} lastName={props.freelancer?.lastName}/>
                            </Box>
                        </Grid>
                        <Grid size={3}>
                            <Rating ratingCount={props.ratingCount} rating={props.rating}/>
                        </Grid>
                        <Grid size={12}>
                            <Typography variant='h6'>{props.title}</Typography>
                        </Grid>
                        <Grid size={12}>
                            <Typography variant='body1'>{props.description}</Typography>
                        </Grid>
                        <Grid size={12}>
                            <Divider/>
                        </Grid>
                        <Grid size={12}>
                            <Box
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center'
                                }}>
                                <Typography variant='body1' sx={{
                                    fontWeight: 'bold'
                                }}>${props.price}</Typography>
                            </Box>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </Paper>)
    );
}

export default ServiceCard;