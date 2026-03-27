import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { SnackbarProvider } from 'notistack';
import { store } from '@/store';
import { theme } from '@/theme';
import App from './App';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <SnackbarProvider maxSnack={3} autoHideDuration={3000} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
          <App />
        </SnackbarProvider>
      </ThemeProvider>
    </Provider>
  </StrictMode>,
);
