import { ComponentsOverrides, ComponentsProps, ComponentsVariants, Theme } from "@mui/material";

type InputTextStyleProps = {
  defaultProps?: ComponentsProps['MuiTextField'];
  styleOverrides?: ComponentsOverrides<Theme>['MuiTextField'];
  variants?: ComponentsVariants<Theme>['MuiTextField'];
}

const InputTextStyle: InputTextStyleProps = {
  styleOverrides: {
    root: {
      transition: 'all .3',
      "& .MuiOutlinedInput-root .MuiInputBase-input": { padding: "12px 14px", },
      "& .MuiOutlinedInput-root .MuiInputBase-inputSizeSmall.MuiInputBase-input": { padding: "8.5px 14px", },
      "& .MuiInputLabel-outlined.MuiInputLabel-sizeSmall": { transform: 'translate(14px, 9px) scale(1)', },
      "& .MuiInputLabel-outlined": { transform: 'translate(14px, 12px) scale(1)', },
      "& .Mui-focused.MuiInputLabel-outlined, & .MuiInputLabel-outlined.MuiInputLabel-shrink": { transform: 'translate(14px, -9px) scale(0.75)', },
      "& .MuiFilledInput-root": {
        // padding: "10px 15px", // Паддинг для `filled`
      },
      "& .MuiInput-root": {
        // padding: "8px", // Паддинг для `standard`
      },
    },
  }
};

export default InputTextStyle;