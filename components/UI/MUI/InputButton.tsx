import { FC } from 'react';
import { Button, ButtonProps } from '@mui/material';
import { IconName } from '@/data/data_icons';
import { Icon } from '../Icon/Icon';

interface InputButtonProps extends ButtonProps {
  startIcon?: IconName;
  endIcon?: IconName;
}

const InputButton: FC<InputButtonProps> = ({ startIcon, endIcon, ...props }) => {
  const renderIcon = (icon?: IconName) => icon ? <Icon icon={icon} /> : '';
  return <Button {...props} startIcon={renderIcon(startIcon)} endIcon={renderIcon(endIcon)} />;
};

export default InputButton;