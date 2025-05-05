import {BottomNavigation, BottomNavigationAction, Paper, Toolbar,} from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import SearchIcon from '@mui/icons-material/Search';
import {Link as RouterLink, useLocation,} from "react-router-dom";
import Container from "@mui/material/Container";

const Footer = () => {
    const location = useLocation();

    return (
        <>
            <Toolbar/>
            <Container component={Paper} maxWidth='sm'
                       sx={{
                           position: 'fixed',
                           bottom: 0,
                           left: 0,
                           right: 0,
                           zIndex: 100,
                           borderBottomLeftRadius: 0,
                           borderBottomRightRadius: 0
                       }}>
                <BottomNavigation value={location.pathname.substring(1)}>
                    <BottomNavigationAction
                        label="Home"
                        value=""
                        icon={<HomeIcon/>}
                        component={RouterLink}
                        to="/"/>
                    <BottomNavigationAction
                        label="Services"
                        value="services"
                        icon={<SearchIcon/>}
                        component={RouterLink}
                        to="/services"/>
                    {/* <BottomNavigationAction
                        label="Projects"
                        value="projects"
                        icon={<WorkIcon/>}
                        component={RouterLink}
                        to="/projects"/>
                    <BottomNavigationAction
                        label="Freelancers"
                        value="freelancers"
                        icon={<PeopleIcon/>}
                        component={RouterLink}
                        to="/freelancers"/>*/}
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
            </Container>
        </>
    );
};

export default Footer;