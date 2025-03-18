import React from "react";
import {FormControl, InputAdornment, OutlinedInput} from "@mui/material";
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import MenuIcon from '@mui/icons-material/Menu';

interface GenericSearchProps {
    menuButton: boolean,
}

const GenericSearch = (props: GenericSearchProps) => {
    const [value, setValue] = React.useState('');

    return (
        <FormControl fullWidth>
            <OutlinedInput onChange={(ctx) => setValue(ctx.currentTarget.value)}
                           value={value}
                           placeholder='Marketing strategy'
                           startAdornment={props.menuButton ?
                               <InputAdornment position='start'><MenuIcon/></InputAdornment>
                               : <InputAdornment position='start'><SearchRoundedIcon/></InputAdornment>}
                           endAdornment={props.menuButton &&
                               <InputAdornment position='end'><SearchRoundedIcon/></InputAdornment>}/>

        </FormControl>
        //TODO: Add drawer for search results with suggestions
    )
}

export default GenericSearch;