import {createTheme, responsiveFontSizes} from '@mui/material/styles';
import {red} from '@mui/material/colors';

const theme = responsiveFontSizes(createTheme({
    typography: {
        fontFamily: [
            'Cabin',
            'sans-serif',
        ].join(','),
        fontSize: 16,
    },
    palette: {
        primary: {
            main: '#556cd6',
        },
        secondary: {
            main: '#19857b',
        },
        error: {
            main: red.A400,
        },
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    textTransform: 'none',
                    borderRadius: '15px',
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: '30px',
                    boxShadow: '0px 0px 10px 0px rgb(0 0 0 / 10%)',
                    border: 'none',
                }
            }
        },
        MuiFilledInput: {
            styleOverrides: {
                root: {
                    borderRadius: '15px',
                    ':before': {
                        border: 'none !important',
                    },
                    ':after': {
                        border: 'none !important',
                    },
                    ':hover:before': {
                        border: 'none !important',
                    }
                }
            }
        },
        MuiContainer: {
            styleOverrides: {
                root: {
                    height: '100%',
                    display: 'flex'
                }
            }
        }
    },
}));

export default theme;