import { FC } from 'react';
import { Button, ButtonProps } from '@mui/material';

const uiButton: FC<ButtonProps> = ({ children }) => {
  return (
    <Button>{children}</Button>
  );
};

export default uiButton;