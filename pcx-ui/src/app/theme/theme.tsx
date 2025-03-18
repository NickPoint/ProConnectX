import {createTheme, responsiveFontSizes, styled} from '@mui/material/styles';
import {grey, red} from "@mui/material/colors";
import {Grid2 as Grid} from "@mui/material";

// A custom theme for this app
let theme = createTheme({
    cssVariables: true,
    palette: {
        primary: {
            main: '#1F41AF',
        },
        onPrimary: {
            main: '#3252B5'
        },
        secondary: {
            main: '#EFF6FF',
        },
        error: {
            main: red.A400,
        },
    },
    typography: {
        fontFamily: [
            "Space Grotesk",
            "sans-serif"
        ].join(','),
        body2: {
            color: grey[400]
        }
    },
    breakpoints: {
        values: {
            xs: 0,
            sm: 600,
            md: 900,
            lg: 1200,
            xl: 1436,
        }
    },
    components: {
        MuiOutlinedInput : {
            styleOverrides: {
                root: {
                    borderRadius: 28,
                }
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: 16,
                }
            }
        }
    }
});

theme = responsiveFontSizes(theme);

export default theme;

export const GridItemFullWidth = styled(Grid)({
    width: '100%'
});