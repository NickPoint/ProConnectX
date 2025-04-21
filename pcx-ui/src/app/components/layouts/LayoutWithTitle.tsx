import {AppBar, Container, Stack, Toolbar, Typography} from "@mui/material";
import {Outlet} from "react-router-dom";
import Grid from "@mui/material/Grid";
import {useAppSelector} from "../../hooks.ts";
import {selectTitle} from "../../../features/page/pageSlice.ts";
import {useTranslation} from "react-i18next";
import {styled} from "@mui/material/styles";

const StyledToolbar = styled(Toolbar)(({theme}) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: theme.spacing(2),
    backdropFilter: 'blur(24px)',
    border: '1px solid',
    borderColor: (theme.vars || theme).palette.divider,
    boxShadow: (theme.vars || theme).shadows[1],
    padding: `${theme.spacing(1)} ${theme.spacing(1.5)}`,
}));

const LayoutWithTitle = () => {
    const {t} = useTranslation();
    const title = useAppSelector(selectTitle);
    return (
        <>
            <AppBar sx={(theme) => ({
                boxShadow: 0,
                mt: theme.spacing(2),
            })} position='relative' color='inherit'>
                <Container maxWidth="lg">
                    <StyledToolbar variant="dense" disableGutters>
                        <Stack textAlign='center'>
                            <Typography variant='h4' color='primary' fontWeight='700'
                                        component='span'>ProConnectX</Typography>
                            <Typography variant='body1' fontSize='0.75rem'
                                        component='span'>{t('platform.slogan')}</Typography>
                        </Stack>
                    </StyledToolbar>
                </Container>
            </AppBar>
            <Container maxWidth='xl' sx={{pt: 4}}>
                <Grid container spacing={4}>
                    <Grid size={12}>
                        <Typography variant="h2" component='h1'>{title}</Typography>
                    </Grid>
                    <Grid size={12}>
                        <Outlet/>
                    </Grid>
                </Grid>
            </Container>
        </>

    );
};

export default LayoutWithTitle;