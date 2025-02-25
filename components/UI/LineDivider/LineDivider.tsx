import React, { FC, HTMLAttributes } from 'react';
import clsx from 'clsx';
import styles from './LineDivider.module.scss';


const LineDivider: FC<HTMLAttributes<HTMLDivElement>> = ({ children, className, ...props }) => {
  return (
    <div className={clsx(styles.LineDivider, className)} {...props}>
      <span>{children}</span>
    </div>
  );
};

export default LineDivider;