import { FC } from 'react';
import { Button, ButtonProps } from '@mui/material';
import { Icon } from '../Icon/Icon';
import { IconName } from '@/data/data_icons';

export interface InputButtonProps extends ButtonProps {
  textTransform?: 'none' | 'capitalize' | 'uppercase' | 'lowercase' | 'full-width' | 'full-size-kana',
  startIcon?: IconName,
  endIcon?: IconName,
}

const InputButton: FC<InputButtonProps> = ({ children, textTransform, startIcon, endIcon, ...props }) => {

  const IconStart = startIcon && <Icon icon={startIcon} />;
  const IconEnd = endIcon && <Icon icon={endIcon} />;

  return (
    <Button sx={{ textTransform }} startIcon={IconStart} endIcon={IconEnd} {...props} >{children}</Button>
  );
};

export default InputButton;