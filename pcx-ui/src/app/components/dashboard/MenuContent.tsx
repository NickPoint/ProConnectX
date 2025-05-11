import * as React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Stack from '@mui/material/Stack';
import {ArrowBack, HomeRounded, Work} from '@mui/icons-material';
import AssignmentRoundedIcon from '@mui/icons-material/AssignmentRounded';
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded';
import {useTranslation} from 'react-i18next';
import {useLocation, useNavigate} from "react-router-dom";
import {ProfileType, useGetCurrentUserQuery} from "../../../features/api/pcxApi.ts";

export default function MenuContent() {
    const {data: user} = useGetCurrentUserQuery();
    const navigate = useNavigate();
    const location = useLocation();
    const {t} = useTranslation();

    const mainListItems = [
        {
            label: 'home',
            icon: <HomeRounded />,
            onClick: () => navigate('/dashboard/home'),
            display: true,
        },
        {
            label: 'orders',
            icon: <AssignmentRoundedIcon/>,
            onClick: () => navigate('/dashboard/orders'),
            display: ProfileType.RoleUnverified !== user?.activeProfile,
        },
        {
            label: 'services',
            icon: <Work/>,
            onClick: () => navigate('/dashboard/services'),
            display: ProfileType.Freelancer === user?.activeProfile.profileType,
        },
    ];

    const secondaryListItems = [
        {
            label: 'settings',
            icon: <SettingsRoundedIcon/>,
            onClick: () => navigate('/dashboard/settings'),
            display: user && [ProfileType.Freelancer, ProfileType.Client].includes(user?.activeProfile)
        },
        {
            label: 'exitDashboard',
            icon: <ArrowBack />,
            onClick: () => navigate('/'),
            display: true,
        },
    ];

    return (
        <Stack sx={{flexGrow: 1, p: 1, justifyContent: 'space-between'}}>
            <List dense>
                {mainListItems.map(({label, icon, onClick, display}, index) => (
                    display &&
                    <ListItem key={index} disablePadding sx={{display: 'block'}}>
                        <ListItemButton onClick={onClick}
                                        selected={location.pathname === `/dashboard/${label}`}>
                            <ListItemIcon>{icon}</ListItemIcon>
                            <ListItemText primary={t(`dashboard.menu.${label}.title`)}/>
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
            <List dense>
                {secondaryListItems.map(({label, icon, onClick, display}, index) => (
                    display &&
                    <ListItem key={index} disablePadding sx={{display: 'block'}}>
                        <ListItemButton onClick={onClick}
                                        selected={location.pathname === `/dashboard/${label}`}>
                            <ListItemIcon>{icon}</ListItemIcon>
                            <ListItemText primary={t(`dashboard.menu.${label}.title`)}/>
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </Stack>
    );
}
