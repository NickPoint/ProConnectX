import {AppBar, Avatar, Box, Container, IconButton, Menu, MenuItem, Toolbar, Tooltip, Typography} from "@mui/material";
import {Link as RouterLink, useLocation, useNavigate} from "react-router-dom";
import {useState, MouseEvent} from "react";
import {useAppSelector} from "../../hooks";
import {selectUser} from "../../../features/auth/authSlice";
import {useLogoutUserMutation} from "../../../features/api/authApi";

const settings = ['Profile', 'Logout'];

const Header = () => {
    const user = useAppSelector(selectUser);
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
        <AppBar>
            <Container maxWidth='xl'>
                <Toolbar disableGutters>
                    <Box sx={{flexGrow: 1, display: {xs: 'none', md: 'flex'}}}>
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
                    </Box>
                    <Box
                        sx={{
                            display: 'flex',
                            flexGrow: 0,
                            alignItems: 'center'
                        }}>
                        {user ? (
                            <>
                                <Typography variant='h6' sx={{
                                    mr: 1
                                }}>Hi, {user?.firstName}</Typography>
                                <Tooltip title="Open settings">
                                    <IconButton onClick={(event) => setUserMenuOpen(event.currentTarget)}
                                                sx={{p: 0}}>
                                        <Avatar alt="Remy Sharp" src="/static/images/avatar/2.jpg"/>
                                    </IconButton>
                                </Tooltip>
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
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
        <Toolbar/>
    </>);
}

export default Header;