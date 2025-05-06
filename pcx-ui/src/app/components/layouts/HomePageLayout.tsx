import {Outlet} from 'react-router-dom';
import Footer from '../Footer';
import MobileHeader from "../headers/MobileHeader.tsx";
import {useTheme} from "@mui/material/styles";
import {useMediaQuery} from "@mui/material";
import DekstopHeader from "../headers/DesktopHeader.tsx";

const Layout = () => {
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.up('md'));

    return (
        <>
            {matches ? <DekstopHeader /> : <MobileHeader />}
            <Outlet/>
            <Footer/>
        </>
    );
};

export default Layout;