import * as React from 'react';
import {alpha} from '@mui/material/styles';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import AppNavbar from '../components/dashboard/AppNavbar';
import Header from '../components/dashboard/Header';
import DashboardOverviewTab from '../components/dashboard/DashboardOverviewTab.tsx';
import SideMenu from '../components/dashboard/SideMenu';
import { selectActiveTab } from '../../features/dashboard/dashboardSlice';
import { useAppSelector } from '../hooks';
import RegistrationRequestTab from "../components/dashboard/RegistrationRequestTab.tsx";
import { Outlet } from 'react-router-dom';

export default function Dashboard(props: { disableCustomTheme?: boolean }) {
    return (
        <Box sx={{display: 'flex'}}>
            <SideMenu/>
            <AppNavbar/>
            <Box
                component="main"
                sx={(theme) => ({
                    flexGrow: 1,
                    backgroundColor: theme.vars
                        ? `rgba(${theme.vars.palette.background.defaultChannel} / 1)`
                        : alpha(theme.palette.background.default, 1),
                    overflow: 'auto',
                })}
            >
                <Stack
                    spacing={2}
                    sx={{
                        mx: 3,
                        pb: 5,
                        mt: {xs: 8, md: 0},
                    }}
                >
                    <Header/>
                    <Outlet />
                </Stack>
            </Box>
        </Box>
    );
}
