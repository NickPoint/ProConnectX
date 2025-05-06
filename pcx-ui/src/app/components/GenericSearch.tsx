import {IconButton, InputAdornment, OutlinedInput, OutlinedInputProps} from "@mui/material";
import {FilterAlt, Menu, SearchRounded} from '@mui/icons-material';
import React from "react";

function chooseEndAdornment(menuButtonVisible: boolean | undefined, filterButtonVisible: boolean | undefined,
                            onClick: ((() => void) | undefined)) {
    if (menuButtonVisible) {
        return <InputAdornment position='end'><Menu/></InputAdornment>;
    } else if (filterButtonVisible) {
        return <InputAdornment position='end'>
            <IconButton onClick={onClick}>
                <FilterAlt/>
            </IconButton>
        </InputAdornment>;
    } else {
        return <InputAdornment position='end'><SearchRounded/></InputAdornment>;
    }
}

function chooseStartAdornment(menuButtonVisible: boolean | undefined, filterButtonVisible: boolean | undefined) {
    if (menuButtonVisible || filterButtonVisible) {
        return <InputAdornment position='start'><SearchRounded/></InputAdornment>;
    }
}

type GenericSearchProps = {
    menuButtonVisible?: boolean;
    filterButtonVisible?: boolean;
    onEndButtonClick?: () => void;
} & OutlinedInputProps

const GenericSearch = React.forwardRef<HTMLDivElement, GenericSearchProps>(
    function GenericSearch({menuButtonVisible, filterButtonVisible, onEndButtonClick, ...rest},
                           ref) {

        return (
            <OutlinedInput ref={ref}
                           placeholder='Marketing strategy'
                           startAdornment={chooseStartAdornment(menuButtonVisible, filterButtonVisible)}
                           endAdornment={chooseEndAdornment(menuButtonVisible, filterButtonVisible, onEndButtonClick)}
                           {...rest}
            />
        );
    }
);

export default GenericSearch;