import {Stack} from "@mui/material";
import React from "react";

const VerticallyScrollingContainer = ({children} : {children: React.ReactNode}) => {
    return (
        <Stack direction='row' spacing={1} sx={{overflowX: 'auto', scrollbarWidth: 'none'}}>
            {children}
        </Stack>
    );
}

export default VerticallyScrollingContainer;