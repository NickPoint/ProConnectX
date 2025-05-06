import {AppBar, Slide, Stack, Toolbar, Typography, useScrollTrigger} from "@mui/material";
import {useLocation, useNavigate} from "react-router-dom";
import {useEffect} from "react";
import {useAppDispatch} from "../../hooks";
import {styled} from "@mui/material/styles";
import FabContainer from "../FabContainer.tsx";
import FabManager from "../FabManager.tsx";
import {addFab, removeFab} from "../../../features/fab/fabSlice.ts";
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
    const location = useLocation();

    useEffect(() => {
        if (triggerTop && location.pathname === "/services") {
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

const DesktopHeader = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const {t} = useTranslation();

    return (<>
        <HideOnScroll>
            <AppBar color='inherit' variant='transparent'>
                <StyledToolbar>
                    <Stack sx={{cursor: 'pointer'}} onClick={() => navigate('/')}>
                        <Typography variant='h4' color='primary' fontWeight='700'
                                    component='span'>ProConnectX</Typography>
                        <Typography variant='body1' fontSize='0.75rem'
                                    component='span'>{t('platform.slogan')}</Typography>
                    </Stack>
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

export default DesktopHeader;