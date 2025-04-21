import {useAppDispatch, useAppSelector} from "../hooks.ts";
import {addFab, clearFabs} from "../../features/fab/fabSlice.ts";
import {selectUser} from "../../features/auth/authSlice.ts";
import {useLocation} from "react-router-dom";
import {RoleType} from "../../features/api/pcxApi.ts";
import {useEffect} from "react";


const FabManager = () => {
    const dispatch = useAppDispatch();
    const user = useAppSelector(selectUser);
    const location = useLocation();

    const userIsUnverified = () => (user?.roles.length === 1 && user?.roles[0] === RoleType.RoleUnverified)
    const hasRole = (requiredRole: RoleType) => user?.roles.includes(requiredRole);

    useEffect(() => {
        dispatch(clearFabs());

        if (!user || userIsUnverified()) return;

        if (location.pathname === "/services"
            && hasRole(RoleType.RoleFreelancer)) {
            dispatch(addFab({id: 'addService', fabProps: {}, visible: true, icon: 'add'}));
        }
    }, [dispatch, user, user?.roles, location.pathname]);

    return null;
}

export default FabManager;