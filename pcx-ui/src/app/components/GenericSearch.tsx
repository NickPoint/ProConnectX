import {FormControl, IconButton, InputAdornment, OutlinedInput} from "@mui/material";
import {FilterAlt, Menu, SearchRounded} from '@mui/icons-material';
import React from "react";

interface GenericSearchProps {
    menuButtonVisible?: boolean,
    filterButtonVisible?: boolean
    onClick?: () => void,
}

function chooseStartAdornment(menuButtonVisible: boolean | undefined, filterButtonVisible: boolean | undefined,
                              onClick: ((() => void) | undefined)) {
    if (menuButtonVisible) {
        return <InputAdornment position='start'><Menu/></InputAdornment>;
    } else if (filterButtonVisible) {
        return <InputAdornment position='start'>
            <IconButton sx={{p: 0}} onClick={onClick}>
                <FilterAlt/>
            </IconButton>
        </InputAdornment>;
    } else {
        return <InputAdornment position='start'><SearchRounded/></InputAdornment>;
    }
}

function chooseEndAdornment(menuButtonVisible: boolean | undefined, filterButtonVisible: boolean | undefined) {
    if (menuButtonVisible || filterButtonVisible) {
        return <InputAdornment position='end'><SearchRounded/></InputAdornment>;
    }
}

const GenericSearch = (props: GenericSearchProps) => {
    const [value, setValue] = React.useState('');
    const {menuButtonVisible, filterButtonVisible, onClick} = props;

    return (
        //TODO: Add drawer for search results with suggestions
        <FormControl fullWidth>
            <OutlinedInput onChange={(ctx) => setValue(ctx.currentTarget.value)}
                           value={value}
                           placeholder='Marketing strategy'
                           startAdornment={chooseStartAdornment(menuButtonVisible, filterButtonVisible, onClick)}
                           endAdornment={chooseEndAdornment(props.menuButtonVisible, props.filterButtonVisible)}/>
        </FormControl>
    );
}

export default GenericSearch;