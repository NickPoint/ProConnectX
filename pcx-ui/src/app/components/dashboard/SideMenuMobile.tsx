import React, {useState} from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Drawer, {drawerClasses} from '@mui/material/Drawer';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import MenuContent from './MenuContent';
import {
    ProfileStatus,
    ProfileType,
    useGetCurrentUserQuery,
    useLogoutMutation,
    useSwitchProfileMutation
} from "../../../features/api/pcxApi.ts";
import {useLocation, useNavigate} from "react-router-dom";
import {useTranslation} from "react-i18next";
import {AccountCircle, Logout, SwitchAccount, VerifiedUser} from "@mui/icons-material";
import {AddAccountDialog} from "../../pages/AuthDialog.tsx";
import Notification from "../Notification.tsx";

interface SideMenuMobileProps {
    open: boolean | undefined;
    toggleDrawer: (newOpen: boolean) => () => void;
}

export default function SideMenuMobile({open, toggleDrawer}: SideMenuMobileProps) {
    const {data: user} = useGetCurrentUserQuery();
    const [logoutUser] = useLogoutMutation();
    const [switchProfile] = useSwitchProfileMutation();
    const [addAccountOpen, setAddAccountOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const {t} = useTranslation();

    const oppositeAccount = user?.activeProfile.profileType === ProfileType.Freelancer ? ProfileType.Client : ProfileType.Freelancer;
    const pendingFreelancerAccount = user?.allProfiles.find(profile => profile.profileType === ProfileType.Freelancer && profile.status === ProfileStatus.Unverified);
    const pendingClientAccount = user?.allProfiles.find(profile => profile.profileType === ProfileType.Client && profile.status === ProfileStatus.Unverified);
    const oppositeRole = user?.activeProfile.profileType === ProfileType.Freelancer ? ProfileType.Client : ProfileType.Freelancer;

    const buttonConfig = [
        {
            icon: <AccountCircle/>,
            label: t('header.menu.dashboard'),
            onClick: () => navigate('/dashboard/home'),
            display: !/\/dashboard\/.*/.test(location.pathname)
        },
        {
            icon: <VerifiedUser/>,
            label: t('header.menu.verify', {profileType: t(`enum.profileType.${ProfileType.Freelancer}`)}),
            onClick: () => navigate('/freelancer-verification'),
            display: pendingFreelancerAccount && user?.activeProfile.profileType === ProfileType.Freelancer
        },
        {
            icon: <VerifiedUser/>,
            label: t('header.menu.verify', {profileType: t(`enum.profileType.${ProfileType.Client}`)}),
            onClick: () => navigate('/client-verification'),
            display: pendingClientAccount && user?.activeProfile.profileType === ProfileType.Client
        },
        {
            icon: <SwitchAccount/>,
            label: t('header.menu.switchAccount', {profileType: t(`enum.profileType.${oppositeAccount}`)}),
            onClick: () => switchProfile({newProfileType: oppositeRole}),
            display: user?.allProfiles.find(profile => profile.profileType === oppositeAccount)
        },
        {
            icon: <SwitchAccount/>,
            label: t('header.menu.addAnotherAccount'),
            onClick: () => setAddAccountOpen(true),
            display: user?.allProfiles.length === 1
        },
        {
            icon: <Logout/>,
            label: t('header.menu.logout'),
            onClick: () => {
                logoutUser();
            },
            display: true
        },
    ];

    return (
        <>
            <Drawer
                anchor="right"
                open={open}
                onClose={toggleDrawer(false)}
                sx={{
                    zIndex: (theme) => theme.zIndex.drawer + 1,
                    [`& .${drawerClasses.paper}`]: {
                        backgroundImage: 'none',
                        backgroundColor: 'background.paper',
                    },
                }}
            >
                <Stack
                    sx={{
                        maxWidth: '70dvw',
                        height: '100%',
                    }}
                >
                    <Stack direction="row" sx={{p: 1, pb: 0, gap: 1}}>
                        <Stack
                            direction="row"
                            sx={{gap: 1, alignItems: 'center', flexGrow: 1, p: 1}}
                        >
                            <Avatar
                                sizes="small"
                                alt={user?.activeProfile.displayName}
                                src={user?.avatarUrl}
                                sx={{width: 24, height: 24}}
                            />
                            <Typography component="p" variant="h6">
                                {user?.activeProfile.displayName}
                            </Typography>
                        </Stack>
                        <Notification />
                    </Stack>
                    <Divider/>
                    <Stack sx={{flexGrow: 1}}>
                        <MenuContent/>
                        <Divider/>
                    </Stack>
                    <Stack sx={{p: 2}} spacing={1}>
                        {buttonConfig.map(({label, onClick, icon, display}, index) =>
                            display && (
                                <Button key={index} onClick={onClick} variant="outlined"
                                        fullWidth startIcon={icon}>
                                    {label}
                                </Button>
                            )
                        )}
                    </Stack>
                </Stack>
            </Drawer>

            <AddAccountDialog open={addAccountOpen} onClose={() => setAddAccountOpen(false)}/>
        </>
    );
}
