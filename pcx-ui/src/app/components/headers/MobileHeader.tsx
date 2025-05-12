import {AppBar, Box, Slide, Stack, Toolbar, Typography, useScrollTrigger} from "@mui/material";
import {useLocation, useNavigate} from "react-router-dom";
import {useEffect} from "react";
import {useAppDispatch} from "../../hooks";
import {styled} from "@mui/material/styles";
import FabContainer from "../FabContainer.tsx";
import FabManager from "../FabManager.tsx";
import {addFab, removeFab} from "../../../features/fab/fabSlice.ts";
import {useGetCurrentUserQuery} from "../../../features/api/pcxApi.ts";
import AuthDialog from "../../pages/AuthDialog.tsx";
import {useTranslation} from "react-i18next";
import UserMenu from "../UserMenu.tsx";

const StyledToolbar = styled(Toolbar)(({theme}) => ({
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    minHeight: theme.spacing(10)
}))

const HideOnScroll = (props) => {
    const trigger = useScrollTrigger();
    const triggerTop = useScrollTrigger({
        disableHysteresis: true,
        threshold: 100,
    });
    const dispatch = useAppDispatch();

    useEffect(() => {
        if (triggerTop) {
            dispatch(addFab({id: 'scrollUp', fabProps: {size: 'small'}, visible: true, icon: 'scrollUp'}));
        } else {
            dispatch(removeFab('scrollUp'));
        }
    }, [triggerTop, dispatch]);

    return (
        <Slide appear={false} direction="down" in={!trigger}>
            {props.children ?? <div/>}
        </Slide>
    );
}

const MobileHeader = () => {
    const {data: user} = useGetCurrentUserQuery();
    const location = useLocation();
    const navigate = useNavigate();
    const {t} = useTranslation();

    return (<>
        <HideOnScroll>
            <AppBar color='inherit' variant='transparent'>
                <StyledToolbar>
                        {/*TODO: Add status for freelancers*/}
                    {!user &&
                        <Stack sx={{cursor: 'pointer'}} onClick={() => navigate('/')}>
                            <Typography variant='h4' color='primary' fontWeight='700'
                                        component='span'>ProConnectX</Typography>
                            <Typography variant='body1' fontSize='0.75rem'
                                        component='span'>{t('platform.slogan')}</Typography>
                        </Stack>
                    }
                    <Box sx={{alignItems: 'flex-start'}}>
                        {user &&
                            <>
                                <Typography variant='h6'>
                                    {t(`header.user.greeting`, {firstName: user?.activeProfile.displayName.split(' ')[0]})}
                                </Typography>
                                {user.status &&
                                    <Typography variant='body2'>{t(`header.user.status.${user.status}`)}</Typography>
                                }
                            </>
                        }
                    </Box>
                    <UserMenu />
                </StyledToolbar>
            </AppBar>
        </HideOnScroll>
        <StyledToolbar/>
        <FabManager/>
        <FabContainer/>
        {location.pathname !== '/auth' && <AuthDialog/>}
    </>);
}

export default MobileHeader;