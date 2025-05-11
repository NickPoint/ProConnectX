import {useAppDispatch} from "../hooks.ts";
import {addFab, clearFabs} from "../../features/fab/fabSlice.ts";
import {useLocation} from "react-router-dom";
import {ProfileType, useGetCurrentUserQuery} from "../../features/api/pcxApi.ts";
import {useEffect} from "react";


const FabManager = () => {
    const dispatch = useAppDispatch();
    const {data: user} = useGetCurrentUserQuery()
    const location = useLocation();

    const userIsUnverified = () => (user?.roles.length === 1 && user?.roles[0] === ProfileType.RoleUnverified)
    const hasRole = (requiredRole: ProfileType) => user?.roles.includes(requiredRole);

    useEffect(() => {
        dispatch(clearFabs());

        if (!user || userIsUnverified()) return;

        if (location.pathname === "/services"
            && user.activeProfile?.profileType === ProfileType.Freelancer) {
            dispatch(addFab({id: 'addService', fabProps: {}, visible: true, icon: 'add'}));
        }
    }, [dispatch, user, user?.roles, location.pathname]);

    return null;
}

export default FabManager;