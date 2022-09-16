import { createTheme } from '@mui/material/styles';
import { red } from '@mui/material/colors';

const theme = createTheme({
    typography: {
        fontFamily: [
            'Rubik',
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
                    borderRadius: '30px',
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: '30px',
                    boxShadow: '0px 0px 10px 0px rgb(0 0 0 / 10%)',
                }
            }
        }
    },
});

export default theme;