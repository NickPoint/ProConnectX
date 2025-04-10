import {BottomNavigation, BottomNavigationAction, Paper, Toolbar,} from '@mui/material';
import {useAppDispatch, useAppSelector} from "../hooks";
import HomeIcon from '@mui/icons-material/Home';
import PeopleIcon from '@mui/icons-material/People';
import WorkIcon from '@mui/icons-material/Work';
import SearchIcon from '@mui/icons-material/Search';
import * as React from "react";
import {useEffect} from "react";
import {Link as RouterLink, useLocation,} from "react-router-dom";
import {selectUser} from "../../features/auth/authSlice";
import AddButton from "./AddButton";
import {useLogoutUserMutation} from "../../features/api/pcxApi";
import {selectAddButtonVisible, setAddButtonVisible} from "../../features/footer/footerSlice";


const Footer = () => {
    const dispatch = useAppDispatch();
    const user = useAppSelector(selectUser);
    const addButtonVisible = useAppSelector(selectAddButtonVisible);
    const location = useLocation();
    const [logoutUser] = useLogoutUserMutation();
    const showAddButtonPages = ['/projects', '/services'];

    useEffect(() => {
        if (showAddButtonPages.includes(location.pathname)) {
            dispatch(setAddButtonVisible(true));
        } else {
            dispatch(setAddButtonVisible(false));
        }
    }, [location, dispatch]);

    return (
        <>
            <Toolbar/>
            <Paper sx={{position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 100}} elevation={3}>
                <BottomNavigation value={location.pathname.substring(1)}>
                    <BottomNavigationAction
                        label="Home"
                        value=""
                        icon={<HomeIcon/>}
                        component={RouterLink}
                        to="/"/>
                    <BottomNavigationAction
                        label="Services"
                        value="services"
                        icon={<SearchIcon/>}
                        component={RouterLink}
                        to="/services"/>
                    <BottomNavigationAction
                        label="Projects"
                        value="projects"
                        icon={<WorkIcon/>}
                        component={RouterLink}
                        to="/projects"/>
                    <BottomNavigationAction
                        label="Freelancers"
                        value="freelancers"
                        icon={<PeopleIcon/>}
                        component={RouterLink}
                        to="/freelancers"/>
                    {/*                    <BottomNavigationAction
                        label="Log In"
                        value="login"
                        icon={
                        <Avatar>
                            <LockOutlinedIcon />
                        </Avatar>
                        }
                        component={RouterLink}
                        to="/login"
                    />*/}
                </BottomNavigation>
                {addButtonVisible && <AddButton/>}
            </Paper>
        </>
    );
};

export default Footer;