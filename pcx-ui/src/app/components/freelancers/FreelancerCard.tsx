import * as React from "react";
import {FC} from "react";
import {FreelancerFilterResponse} from "../../../features/api/pcxApi";
import {Box, Chip, Paper, Typography} from "@mui/material";
import Grid from "@mui/material/Grid"
import {Star} from "@mui/icons-material";

const FreelancerCard: FC<FreelancerFilterResponse> = (props) => {

    return (
        (<Paper>
            <Grid container>
                <Grid
                    sx={{
                        backgroundImage: 'url(https://source.unsplash.com/random?wallpapers)',
                        backgroundRepeat: 'no-repeat',
                        backgroundColor: (t) =>
                            t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        minHeight: 350,
                        position: 'relative'
                    }}
                    size={12}>
                    <Grid container sx={{
                        color: 'white',
                        textAlign: 'left',
                        position: 'absolute',
                        bottom: 0,
                        p: 1.5
                    }} spacing={2}>
                        <Grid size={12}>
                            <Grid container>
                                <Grid size={12}>
                                    <Typography variant='h6'>{props.firstName} {props.lastName}</Typography>
                                </Grid>
                                <Grid size={12}>
                                    <Typography variant='body1'>{props.categories?.at(0)}</Typography>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid size={12}>
                            <Box
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center'
                                }}>
                                {props.ratingCount !== undefined && props.ratingCount > 5 ? (
                                    <>
                                        <Star/>
                                        <Typography variant='body1' sx={{
                                            ml: 0.5
                                        }}>{props.rating?.toPrecision(2)}</Typography>
                                    </>
                                ) : (
                                    <Chip label="New" color="success"/>
                                )}
                            </Box>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </Paper>)
    );
}

export default FreelancerCard;