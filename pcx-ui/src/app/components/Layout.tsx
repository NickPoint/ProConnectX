import {Outlet} from 'react-router-dom';
import Header from './Header';
import {SnackbarProvider} from "notistack";

const Layout = () => {
    return (
        <>
            <Header/>
            <Outlet/>
        </>
    );
};

export default Layout;