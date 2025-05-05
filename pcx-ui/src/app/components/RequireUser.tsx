import {Navigate, Outlet, useLocation} from "react-router-dom";
import {FC} from "react";
import {AccountStatus, AccountType, AuthResponse, RoleType, useGetCurrentUserQuery} from "../../features/api/pcxApi.ts";
import {GlobalLoadingBackdrop} from "./GlobalLoadingBackdrop.tsx";

interface RequireUserProps {
    allowedRoles: RoleType[];
    dissalowedAccountsStatuses?: {
        type: AccountType;
        status?: AccountStatus;
    }[]
    children?: React.ReactNode;
}

const RequireUser: FC<RequireUserProps> = ({ allowedRoles, children, dissalowedAccountsStatuses }) => {
    const location = useLocation();
    const { data: user, isLoading, isFetching } = useGetCurrentUserQuery();

    const loading = isLoading || isFetching;

    if (loading) {
        return <GlobalLoadingBackdrop />;
    }

    if (!user) {
        return <Navigate to="/auth" state={{ from: location }} replace />;
    }

    function checkUserAllowed(user: AuthResponse) {
        if (user.activeRole === RoleType.RoleAdmin) {
            return true;
        }
        if (allowedRoles.includes(user.activeRole)) {
            if (dissalowedAccountsStatuses) {
                for (const disallowed of dissalowedAccountsStatuses) {
                    for (const account of user.accounts) {
                        if (account.accountType === disallowed.type) {
                            if (!disallowed.status || account.accountStatus === disallowed.status) {
                                return false;
                            }
                        }
                    }
                }
            }
            return true;
        }
        return false;
    }

    return checkUserAllowed(user) ? (children ? children : <Outlet />) : <Navigate to="/unauthorized" state={{ from: location }} replace />;
};

export default RequireUser;
