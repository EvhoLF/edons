import { ComponentsOverrides, ComponentsProps, ComponentsVariants, Theme } from "@mui/material";
import { gradientBorder, gradientSvg, gradientText } from "../mixins";
import { palette } from "../variables";

declare module '@mui/material/Button' {
  interface ButtonPropsVariantOverrides {
    contained_alt: true;
    outlined_alt: true;
    text_alt: true;
  }
}

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
      transition: 'all .3s',
      "&:hover": { scale: '1.05' },
      "&:active": { scale: '1' },
      "&::before": { zIndex: '-1' },
      ":disabled": { filter: 'grayscale(20%) brightness(50%)' }
    },
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
  variants: [
    {
      props: { variant: "text_alt" },
      style: { 
        ...gradientText, ...gradientSvg
      },
    },
    {
      props: { variant: "outlined_alt" },
      style: { ...gradientText, ...gradientSvg, ...gradientBorder },
    },
    {
      props: { variant: "contained_alt" },
      style: {
        background: 'transparent',
        "&::before": {
          content: '""',
          position: 'absolute',
          inset: 0,
          borderRadius: 'inherit',
          background: palette.gradientPrimary,
        }
      }
    }
  ]
}

export default ButtonStyle;