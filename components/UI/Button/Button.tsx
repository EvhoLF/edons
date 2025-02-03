import React, { FC, ReactNode } from 'react';
import styles from './Button.module.scss';

interface ButtonProps {
  onClick?: (...args: unknown[]) => void;
  onBlur?: (...args: unknown[]) => void;
  className?: string;
  children?: ReactNode;
}

const Button: FC<ButtonProps> = ({ onClick = () => { }, onBlur = () => { }, className = '', children = '' }) => {
  return (
    <button className={`${styles.Button} ${className}`} onClick={onClick} onBlur={onBlur}>
      {children}
    </button>
  );
};

export default Button;
