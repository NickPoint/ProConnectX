import React from 'react';
import {useLocation, useNavigate} from 'react-router-dom';
import { useAppSelector } from '../hooks';
import { Fab } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import {userHasRole} from "../../features/auth/authSlice";
import {ERole} from "../../features/enums";
import {styled} from "@mui/material/styles";

const StyledFab = styled(Fab)({
    position: 'absolute',
    zIndex: 1,
    top: -30,
    left: 0,
    right: 0,
    margin: '0 auto',
});

const AddButton = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(`${location.pathname}/add`);
    };

    return (
        <StyledFab color="primary" aria-label="add" onClick={handleClick}>
            <AddIcon />
        </StyledFab>
    );
};

export default AddButton;