import { InputHTMLAttributes, FC, ReactNode } from 'react';
import clsx from 'clsx';
import styles from './InputText.module.scss';
import { IconName } from '@/data/data_icons';
import { Icon } from '../Icon/Icon';

interface InputTextProps extends InputHTMLAttributes<HTMLInputElement> {
  variant?: 'filled' | 'outlined' | 'text';
  dimension?: 'x' | 's' | 'm' | 'l';
  round?: 'none' | 'sm' | 'md' | 'lg' | 'round';
  iconLeft?: IconName;
  iconRight?: IconName;
  children?: ReactNode;
  contentLeft?: ReactNode;
  contentRight?: ReactNode;
  label?: string;
}

const InputText: FC<InputTextProps> = ({
  variant = 'filled',
  dimension = 's',
  round = 'md',
  iconLeft,
  iconRight,
  className,
  contentLeft,
  contentRight,
  label,
  ...props
}) => {
  return (
    <div className={clsx(
      styles.InputText,
      styles[variant],
      styles[dimension],
      styles[`r-${round}`],
      className
    )}>
      <label className={styles.label}>{label}</label>
      <div className={styles.container}>
        {contentLeft} {iconLeft && <Icon icon={iconLeft} className={styles.iconLeft} />}
        <input className={styles.input} {...props} />
        {contentRight} {iconRight && <Icon icon={iconRight} className={styles.iconRight} />}
      </div>
    </div>
  );
};

export default InputText;