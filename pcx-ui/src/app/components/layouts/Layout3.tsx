import {Outlet} from 'react-router-dom';
import Header3 from "../headers/Header3";

const Layout3 = () => {
    return (
        <>
            <Header3/>
            <Outlet/>
        </>
    );
};

export default Layout3;