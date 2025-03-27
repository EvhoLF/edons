import { FormControl, InputLabel, Select, SelectProps } from '@mui/material'
import React, { FC } from 'react'

const SelectBase: FC<SelectProps> = ({ id = '', label, children, fullWidth, sxFrom = {}, ...props }) => {
  return (
    <FormControl fullWidth={fullWidth} sx={{
      "& .MuiInputLabel-outlined": { transform: 'translate(14px, 12px) scale(1)', },
      "& .Mui-focused.MuiInputLabel-outlined, & .MuiInputLabel-outlined.MuiInputLabel-shrink": { transform: 'translate(14px, -9px) scale(0.75)', },
      ...sxFrom
    }}>
      <InputLabel id={`select-${id}-label`}>{label}</InputLabel>
      <Select
        labelId={`select-${id}-label`}
        id={`select-${id}`}
        {...props}
        label={label}
      >
        {children}
      </Select>
    </FormControl >
  )
}

export default SelectBase