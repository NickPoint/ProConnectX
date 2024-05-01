import {createTheme, responsiveFontSizes} from '@mui/material/styles';
import { red } from '@mui/material/colors';

// A custom theme for this app
let theme = createTheme({
    palette: {
        primary: {
            main: '#1F41AF',
        },
        secondary: {
            main: '#EFF6FF',
        },
        error: {
            main: red.A400,
        },
    },
    typography: {
    }
});

theme = responsiveFontSizes(theme);

// theme.spacing();



export default theme;