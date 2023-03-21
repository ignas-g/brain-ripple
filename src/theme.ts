// theme.js
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#A9BDB4',
    },
    secondary: {
      main: '#ECEADE',
    },
    background: {
      default: '#050605',
      paper: '#3D4A45',
    },
    text: {
      primary: '#F7FEFC',
    },
  },
  typography: {
    fontFamily: 'Inter, sans-serif',
  },
});

export default theme;
