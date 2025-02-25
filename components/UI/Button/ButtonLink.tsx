import { FC, PropsWithChildren, ReactNode } from 'react';
import styles from './Button.module.scss';
import clsx from 'clsx';
import Link, { LinkProps } from 'next/link';
import { IconName } from '@/data/data_icons';
import { Icon } from '../Icon/Icon';

interface ButtonLinkProps extends PropsWithChildren<LinkProps> {
  variant?: 'filled' | 'text' | 'outlined' | 'colorGlass';
  dimension?: 'none' | 'x' | 's' | 'm' | 'l';
  round?: 'none' | 'sm' | 'md' | 'lg' | 'round';
  square?: boolean;
  uppercase?: boolean;
  iconLeft?: IconName;
  iconRight?: IconName;
  children?: ReactNode;
  activeDynamic?: boolean;
  fillX?: boolean;
  className?: string;
}

const ButtonLink: FC<ButtonLinkProps> = ({
  variant = 'filled',
  dimension = 's',
  round = 'md',
  square = false,
  uppercase = false,
  activeDynamic = true,
  iconLeft,
  iconRight,
  children,
  className,
  fillX,
  ...props
}) => {
  return (
    <Link
      className={clsx(
        styles.Button,
        styles[variant],
        styles[dimension],
        styles[`r-${round}`],
        {
          [styles.square]: square,
          [styles.uppercase]: uppercase,
          [styles.activeDynamic]: activeDynamic,
          [styles.fillX]: fillX,
          // [styles.iconColored]: iconColored,
        },
        className
      )}
      {...props}
    >
      <div className={styles.content}>
        {iconLeft && <Icon icon={iconLeft} className={styles.iconLeft} />}
        {children && <span>{children}</span>}
        {iconRight && <Icon icon={iconRight} className={styles.iconRight} />}
      </div>
    </Link>
  );
};

export default ButtonLink;


