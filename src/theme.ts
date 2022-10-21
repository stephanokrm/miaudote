import {createTheme, responsiveFontSizes} from '@mui/material/styles';

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
      main: '#ffc700',
    },
  },
  components: {
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: '15px',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: '15px',
        },
      },
    },
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
          borderRadius: '20px',
        },
      },
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
          },
        },
      },
    },
    MuiContainer: {
      styleOverrides: {
        root: {
          height: '100%',
          display: 'flex',
        },
      },
    },
  },
}));

export default theme;
