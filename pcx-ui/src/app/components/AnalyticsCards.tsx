import {Grid2 as Grid} from "@mui/material";
import MetricCard from "./metrics/MetricCard.tsx";

const AnalyticsCards = () => {
    return (
        <Grid container spacing={1} sx={{alignItems: 'stretch'}}>
            <Grid size={{xs: 7}}>
                <MetricCard />
            </Grid>
            <Grid container size={{xs: 5}}>
                <Grid size={12}>
                    <MetricCard />
                </Grid>
                <Grid size={12}>
                    <MetricCard />
                </Grid>
            </Grid>
        </Grid>
    );
}

export default AnalyticsCards;