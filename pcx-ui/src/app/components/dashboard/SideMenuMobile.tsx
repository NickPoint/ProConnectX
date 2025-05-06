import {useState} from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Drawer, {drawerClasses} from '@mui/material/Drawer';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import NotificationsRoundedIcon from '@mui/icons-material/NotificationsRounded';
import MenuButton from './MenuButton';
import MenuContent from './MenuContent';
import {
    AccountStatus,
    AccountType,
    RoleType,
    useGetCurrentUserQuery,
    useLogoutUserMutation,
    useSwitchRoleMutation
} from "../../../features/api/pcxApi.ts";
import {useLocation, useNavigate} from "react-router-dom";
import {useTranslation} from "react-i18next";
import {AccountCircle, Logout, SwitchAccount, VerifiedUser} from "@mui/icons-material";

interface SideMenuMobileProps {
    open: boolean | undefined;
    toggleDrawer: (newOpen: boolean) => () => void;
}

export default function SideMenuMobile({open, toggleDrawer}: SideMenuMobileProps) {
    const {data: user} = useGetCurrentUserQuery();
    const [logoutUser] = useLogoutUserMutation();
    const [switchRole] = useSwitchRoleMutation();
    const [addAccountOpen, setAddAccountOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const {t} = useTranslation();

    const oppositeAccount = user?.activeRole === RoleType.RoleFreelancer ? AccountType.Client : AccountType.Freelancer;
    const pendingFreelancerAccount = user?.accounts.find(account => account.accountType === AccountType.Freelancer && account.accountStatus === AccountStatus.Unverified);
    const pendingClientAccount = user?.accounts.find(account => account.accountType === AccountType.Client && account.accountStatus === AccountStatus.Unverified);
    const oppositeRole = user?.activeRole === RoleType.RoleFreelancer ? RoleType.RoleClient : RoleType.RoleFreelancer;

    const buttonConfig = [
        {
            icon: <AccountCircle/>,
            label: t('header.menu.dashboard'),
            onClick: () => navigate('/dashboard/home'),
            display: !/\/dashboard\/.*/.test(location.pathname)
        },
        {
            icon: <VerifiedUser/>,
            label: t('header.menu.verify', {accountType: t(`enum.accountType.${AccountType.Freelancer}`)}),
            onClick: () => navigate('/freelancer-verification'),
            display: pendingFreelancerAccount
        },
        {
            icon: <VerifiedUser/>,
            label: t('header.menu.verify', {accountType: t(`enum.accountType.${AccountType.Client}`)}),
            onClick: () => navigate('/client-verification'),
            display: pendingClientAccount
        },
        {
            icon: <SwitchAccount/>,
            label: t('header.menu.switchAccount', {accountType: t(`enum.accountType.${oppositeAccount}`)}),
            onClick: () => switchRole({role: oppositeRole}),
            display: user?.accounts.find(account => account.accountType === oppositeAccount)?.accountStatus === AccountStatus.Active,
        },
        {
            icon: <SwitchAccount/>,
            label: t('header.menu.addAnotherAccount'),
            onClick: () => setAddAccountOpen(true),
            display: user?.accounts.length === 1
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
                <Stack direction="row" sx={{p: 2, pb: 0, gap: 1}}>
                    <Stack
                        direction="row"
                        sx={{gap: 1, alignItems: 'center', flexGrow: 1, p: 1}}
                    >
                        <Avatar
                            sizes="small"
                            alt={user?.firstName}
                            src={user?.avatarImageUrl}
                            sx={{width: 24, height: 24}}
                        />
                        <Typography component="p" variant="h6">
                            {user?.firstName} {user?.lastName}
                        </Typography>
                    </Stack>
                    <MenuButton showBadge>
                        <NotificationsRoundedIcon/>
                    </MenuButton>
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
    );
}
