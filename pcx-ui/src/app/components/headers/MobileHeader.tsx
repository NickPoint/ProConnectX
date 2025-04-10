import {
    AppBar,
    Avatar,
    Box,
    Container,
    IconButton,
    Menu,
    MenuItem,
    Slide, Stack,
    Toolbar,
    Tooltip,
    Typography,
    useScrollTrigger
} from "@mui/material";
import {Link as RouterLink, useLocation, useNavigate} from "react-router-dom";
import {MouseEvent, useEffect, useState} from "react";
import {useAppDispatch, useAppSelector} from "../../hooks";
import {selectUser} from "../../../features/auth/authSlice";
import {useLogoutUserMutation} from "../../../features/api/authApi";
import {styled} from "@mui/material/styles";
import FabContainer from "../FabContainer.tsx";
import FabManager from "../FabManager.tsx";
import {addFab, hideFab, removeFab} from "../../../features/fab/fabSlice.ts";
import {Notifications} from "@mui/icons-material";
import Notification from "../Notification.tsx";
import {useGetCurrentUserQuery} from "../../../features/api/pcxApi.ts";

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
    const [userMenuOpen, setUserMenuOpen] = useState<null | HTMLElement>(null);
    const [logoutUser] = useLogoutUserMutation();
    const navigate = useNavigate();

    const handleClick = (event: MouseEvent<HTMLElement>) => {
        switch (event.currentTarget.textContent) {
            case 'Profile':
                navigate('/profile');
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
                                        <Typography onClick={handleClick}
                                                    sx={{
                                                        textAlign: "center"
                                                    }}>
                                            {setting}
                                        </Typography>
                                    </MenuItem>
                                ))}
                            </Menu>
                            <Box sx={{alignItems: 'flex-start'}}>
                                <Typography align='left' variant='h6'>Hi, {user?.firstName}</Typography>
                                <Typography align='left' variant='body2'>Available for new projects</Typography>
                            </Box>
                            <Stack direction='row' spacing={1}>
                                <Notification/>
                                <Tooltip title="Open settings">
                                    <IconButton onClick={(event) => setUserMenuOpen(event.currentTarget)}
                                                sx={{p: 0, mr: 1}}>
                                        <Avatar alt="Remy Sharp" src="/static/images/avatar/2.jpg"/>
                                    </IconButton>
                                </Tooltip>
                            </Stack>

                        </>
                    ) : (
                        <Box>
                            <Typography
                                sx={{color: 'inherit', textDecoration: 'none', mr: 2}}
                                variant='body1'
                                component={RouterLink}
                                state={{from: location}}
                                to="/login">Log in</Typography>
                            <Typography
                                sx={{color: 'inherit', textDecoration: 'none'}}
                                variant='body1'
                                component={RouterLink}
                                state={{from: location}}
                                to="/signup">Sign up</Typography>
                        </Box>
                    )}
                    {/*                    <Box sx={{flexGrow: 1, display: {xs: 'none', md: 'flex'}}}>
                        <Typography
                            variant="h6"
                            noWrap
                            component={RouterLink}
                            sx={{
                                fontWeight: 700,
                                color: 'inherit',
                                textDecoration: 'none',
                            }}
                            to="/"
                        >
                            ProConnectX
                        </Typography>
                    </Box>*/}
                </StyledToolbar>
            </AppBar>
        </HideOnScroll>
        <StyledToolbar/>
        <FabManager/>
        <FabContainer/>
    </>);
}

export default MobileHeader;