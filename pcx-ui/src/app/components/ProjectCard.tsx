import {Avatar, Box, Chip, Paper, Theme, ThemeProvider, Typography} from "@mui/material";
import Grid from "@mui/material/Grid";
import {Client, ProjectFilterResponse} from "../../features/api/pcxApi";
import PaidIcon from '@mui/icons-material/Paid';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import {createTheme} from "@mui/material/styles";
import * as React from "react";
import theme from "../theme/theme";

const ProjectCard = (props: ProjectFilterResponse) => {

    return (
        <Paper sx={{borderRadius: 2}}>
            <Grid xs={12} item p={3}>
                <Grid container rowSpacing={3}>
                    <Grid container xs={12} rowSpacing={1} item>
                        <Grid xs={12} item>
                            <Typography variant='h4'>{props.title}</Typography>
                        </Grid>
                        <Grid xs={12} item>
                            <Typography variant='body1'>{props.shortDescription}</Typography>
                        </Grid>
                    </Grid>
                    <Grid xs={12} item>
                        <Chip label={props.category} color='primary'/>
                    </Grid>
                </Grid>
            </Grid>
            <Grid xs={12} item p={3} bgcolor='secondary.main'>
                <Grid container alignItems='center'>
                    <Grid container xs={6} item alignItems='center'>
                        <Avatar><AccountCircleIcon/></Avatar>
                        <Typography variant='body1' ml={1}>{props.owner?.name}</Typography>
                    </Grid>
                    <Grid container xs={6} textAlign='right' alignItems='center' item rowSpacing={3}>
                        <Grid xs={12} item>
                            <Typography
                                variant='body2'>{props.lastBid ? "Current bid" : "Budget"}
                            </Typography>
                            <Box display='flex' item justifyContent='right'>
                                <PaidIcon/>
                                <Typography variant='h6' ml={1}>{
                                    props.lastBid ? props.lastBid : props.budget
                                }</Typography>
                            </Box>
                        </Grid>
                        <Grid xs={12} item>
                            <Typography variant='body2'>{props.bidCount} bids</Typography>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
            {/*                <Grid container spacing={1} alignItems='center'>

                    <Grid>
                        <Typography variant='body2'>{props.owner?.name}</Typography>
                    </Grid>
                </Grid>*/}
        </Paper>
    )
        ;
}

export default ProjectCard;