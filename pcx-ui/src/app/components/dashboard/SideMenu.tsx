import * as React from 'react';
import {useState} from 'react';
import {styled} from '@mui/material/styles';
import Avatar from '@mui/material/Avatar';
import MuiDrawer, {drawerClasses} from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import MenuContent from './MenuContent';
import {useGetCurrentUserQuery} from "../../../features/api/pcxApi.ts";
import {AccountDropdown} from "../UserMenu.tsx";
import MenuButton from "./MenuButton.tsx";
import MoreVertRoundedIcon from "@mui/icons-material/MoreVertRounded";

const drawerWidth = 240;

const Drawer = styled(MuiDrawer)({
    width: drawerWidth,
    flexShrink: 0,
    boxSizing: 'border-box',
    mt: 10,
    [`& .${drawerClasses.paper}`]: {
        width: drawerWidth,
        boxSizing: 'border-box',
    },
});

export default function SideMenu() {
    const {data: user} = useGetCurrentUserQuery();
    const [accountDropdown, setAccountDropdown] = useState<null | HTMLElement>(null);

    return (
        <Drawer
            variant="permanent"
            sx={{
                display: {xs: 'none', md: 'block'},
                [`& .${drawerClasses.paper}`]: {
                    backgroundColor: 'background.paper',
                },
            }}
        >
            <Divider/>
            <Box
                sx={{
                    overflow: 'auto',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                }}
            >
                <MenuContent/>
            </Box>
            <Stack
                direction="row"
                sx={{
                    p: 2,
                    gap: 1,
                    alignItems: 'center',
                    borderTop: '1px solid',
                    borderColor: 'divider',
                }}
            >
                <Avatar
                    sizes="small"
                    alt={user?.firstName}
                    src={user?.avatarImageUrl}
                    sx={{width: 36, height: 36}}
                />
                <Box sx={{mr: 'auto'}}>
                    {user?.firstName && user?.lastName &&
                        <Typography variant="body2" sx={{fontWeight: 500, lineHeight: '16px'}}>
                            {`${user.firstName} ${user.lastName}`}
                        </Typography>
                    }
                    <Typography variant="caption" sx={{color: 'text.secondary'}}>
                        {user?.email}
                    </Typography>
                </Box>
                <MenuButton
                    aria-label="Open menu"
                    onClick={(event) => setAccountDropdown(event.currentTarget)}
                    sx={{ borderColor: 'transparent' }}
                >
                    <MoreVertRoundedIcon />
                </MenuButton>
                <AccountDropdown open={accountDropdown}
                                 onClose={() => setAccountDropdown(null)}
                                 anchorOrigin={{vertical: 'top', horizontal: 'center'}}
                                 transformOrigin={{vertical: 'bottom', horizontal: 'center'}}/>
            </Stack>
        </Drawer>
    );
}
