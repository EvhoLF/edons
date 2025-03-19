import { ComponentsOverrides, ComponentsProps, Theme } from "@mui/material";
import { palette } from "../variables";

type TooltipStyleProps = {
  defaultProps?: ComponentsProps["MuiTooltip"];
  styleOverrides?: ComponentsOverrides<Theme>["MuiTooltip"];
};

const TooltipStyle: TooltipStyleProps = {
  styleOverrides: {
    tooltip: {
      background: palette.gradientGlassPrimary, // Фон тултипа
      padding: ".5rem .75rem", // Отступы
      borderRadius: '.5rem', // Закругление углов
      transition: "all 0.3s",
    },
  },
};

export default TooltipStyle;
