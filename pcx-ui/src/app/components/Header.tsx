import {
    Avatar,
    BottomNavigation,
    BottomNavigationAction, Paper,
} from '@mui/material';
import {useAppDispatch, useAppSelector} from "../hooks";
import HomeIcon from '@mui/icons-material/Home';
import PeopleIcon from '@mui/icons-material/People';
import WorkIcon from '@mui/icons-material/Work';
import SearchIcon from '@mui/icons-material/Search';
import {selectActiveTab, setActiveTab} from "../../features/header/headerSlice";
import * as React from "react";
import {
    Link as RouterLink,
} from "react-router-dom";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";

const Header = () => {
    const dispatch = useAppDispatch();
    const activeTab = useAppSelector(selectActiveTab);

    return (
        <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }} elevation={3}>
                <BottomNavigation value={activeTab}
                                  onChange={(event, value) => dispatch(setActiveTab(value))}>
                    <BottomNavigationAction
                        label="Home"
                        value="home"
                        icon={<HomeIcon />}
                        component={RouterLink}
                        to="/" />
                    <BottomNavigationAction
                        label="Services"
                        value="services"
                        icon={<SearchIcon />}
                        component={RouterLink}
                        to="/testpage" />
                    <BottomNavigationAction
                        label="Work"
                        value="work"
                        icon={<WorkIcon />}
                        component={RouterLink}
                        to="/work" />
                    <BottomNavigationAction
                        label="Freelancers"
                        value="freelancer"
                        icon={<PeopleIcon />}
                        component={RouterLink}
                        to="/freelancers" />
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
        </Paper>
    );
};

export default Header;