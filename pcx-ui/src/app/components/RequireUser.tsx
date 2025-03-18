import {useCookies} from "react-cookie";
import {Navigate, Outlet, useLocation, useNavigate} from "react-router-dom";
import {useAuthorizeQuery} from "../../features/api/authApi";
import {FC, useEffect} from "react";
import {useAppSelector} from "../hooks";
import {selectUser} from "../../features/auth/authSlice";

interface RequireUserProps {
    allowedRoles: string[];
}

const RequireUser: FC<RequireUserProps> = ({ allowedRoles }) => {
    const location = useLocation();
    const user = useAppSelector(selectUser);
    const { isLoading, isFetching } = useAuthorizeQuery(null);

    if (isLoading || isFetching) {
        return <div>Loading...</div>;
    }

    return user && user?.roles?.some(role => allowedRoles.includes(role)) ? (
        <Outlet />
    ) : user ? (
        <Navigate to='/unauthorized' state={{ from: location }} replace />
    ) : (
        <Navigate to='/login' state={{ from: location }} replace />
    );
};

export default RequireUser;
