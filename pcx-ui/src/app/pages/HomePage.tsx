import { Box, Container, Typography } from '@mui/material';
import {Link as RouterLink} from 'react-router-dom';
import Link from "@mui/material/Link";

const HomePage = () => {
    return (
        <Container maxWidth='lg'>
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
        </Container>
    );
};

export default HomePage;