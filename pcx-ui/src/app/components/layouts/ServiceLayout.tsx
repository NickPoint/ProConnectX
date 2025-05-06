import {Outlet} from 'react-router-dom';
import ServiceHeader from "../headers/ServiceHeader.tsx";
import DekstopHeader from "../headers/DesktopHeader.tsx";
import {useTheme} from "@mui/material/styles";
import {useMediaQuery} from "@mui/material";
import Footer from "../Footer.tsx";
import Container from "@mui/material/Container";

const ServiceLayout = () => {
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.up('md'));

    return (
        <>
            {matches ? <DekstopHeader /> : <ServiceHeader />}
            {matches ?
                <Container maxWidth='lg' sx={{pt: 2, pb: 2}}>
                    <Outlet/>
                </Container>
                : <Outlet/>
            }
            {matches && <Footer />}
        </>
    );
};

export default ServiceLayout;