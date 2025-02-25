'use client';
import { createTheme } from '@mui/material/styles';

declare module '@mui/material/styles' {
  interface Palette {
    primaryGradient: string;
  }
  interface PaletteOptions {
    primaryGradient?: string;
  }
}

const colors = {
  primary: {
    main: '#df1b7d',
    light: '#e54897',
    dark: '#9c1257',
  },
  secondary: {
    main: '#dd2748',
    light: '#e3526c',
    dark: '#9a1b32',
  },
  ui: {
    main: '#f9f9f9',
    light: '#ffffff',
    dark: '#bbbbbb',
  }
};
const style = {
  gradient_rotate: '150deg',
}

const mui_theme = createTheme({
  palette: {
    primary: {
      ...colors.primary,
      contrastText: colors.ui.main,
    },
    secondary: {
      ...colors.secondary,
      contrastText: colors.ui.main,
    },
    primaryGradient: `linear-gradient(${style.gradient_rotate}, ${colors.primary.main}, ${colors.secondary.main})`,
  },
  // typography: {
  //   fontFamily: 'var(--font-roboto)',
  // },
});

export default mui_theme;
