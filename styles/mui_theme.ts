'use client';
import { createTheme, PaletteColor, PaletteColorOptions } from '@mui/material/styles';
import ButtonStyle from './components/ButtonStyle';
import InputTextStyle from './components/InputTextStyle';
import TooltipStyle from './components/TooltipStyle';
import { palette } from './variables';

declare module '@mui/material/styles' {
  interface Palette {
    primaryGradient: string;
    ui: PaletteColor;
  }
  interface PaletteOptions {
    primaryGradient?: string;
    ui?: PaletteColorOptions;
  }
}

const mui_theme = createTheme({
  palette: {
    mode: 'dark',
    ...palette,
  },
  typography: {
    fontFamily: 'var(--font-roboto)',
  },
  // cssVariables
  components: {
    MuiTooltip: TooltipStyle,
    MuiButton: ButtonStyle,
    MuiTextField: InputTextStyle,
    MuiIconButton: {
      styleOverrides: {
        root: {
          transition: 'all .3s',
        }
      }
    },
    MuiStack: {
      defaultProps: {
        useFlexGap: true,
      },
    },
  }
});

export default mui_theme;
