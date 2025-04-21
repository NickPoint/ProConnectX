import { Backdrop, CircularProgress } from '@mui/material';
import {useAppSelector} from "../hooks.ts";
import {selectIsLoading} from "../../features/loading/loadingSlice.ts";

export const GlobalLoadingBackdrop = () => {
    const isLoading = useAppSelector(selectIsLoading);

    return (
        <Backdrop
            open={isLoading}
            sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        >
            <CircularProgress color="inherit" />
        </Backdrop>
    );
};
