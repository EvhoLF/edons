'use client';
import { createTheme, PaletteColor, PaletteColorOptions } from '@mui/material/styles';
import ButtonStyle from './components/ButtonStyle';
import InputTextStyle from './components/InputTextStyle';
import TooltipStyle from './components/TooltipStyle';
import { palette } from './variables';
import SelectStyle from './components/SelectStyle';
import { glassBackground } from './mixins';

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
declare module '@mui/material/Icon' {
  interface IconPropsColorOverrides {
    ui: true;
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
    MuiSelect: SelectStyle,
    MuiPaper: { styleOverrides: { root: { ...glassBackground } } },
    MuiInputAdornment: { styleOverrides: { root: { margin: '0' } } },
    MuiDialog: { styleOverrides: { root: { '& .MuiPaper-root': { background: 'none', }, } } },
    MuiIconButton: { styleOverrides: { root: { transition: 'all .3s', } }, },
    MuiStack: { defaultProps: { useFlexGap: true, }, },
    MuiDivider: {
      styleOverrides: { root: { margin: '0px !important', '&::before, &::after': { border: 'none', height: "1px", backgroundColor: palette.ui.main } } }
    },
  }
});

export default mui_theme;
