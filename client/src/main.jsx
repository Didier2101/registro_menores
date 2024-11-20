import { createTheme, ThemeProvider } from '@mui/material/styles';
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

import { themeColors } from './utils/theme.js';

// Crear un tema con la paleta de colores
const theme = createTheme({
  palette: {
    background: themeColors.background,
    primary: themeColors.primary,
    secondary: themeColors.secondary,
    text: themeColors.text,
    common: themeColors.common,
  },
});

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <App />
    </ThemeProvider>
  </StrictMode>,
)
