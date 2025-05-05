import * as React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Stack from '@mui/material/Stack';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import AnalyticsRoundedIcon from '@mui/icons-material/AnalyticsRounded';
import PeopleRoundedIcon from '@mui/icons-material/PeopleRounded';
import AssignmentRoundedIcon from '@mui/icons-material/AssignmentRounded';
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded';
import {AppRegistration} from '@mui/icons-material';
import {useTranslation} from 'react-i18next';
import {useAppDispatch, useAppSelector} from "../../hooks.ts";
import { setActiveTab, selectActiveTab } from '../../../features/dashboard/dashboardSlice.ts';
import {useLocation, useNavigate} from "react-router-dom";
import {useEffect} from "react";

const mainListItems = [
    {text: 'home', icon: <HomeRoundedIcon/>},
    {text: 'orders', icon: <AssignmentRoundedIcon/>},
];

const secondaryListItems = [
    {text: 'settings', icon: <SettingsRoundedIcon/>}
];

export default function MenuContent() {
    const navigate = useNavigate();
    const location = useLocation();
    const {t} = useTranslation();

    return (
        <Stack sx={{flexGrow: 1, p: 1, justifyContent: 'space-between'}}>
            <List dense>
                {mainListItems.map((item, index) => (
                    <ListItem key={index} disablePadding sx={{display: 'block'}}>
                        <ListItemButton onClick={() => navigate(item.text)}
                                        selected={location.pathname === `/dashboard/${item.text}`}>
                            <ListItemIcon>{item.icon}</ListItemIcon>
                            <ListItemText primary={t(`dashboard.menu.${item.text}.title`)}/>
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
            <List dense>
                {secondaryListItems.map((item, index) => (
                    <ListItem key={index} disablePadding sx={{display: 'block'}}>
                        <ListItemButton onClick={() => navigate(item.text)}
                                        selected={location.pathname === `/dashboard/${item.text}`}>
                            <ListItemIcon>{item.icon}</ListItemIcon>
                            <ListItemText primary={t(`dashboard.menu.${item.text}.title`)}/>
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </Stack>
    );
}
