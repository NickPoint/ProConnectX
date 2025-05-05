import {Notifications} from "@mui/icons-material";
import {Badge, Divider, IconButton, List, ListItem, ListItemAvatar, ListItemText, Popover} from "@mui/material";
import {useState} from "react";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import {NotificationDto, useGetNotificationsQuery} from "../../features/api/enhancedApi";
import {RoleType, useGetCurrentUserQuery} from "../../features/api/pcxApi.ts";
import {useAppSelector} from "../hooks.ts";
import {getNotifications} from "../../features/notifications/notificationSlice.ts";
import {useTranslation} from "react-i18next";
import {t} from "i18next";
import {useNavigate} from "react-router-dom";

function getChannelByActiveRole(activeRole: RoleType) {
    switch (activeRole) {
        case RoleType.RoleAdmin:
            return "admin"
        case RoleType.RoleFreelancer:
            return "freelancer"
        case RoleType.RoleClient:
            return "client"
        case RoleType.RoleUnverified:
            return "unverified"
        default:
            return "general"
    }
}

// const routeMap = {
//     REGISTRATION_REQUEST: (id: number) => `/admin/registration-requests/${id}`,
//     ORDER: (id: number) => `/orders/${id}`,
//     SERVICE: (id: number) => `/services/${id}`,
// };
//
// function handleNotificationClick(notification: NotificationDto) {
//     const routeFunc = routeMap[notification.target.type];
//     if (routeFunc) {
//         navigate(routeFunc(notification.target.entityId));
//     }
// }

function handleNotification(notification: NotificationDto, navigate: (path: string) => void) {
    switch (notification.type) {
        case "REGISTRATION_REQUEST":
            return {
                primary: t(`notifications.${item.type}.title`),
                secondary: t(`notifications.${item.type}.description`),
                onClick: () => navigate(`/dashboard/home`)
            };
        default:
            return {}
    }
}

const Notification = () => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLButtonElement>(null);
    const {t} = useTranslation();
    const open = Boolean(anchorEl);
    const {data: user} = useGetCurrentUserQuery();
    useGetNotificationsQuery(`notifications/${getChannelByActiveRole(user?.activeRole)}`)
    const notifications = useAppSelector(getNotifications);
    const navigate = useNavigate();

    return (
        <>
            <IconButton onClick={(event) => setAnchorEl(event.currentTarget)}>
                <Badge color="primary" badgeContent={notifications?.length}>
                    <Notifications/>
                </Badge>
            </IconButton>
            <Popover open={open}
                     anchorEl={anchorEl}
                     onClose={() => {
                         setAnchorEl(null)
                     }}
                     anchorOrigin={{
                         vertical: 'bottom',
                         horizontal: 'center',
                     }}
                     transformOrigin={{
                         vertical: 'top',
                         horizontal: 'right',
                     }}>
                <List>
                    {notifications?.map((item, index) => {
                        const {primary, secondary, onClick} = handleNotification(item, navigate)
                        return (<Box key={index} onClick={onClick}>
                            <ListItem>
                                <ListItemAvatar>
                                    <Avatar alt={item.payload.data.name} src={item.payload.data.avatarImageUrl}/>
                                </ListItemAvatar>
                                <ListItemText primary={primary}
                                              secondary={
                                                  <>
                                                      <Typography
                                                          component="span"
                                                          variant="body2"
                                                          sx={{color: 'text.primary', display: 'inline'}}
                                                      >
                                                          {secondary}
                                                      </Typography>
                                                  </>
                                              }/>
                            </ListItem>
                            <Divider variant="inset" component="li"/>
                        </Box>);
                    })}
                    {notifications?.length === 0 &&
                        <ListItem><ListItemText>There is nothing to show</ListItemText></ListItem>}
                </List>
            </Popover>
        </>
    );
}

export default Notification;