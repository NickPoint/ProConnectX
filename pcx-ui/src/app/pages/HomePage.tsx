import {Box, Typography} from '@mui/material';
import {Link as RouterLink} from 'react-router-dom';
import Link from "@mui/material/Link";
import Search from "../components/GenericSearch.tsx";
import StatCard from "../components/StatCard.tsx";
import {GridItemFullWidth} from "../theme/theme.tsx";
import Grid from "@mui/material/Grid";

const HomePage = () => {
    return (
        <Grid container spacing={2}>
            <Grid size={{xs: 12}}>
                <Search menuButtonVisible={true} />
            </Grid>
            <Grid container size={{xs: 12, md: 6}} spacing={1}>
                <Grid size={{xs: 12}}>
                    <StatCard title='Total Earnings' value='300' interval='This month' trend='up' data={[1, 2, 3]}/>
                </Grid>
                <Grid size={{xs: 6}}>
                    <StatCard title='' value='300' interval='This month' trend='up' data={[1, 2, 3]}/>
                </Grid>
                <Grid size={{xs: 6}}>
                    <StatCard title='Total Earnings' value='300' interval='This month' trend='up' data={[1, 2, 3]}/>
                </Grid>
            </Grid>
            <Box
                sx={{
                    backgroundColor: '#ece9e9',
                    mt: '2rem',
                    height: '15rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <Typography
                    variant='h2'
                    component='h1'
                    sx={{ color: '#1f1e1e', fontWeight: 500 }}
                >
                    Home Page
                </Typography>
            </Box>
            <Link component={RouterLink} to='/postService'>Post Service Form</Link>
            <Link component={RouterLink} to='/projects'>Available projects</Link>
        </Grid>
    );
};

export default HomePage;