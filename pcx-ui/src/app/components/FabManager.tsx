import {useAppDispatch, useAppSelector} from "../hooks.ts";
import {addFab, clearFabs} from "../../features/fab/fabSlice.ts";
import {selectUser} from "../../features/auth/authSlice.ts";
import {useLocation} from "react-router-dom";
import {ERole} from "../../features/api/pcxApi.ts";
import {useEffect} from "react";


const FabManager = () => {
    const dispatch = useAppDispatch();
    const user = useAppSelector(selectUser);
    const location = useLocation();

    const userIsUnverified = () => (user?.roles.length === 1 && user?.roles[0] === ERole.RoleUnverified)
    const hasRole = (requiredRole: ERole) => user?.roles.includes(requiredRole);

    useEffect(() => {
        dispatch(clearFabs());

        if (!user || userIsUnverified()) return;

        if (location.pathname === "/services"
            && hasRole(ERole.RoleFreelancer)) {
            dispatch(addFab({id: 'addService', fabProps: {}, visible: true, icon: 'add'}));
        }
    }, [dispatch, user, user?.roles, location.pathname]);

    return null;
}

export default FabManager;