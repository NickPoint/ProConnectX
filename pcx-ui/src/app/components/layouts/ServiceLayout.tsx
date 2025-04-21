import {Outlet} from 'react-router-dom';
import ServiceHeader from "../headers/ServiceHeader.tsx";

const ServiceLayout = () => {
    return (
        <>
            <ServiceHeader/>
            <Outlet/>
        </>
    );
};

export default ServiceLayout;