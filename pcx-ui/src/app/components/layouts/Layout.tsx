import {Outlet} from 'react-router-dom';
import Footer from '../Footer';
import MobileHeader from "../headers/MobileHeader.tsx";
import Grid from "@mui/material/Grid2";
import Container from "@mui/material/Container";

const Layout = () => {
    return (
        <>
            <MobileHeader />
            <Container maxWidth='xl' sx={{p: 2}}>
                <Outlet/>
            </Container>
            <Footer/>
        </>
    );
};

export default Layout;