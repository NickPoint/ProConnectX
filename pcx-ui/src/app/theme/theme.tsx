import {createTheme, responsiveFontSizes, styled} from '@mui/material/styles';
import {grey, red} from "@mui/material/colors";
import {Grid} from "@mui/material";

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
            "Inter",
            "sans-serif"
        ].join(','),
        h3: {
            fontWeight: 700,
        },
        h4: {
            fontWeight: 500,
        },
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
                root: ({theme}) => ({
                    borderRadius: theme.spacing(4),
                    variants: [{
                        props: {multiline: true},
                        style: ({theme}) => ({
                            borderRadius: theme.spacing(2),
                        }),
                    }]
                }),
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: ({theme}) => ({
                    borderRadius: theme.spacing(2),
                })
            }
        },
        MuiFab: {
            styleOverrides: {
                root: {
                    variants: [{
                        props: {variant: 'extended', size: 'large'},
                        style: ({theme}) => ({
                            paddingInline: theme.spacing(6),
                        }),
                    }]
                }
            }
        },
        MuiAppBar: {
            styleOverrides: {
                root: {
                    variants: [{
                        props: {variant: 'transparent', color: 'inherit'},
                    }]
                }
            }
        },
        MuiAvatar: {
            styleOverrides: {
                root: ({theme}) => ({
                    backgroundColor: theme.palette.primary.main,
                })
            }
        }
    }
});

theme = responsiveFontSizes(theme);

export default theme;

export const GridItemFullWidth = styled(Grid)({
    width: '100%'
});