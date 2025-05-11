import React, {useState} from 'react';
import {
    Avatar,
    Button,
    IconButton,
    Link,
    ListItemIcon,
    Menu,
    MenuItem,
    PopoverOrigin,
    Stack,
    Tooltip,
    Typography
} from '@mui/material';
import {AccountCircle, Logout, SwitchAccount, VerifiedUser} from '@mui/icons-material';
import {useLocation, useNavigate} from 'react-router-dom';
import {useTranslation} from 'react-i18next';
import {
    ProfileStatus,
    ProfileType,
    useGetCurrentUserQuery,
    useLogoutMutation,
    useSwitchProfileMutation
} from '../../features/api/pcxApi';
import {AddAccountDialog} from "../pages/AuthDialog.tsx";
import Notification from "./Notification.tsx";
import {setOpen, setSignup} from "../../features/signupDialog/authFormSlice.ts";
import {useAppDispatch} from "../hooks.ts";


interface AccountDropdownProps {
    open: HTMLElement | null;
    onClose: () => void;
    anchorOrigin?: PopoverOrigin;
    transformOrigin?: PopoverOrigin;
}

export const AccountDropdown: React.FC<AccountDropdownProps> = ({
                                                                    open,
                                                                    onClose,
                                                                    anchorOrigin = {vertical: 'bottom', horizontal: 'center'},
                                                                    transformOrigin = {vertical: 'top', horizontal: 'right'},
}) => {
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
    const oppositeProfile = user?.activeProfile.profileType === ProfileType.Freelancer ? ProfileType.Client : ProfileType.Freelancer;

    const menuConfig = [
        {
            icon: <AccountCircle/>,
            label: t('header.menu.dashboard'),
            onClick: () => navigate('/dashboard/home'),
            display: !/\/dashboard\/.*/.test(location.pathname)
        },
        {
            icon: <VerifiedUser />,
            label: t('header.menu.verify', {profileType: t(`enum.profileType.${ProfileType.Freelancer}`)}),
            onClick: () => navigate('/freelancer-verification'),
            display: pendingFreelancerAccount
        },
        {
            icon: <VerifiedUser />,
            label: t('header.menu.verify', {profileType: t(`enum.profileType.${ProfileType.Client}`)}),
            onClick: () => navigate('/client-verification'),
            display: pendingClientAccount
        },
        {
            icon: <SwitchAccount/>,
            label: t('header.menu.switchAccount', {profileType: t(`enum.profileType.${oppositeAccount}`)}),
            onClick: () => switchProfile({newProfileType: oppositeProfile}),
            display: user?.allProfiles.find(profile => profile.profileType === oppositeAccount)?.status === ProfileStatus.Active,
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
            <Menu
                anchorEl={open}
                anchorOrigin={anchorOrigin}
                keepMounted
                transformOrigin={transformOrigin}
                open={Boolean(open)}
                onClose={onClose}
            >
                {menuConfig.map(({label, onClick, icon, display}, index) =>
                        display && (
                            <MenuItem
                                key={index}
                                onClick={() => {
                                    onClose();
                                    onClick();
                                }}
                            >
                                <ListItemIcon>{icon}</ListItemIcon>
                                <Typography>{label}</Typography>
                            </MenuItem>
                        )
                )}
            </Menu>

            <AddAccountDialog open={addAccountOpen} onClose={() => setAddAccountOpen(false)}/>
        </>
    );
}

const UserMenu = () => {
    const {data: user} = useGetCurrentUserQuery();
    const dispatch = useAppDispatch();
    const [profileDropdown, setAccountDropdown] = useState<null | HTMLElement>(null);
    const {t} = useTranslation();

    return (
        user ?
            <>
                <AccountDropdown open={profileDropdown} onClose={() => setAccountDropdown(null)} />
                <Stack direction="row" spacing={1}>
                    <Notification/>
                    <Tooltip title={t('header.menu.openMenu')}>
                        <IconButton onClick={(event) => setAccountDropdown(event.currentTarget)} sx={{p: 0, mr: 1}}>
                            <Avatar alt={user?.activeProfile.displayName} src={user?.avatarUrl}/>
                        </IconButton>
                    </Tooltip>
                </Stack>

            </>
            : (location.pathname !== '/auth' &&
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
            )
    );
};

export default UserMenu;