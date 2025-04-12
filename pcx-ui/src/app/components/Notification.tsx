import {Notifications} from "@mui/icons-material";
import {Divider, IconButton, List, ListItem, ListItemAvatar, ListItemText, Popover} from "@mui/material";
import {useEffect, useRef, useState} from "react";
import {useGetNotificationsQuery} from "../../features/api/enhancedApi";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import {Client, Stomp} from "@stomp/stompjs";
import SockJS from "sockjs-client";
import Box from "@mui/material/Box";

const Notification = () => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLButtonElement>(null);
    const open = Boolean(anchorEl);
    const [connected, setConnected] = useState(false);
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        const socket = new SockJS(`${import.meta.env.VITE_API_URL}/api/ws`);
        const stompClient = new Client({
            webSocketFactory: () => socket,
            reconnectDelay: 5000,
            debug: (str) => console.log(str),
        });

        stompClient.onConnect = (frame) => {
            console.log('Connected: ' + frame);
            // stompClient.subscribe('/topic/notifications', (message) => {
            //     console.log('Received:', message.body);
            // });
        };

        stompClient.activate();
    }, []);

    return (
        <>
            <IconButton onClick={(event) => setAnchorEl(event.currentTarget)}>
                <Notifications/>
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
                    {/*//make three copies of elements*/}
                    {Array(3).fill(0).map((item, index) => (
                        <Box key={index}>
                            <ListItem>
                                <ListItemAvatar>
                                    <Avatar/>
                                </ListItemAvatar>
                                <ListItemText primary={"New Order!🔥"}
                                              secondary={
                                                  <>
                                                      <Typography
                                                          component="span"
                                                          variant="body2"
                                                          sx={{color: 'text.primary', display: 'inline'}}
                                                      >
                                                          Client Client
                                                      </Typography>
                                                      {" — Hi, i would like to create a new website for..."}
                                                  </>
                                              }/>
                            </ListItem>
                            <Divider variant="inset" component="li"/>
                        </Box>
                    ))}
                </List>
            </Popover>
        </>
    );
}

export default Notification;