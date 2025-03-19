import { ComponentsOverrides, ComponentsProps, ComponentsVariants, Theme } from "@mui/material";
import { gradientBorder, gradientSvg, gradientText } from "../mixins";
import { palette } from "../variables";

type ButtonStyleProps = {
  defaultProps?: ComponentsProps['MuiButton'];
  styleOverrides?: ComponentsOverrides<Theme>['MuiButton'];
  variants?: ComponentsVariants<Theme>['MuiButton'];
}

const ButtonStyle: ButtonStyleProps = {
  styleOverrides: {
    root: {
      position: 'relative',
      gap: '8px',
      background: 'transparent',
      transition: 'all .3s',
      "&:hover": {
        scale: '1.05'
      },
      "&:active": {
        scale: '1'
      },
      "&::before": {
        zIndex: '-1'
      },
      ":disabled": {
        filter: 'grayscale(20%) brightness(50%)'
      }
    },
    contained: {
      "&::before": {
        content: '""',
        position: 'absolute',
        inset: 0,
        borderRadius: 'inherit',
        background: palette.gradientPrimary,
      }
    },
    outlined: { ...gradientText, ...gradientSvg, ...gradientBorder },
    text: { ...gradientText, ...gradientSvg },
    loading: {
      WebkitTextFillColor: 'initial !important',
      background: 'initial !important',
      "&::before, &::after": {
        opacity: '0.4',
      },
    },
    startIcon: {
      marginLeft: "-4px",
    },
    endIcon: {
      marginRight: "-4px",
    },
  },
}

export default ButtonStyle;