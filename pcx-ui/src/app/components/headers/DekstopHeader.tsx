import {
    AppBar,
    Avatar,
    Button,
    IconButton,
    Link,
    Menu,
    MenuItem,
    Slide,
    Stack,
    Toolbar,
    Tooltip,
    Typography,
    useScrollTrigger
} from "@mui/material";
import {useLocation, useNavigate} from "react-router-dom";
import {MouseEvent, useEffect, useState} from "react";
import {useAppDispatch} from "../../hooks";
import {styled} from "@mui/material/styles";
import FabContainer from "../FabContainer.tsx";
import FabManager from "../FabManager.tsx";
import {addFab, removeFab} from "../../../features/fab/fabSlice.ts";
import Notification from "../Notification.tsx";
import {RoleType, useGetCurrentUserQuery, useLogoutUserMutation} from "../../../features/api/pcxApi.ts";
import {setOpen, setSignup} from "../../../features/signupDialog/authFormSlice.ts";
import AuthDialog from "../../pages/AuthDialog.tsx";
import {useTranslation} from "react-i18next";

const settings = ['Profile', 'Logout'];

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

const MobileHeader = () => {
    const {data: user} = useGetCurrentUserQuery();
    const location = useLocation();
    const [userMenuOpen, setUserMenuOpen] = useState<null | HTMLElement>(null);
    const [logoutUser] = useLogoutUserMutation();
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const {t} = useTranslation();

    const handleClick = (event: MouseEvent<HTMLElement>) => {
        switch (event.currentTarget.textContent) {
            case 'Profile':
                navigate('/dashboard/home');
                break;
            case 'Logout':
                logoutUser();
                break
            default:
                console.log('Unknown action');
        }
    }

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
                    {user ? (
                        <>
                            <Menu
                                sx={{mt: '45px'}}
                                id="menu-appbar"
                                anchorEl={userMenuOpen}
                                anchorOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                keepMounted
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                open={Boolean(userMenuOpen)}
                                onClose={() => setUserMenuOpen(null)}
                            >
                                {settings.map((setting) => (
                                    <MenuItem key={setting} onClick={() => setUserMenuOpen(null)}>
                                        <Typography onClick={handleClick}>{setting}</Typography>
                                    </MenuItem>
                                ))}
                            </Menu>
                            <Stack direction='row' spacing={1}>
                                <Notification/>
                                <Tooltip title="Open settings">
                                    <IconButton onClick={(event) => setUserMenuOpen(event.currentTarget)}
                                                sx={{p: 0, mr: 1}}>
                                        <Avatar alt={user.firstName} src={user.avatarImageUrl}/>
                                    </IconButton>
                                </Tooltip>
                            </Stack>
                        </>
                    ) : (location.pathname !== 'auth' &&
                        <Stack direction='row' spacing={1} sx={{alignItems: 'center'}}>
                            <Link sx={{cursor: 'pointer'}} underline='none'
                                  onClick={() => {
                                      dispatch(setOpen(true))
                                      dispatch(setSignup(false))
                                  }}>
                                Sign in
                            </Link>
                            <Button variant='contained' onClick={() => {
                                dispatch(setOpen(true))
                                dispatch(setSignup(true))
                            }}>
                                Join
                            </Button>
                        </Stack>
                    )}
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