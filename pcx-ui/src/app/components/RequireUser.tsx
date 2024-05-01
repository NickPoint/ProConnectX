import {useCookies} from "react-cookie";
import {Navigate, Outlet, useLocation, useNavigate} from "react-router-dom";
import {authApi, useAuthorisedClientQuery} from "../../features/api/authApi";

const RequireUser = ({ allowedRoles }: { allowedRoles: string[] }) => {
    const [cookies] = useCookies(['proConnectX']);
    const location = useLocation();

    const { data, isLoading, isFetching   } = useAuthorisedClientQuery(null);

    const loading = isLoading || isFetching;

    const navigateFunction = useNavigate();

    if (loading) {
        return <div>Loading...</div>;
    }

    return data && data.roles.some((role) => allowedRoles.includes(role)) ? (
        <Outlet />
    ) : cookies.proConnectX && data? (
        <Navigate to='/unauthorized' state={{ from: location }} replace />
    ) : (
        <Navigate to='/login' state={{ from: location }} replace />
    );
};

export default RequireUser;
