import { FC, ReactNode } from 'react';
import { InputAdornment, TextField, TextFieldProps } from '@mui/material';
import { IconName } from '@/data/data_icons';
import { Icon } from '../Icon/Icon';

type InputTextProps = TextFieldProps & {
  startAdornment?: ReactNode,
  endAdornment?: ReactNode,
  startIcon?: IconName,
  endIcon?: IconName,
  labelActive?: boolean,
}

const InputText: FC<InputTextProps> = ({ labelActive = false, startAdornment, endAdornment, startIcon, endIcon, ...props }) => {

  const InputLabelProps = labelActive ? { shrink: true } : {}

  const getAdornment = (position: 'start' | 'end', icon?: IconName, adornment?: ReactNode,) =>
    icon ? <InputAdornment position={position}><Icon icon={icon} /></InputAdornment>
      : adornment && <InputAdornment position={position}>{adornment}</InputAdornment>;

  const slotProps = {
    input: {
      startAdornment: getAdornment('start', startIcon, startAdornment,),
      endAdornment: getAdornment('end', endIcon, endAdornment),
    },
  };

  return (
    <TextField InputLabelProps={InputLabelProps} slotProps={slotProps} {...props} />
  );
};

export default InputText;