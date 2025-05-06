import {Avatar, Box, IconButton, Menu, MenuItem, Tooltip, Typography} from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import * as React from "react";
import {MouseEvent, useState} from "react";
import {styled} from "@mui/material/styles";
import {useAppSelector} from "../../hooks";
import {selectPageTitle} from "../../../features/header/headerSlice";
import {Link as RouterLink, useLocation, useNavigate} from "react-router-dom";
import {selectUser} from "../../../features/auth/authSlice";
import {useLogoutUserMutation} from "../../../features/api/pcxApi";

const StyledToolbar = styled('div')(({theme}) => ({
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    justifyContent: 'flex-start',
}));

const settings = ['Profile', 'Logout'];

const Header2 = () => {
    const user = useAppSelector(selectUser);
    const pageTitle = useAppSelector(selectPageTitle);
    const navigate = useNavigate();
    const location = useLocation();
    const [userMenuOpen, setUserMenuOpen] = useState<null | HTMLElement>(null);
    const [logoutUser] = useLogoutUserMutation();

    const handleClick = (event: MouseEvent<HTMLElement>) => {
        switch (event.currentTarget.textContent) {
            case 'Profile':
                console.log('Profile clicked');
                break;
            case 'Logout':
                logoutUser();
                break
            default:
                console.log('Unknown action');
        }
    }

    return (
        (<StyledToolbar disableGutters>
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    flexBasis: '10%'
                }}>
                <IconButton onClick={() => navigate(-1)}>
                    <ChevronLeftIcon/>
                </IconButton>
            </Box>
            <Typography variant='h6' component='h1' sx={{
                flexBasis: '80%'
            }}>{pageTitle}</Typography>
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    flexBasis: '10%'
                }}>
                {user ? (
                    <>
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
                            to="/auth">Log in</Typography>
                        <Typography
                            sx={{color: 'inherit', textDecoration: 'none'}}
                            variant='body1'
                            component={RouterLink}
                            state={{from: location}}
                            to="/auth">Sign up</Typography>
                    </Box>
                )}
            </Box>
        </StyledToolbar>)
    );
}

export default Header2;