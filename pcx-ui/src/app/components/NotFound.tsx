import {Box, Button, Typography} from '@mui/material';
import {useTranslation} from 'react-i18next';
import {useNavigate} from 'react-router-dom';

export default function NotFound() {
    const navigate = useNavigate();
    const {t} = useTranslation();

    return (
        <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            height="100vh"
            textAlign="center"
            px={2}
        >
            <Typography variant="h1" color="error" gutterBottom>
                {t('notFound.errorCode')}
            </Typography>
            <Typography variant="h5" gutterBottom>
                {t('notFound.title')}
            </Typography>
            <Typography variant="body1" mb={4}>
                {t('notFound.description')}
            </Typography>
            <Button variant="contained" onClick={() => navigate('/')}>
                {t('notFound.backToHome')}
            </Button>
        </Box>
    );
}