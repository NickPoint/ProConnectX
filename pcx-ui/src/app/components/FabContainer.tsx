import {useAppDispatch, useAppSelector} from "../hooks.ts";
import {removeFab, selectFabs} from "../../features/fab/fabSlice.ts";
import {Collapse, Fab, Stack, Zoom} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import theme from "../theme/theme.tsx";
import {ArrowUpward} from "@mui/icons-material";
import { TransitionGroup } from "react-transition-group";

const chooseIcon = (iconName: string) => {
    switch (iconName) {
        case 'add':
            return <AddIcon/>;
        case 'scrollUp':
            return <ArrowUpward/>
        default:
            return null;
    }
}

const FabContainer = () => {
    const dispatch = useAppDispatch();
    const fabs = useAppSelector(selectFabs);

    return (
        <Stack sx={{position: "fixed", bottom: theme.spacing(10), right: theme.spacing(2), zIndex: 10}} spacing={1}>
            <TransitionGroup sx={{}}>
                {fabs.map(({id, fabProps, visible, icon}) => (
                    <Collapse
                        key={id}
                        timeout={300}
                        unmountOnExit
                    >
                        <Fab {...fabProps}>
                            {chooseIcon(icon)}
                        </Fab>
                    </Collapse >
                ))}
            </TransitionGroup>
        </Stack>
    );
}
export default FabContainer;