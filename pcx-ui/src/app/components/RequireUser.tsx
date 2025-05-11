import {Navigate, Outlet, useLocation} from "react-router-dom";
import {AuthResponse, ProfileStatus, ProfileType, useGetCurrentUserQuery} from "../../features/api/pcxApi.ts";
import {GlobalLoadingBackdrop} from "./GlobalLoadingBackdrop.tsx";

interface RequireUserProps {
    /** Which ProfileTypes are allowed access (e.g. [ProfileType.CLIENT]) */
    allowedProfiles: ProfileType[];
    /**
     * Optionally block if any profile of a given type is in one of these statuses
     * e.g. [{ type: ProfileType.FREELANCER, status: ProfileStatus.PENDING }]
     */
    disallowedStatuses?: Array<{
        type: ProfileType;
        status?: ProfileStatus;
    }>;
    children?: React.ReactNode;
}

const RequireUser: React.FC<RequireUserProps> = ({
                                               allowedProfiles,
                                               disallowedStatuses,
                                               children,
                                           }) => {
    const location = useLocation();
    const { data: user, isLoading, isFetching } = useGetCurrentUserQuery();
    const loading = isLoading || isFetching;

    if (loading) {
        return <GlobalLoadingBackdrop />;
    }

    if (!user) {
        return (
            <Navigate to="/auth" state={{ from: location }} replace />
        );
    }

    const profilesByType = new Map<ProfileType, AuthResponse["allProfiles"][0]>(
        user.allProfiles.map((p) => [p.profileType, p])
    );

    const isAllowed = (() => {
        const active = user.activeProfile;
        if (active.profileType === ProfileType.Admin) return true;

        if (!allowedProfiles.includes(active.profileType)) {
            return false;
        }

        if (disallowedStatuses) {
            for (const rule of disallowedStatuses) {
                const prof = profilesByType.get(rule.type);
                if (prof) {
                    // block if status matches or if no status specified (i.e. block all of that type)
                    if (!rule.status || prof.status === rule.status) {
                        return false;
                    }
                }
            }
        }

        return true;
    })();

    if (isAllowed) {
        return children ? <>{children}</> : <Outlet />;
    } else {
        return (
            <Navigate to="/unauthorized" state={{ from: location }} replace />
        );
    }
};

export default RequireUser;
