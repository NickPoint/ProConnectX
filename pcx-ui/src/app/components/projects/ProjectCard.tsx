import {Avatar, Box, Chip, Paper, Stack, Typography} from "@mui/material";
import Grid from "@mui/material/Grid2"
import {useNavigate} from "react-router-dom";
import {ProjectPublicDto, ProjectType} from "../../../features/api/pcxApi";

const ProjectCard = (props: ProjectPublicDto) => {
    const navigate = useNavigate();

    return (
        (<Paper sx={{borderRadius: 4, overflow: 'hidden'}} onClick={() => navigate(`/project/${props.id}`)}>
            <Grid size={12} sx={{
                p: 1.5
            }}>
                <Grid container rowSpacing={3}>
                    <Grid container rowSpacing={1} size={12}>
                        <Grid size={12}>
                            <Typography variant='h4'>{props.title}</Typography>
                        </Grid>
                        <Grid size={12}>
                            <Typography variant='body1'>{props.shortDescription}</Typography>
                        </Grid>
                    </Grid>
                    <Grid size={12}>
                        <Stack direction='row' spacing={1}>
                            {props.categories.map((category, index) => (
                                <Chip key={index} variant='filled' label={category} color='primary'/>
                            ))}
                        </Stack>
                    </Grid>
                </Grid>
            </Grid>
            <Grid
                size={12}
                sx={{
                    p: 1.5,
                    bgcolor: 'secondary.main'
                }}>
                <Grid container sx={{
                    alignItems: 'center'
                }}>
                    <Grid size={8} sx={{
                        textAlign: 'left'
                    }}>
                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'center'
                            }}>
                            <Avatar src='https://source.unsplash.com/random?wallpapers'
                                    sx={{width: '32px', height: '32px'}}/>
                            <Typography variant='body1' sx={{
                                ml: 1
                            }}>
                                {props.employer?.companyName}</Typography>
                        </Box>
                    </Grid>
                    <Grid
                        container
                        rowfSpacing={3}
                        size={4}
                        sx={{
                            textAlign: 'right',
                            alignItems: 'center'
                        }}>
                        <Grid size={12}>
                            <Typography
                                variant='body1'>{props.projectType === ProjectType.Bid ? "Current bid" : "Budget"}
                            </Typography>
                            <Box
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'right',
                                    alignItems: 'center'
                                }}>
                                <Typography variant='body1' sx={{
                                    fontWeight: 'bold'
                                }}>${
                                    props.projectType === ProjectType.Bid ? props.maxBid : props.budget
                                }</Typography>
                            </Box>
                        </Grid>
                        {props.maxBid &&
                            <Grid size={12}>
                                <Typography variant='body2'>{props.bidCount} bids</Typography>
                            </Grid>
                        }
                    </Grid>
                </Grid>
            </Grid>
        </Paper>)
    );
}

export default ProjectCard;