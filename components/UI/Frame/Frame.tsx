import React, { FC, HTMLAttributes } from 'react';
import clsx from 'clsx';
import styles from './Frame.module.scss';


const Frame: FC<HTMLAttributes<HTMLDivElement>> = ({ children, className, ...props }) => {
  return (
    <div className={clsx(styles.Frame, className)} {...props}>
      {children}
    </div>
  );
};

export default Frame;
