import {Box, Card, CardActionArea, CardContent, CircularProgress, Grid2 as Grid, Typography} from "@mui/material";
import Paper from "@mui/material/Paper";
import {GridItemFullWidth} from "../../theme/theme.tsx";
import {AttachMoney} from "@mui/icons-material";
import circleScatterHaikei from '/src/assets/svg/circle-scatter-haikei.svg';
import {styled} from "@mui/material/styles";

const GlassBox = styled(Box)(({theme}) => ({
    padding: theme.spacing(1),
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    backdropFilter: 'blur(5px)',
    borderRadius: 2,
    border: '1px solid rgba(255, 255, 255, 0.3)',
    boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)'
}));

const MetricCard = () => {
    return (
        <Card variant='outlined'
              sx={{
                  color: 'primary.contrastText',
                  backgroundImage: `url(${circleScatterHaikei})`,
                  backgroundColor: 'primary.main',
                  }}>
            <CardActionArea>
                <CardContent sx={{textAlign: 'left'}}>
                    <Grid container spacing={2}>
                        <GridItemFullWidth>
                            <Typography gutterBottom variant='body1'>Total Earnings</Typography>
                        </GridItemFullWidth>
                        <GridItemFullWidth>
                            <Box>
                                <Typography variant='h3'>$ 1231.34</Typography>
                                <Typography variant='body2'>This month</Typography>
                            </Box>
                        </GridItemFullWidth>
                        <GridItemFullWidth>
                            <GlassBox>
                                <Box sx={{display: 'flex', alignItems: 'center'}}>
                                    <CircularProgress variant='determinate' />
                                    <Box>
                                        <Typography variant='body2'>Monthly target</Typography>
                                        <Typography variant='body2'>$5000 (-3768.66)</Typography>
                                    </Box>
                                </Box>
                            </GlassBox>
                        </GridItemFullWidth>
                    </Grid>

                </CardContent>
            </CardActionArea>
        </Card>
    );
}

export default MetricCard;