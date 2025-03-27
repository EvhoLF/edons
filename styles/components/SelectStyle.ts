import { ComponentsOverrides, ComponentsProps, ComponentsVariants, Theme } from "@mui/material";

type SelectStyleProps = {
  defaultProps?: ComponentsProps['MuiSelect'];
  styleOverrides?: ComponentsOverrides<Theme>['MuiSelect'];
  variants?: ComponentsVariants<Theme>['MuiSelect'];
}

const SelectStyle: SelectStyleProps = {
  styleOverrides: {
    root: {
      transition: 'all .3',
      "& .MuiSelect-select.MuiSelect-outlined.MuiInputBase-input.MuiOutlinedInput-input": { padding: "12px 14px", },
    },
  }
};

export default SelectStyle;