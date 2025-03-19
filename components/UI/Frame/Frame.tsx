import React, { FC } from 'react';
import clsx from 'clsx';
import styles from './Frame.module.scss';
import { Box, BoxProps } from '@mui/material';

// interface FrameProps extends BoxProps { }

const Frame: FC<BoxProps> = ({ children, className, ...props }) => {
  return (
    <Box className={clsx(styles.Frame, className)} padding={1} {...props}>
      {children}
    </Box>
  );
};

export default Frame;
