import Paper from '@mui/material/Paper';
import {useAuthenticateUserMutation, useRegisterUserMutation} from "../../features/api/pcxApi";
import {useLocation, useNavigate} from "react-router-dom";
import {useAppDispatch, useAppSelector} from "../hooks";
import {SigninForm, SignupForm} from "./AuthDialog.tsx";
import {AnimatePresence, motion} from "motion/react";
import {selectSignup, setOpen} from "../../features/signupDialog/authFormSlice.ts";
import {useEffect} from "react";


const AuthPage = () => {
    const dispatch = useAppDispatch();
    const isSignUp = useAppSelector(selectSignup);
    const navigate = useNavigate();
    const location = useLocation();
    const {from} = location.state || {from: {pathname: "/"}};
    const [authenticateUser] = useAuthenticateUserMutation();
    const [registerUser] = useRegisterUserMutation();

    useEffect(() => {
        dispatch(setOpen(false));
    }, [dispatch]);

    return (
        <Paper sx={{overflow: 'hidden'}}>
            <motion.div layout>
                <AnimatePresence mode="wait">
                    {!isSignUp ? (
                        <motion.div
                            key="sign-in"
                            initial={{opacity: 0, x: 50}}
                            animate={{opacity: 1, x: 0}}
                            exit={{opacity: 0, x: -50}}
                            transition={{duration: 0.3}}
                        >
                            <SigninForm onSubmit={(values) =>
                                authenticateUser({loginRequest: values}).unwrap()
                                    .then(() => navigate(from))}/>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="sign-up"
                            initial={{opacity: 0, x: -50}}
                            animate={{opacity: 1, x: 0}}
                            exit={{opacity: 0, x: 50}}
                            transition={{duration: 0.3}}
                        >
                            <SignupForm onSubmit={(values) =>
                                registerUser({signupFormRequest: values}).unwrap()}/>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </Paper>
    );
}

export default AuthPage;