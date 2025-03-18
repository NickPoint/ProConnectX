import {Outlet} from 'react-router-dom';
import {Container} from "@mui/material";
import Header2 from "../headers/Header2";

const Layout2 = () => {
    return (
        <>
            <Header2/>
            <Container maxWidth='xl' sx={{pt: 2}}>
                <Outlet/>
            </Container>
        </>
    );
};

export default Layout2;