import {AppBar, Box, IconButton, Toolbar, Typography, useScrollTrigger} from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import {useAppSelector} from "../../hooks";
import {selectPageTitle} from "../../../features/header/headerSlice";
import {useNavigate} from "react-router-dom";

const ServiceHeader = () => {
    const pageTitle = useAppSelector(selectPageTitle);
    const navigate = useNavigate();
    const scrollTrigger = useScrollTrigger({
        threshold: 300,
    });

    return (
        <AppBar color='transparent'>
            <Toolbar disableGutters sx={{
                position: 'fixed',
                top: 0,
                width: '100%',
                color: 'white',
                backgroundColor: (theme) => scrollTrigger ? theme.palette.primary.main : 'inherit',
                transition: 'background-color 0.2s',
            }}>
                <IconButton sx={{flexBasis: '10%'}} onClick={() => navigate('/services')}>
                    <ChevronLeftIcon sx={{color: 'white'}}/>
                </IconButton>
                <Typography variant='h6' component='h1' sx={{
                    flexBasis: '90%'
                }}>{pageTitle}</Typography>
            </Toolbar>
        </AppBar>
    );
}

export default ServiceHeader;