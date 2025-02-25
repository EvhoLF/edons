import { FC, PropsWithChildren, ReactNode } from 'react';
import styles from './NavLink.module.scss';
import clsx from 'clsx';
import Link, { LinkProps } from 'next/link';

interface NavLinkProps extends PropsWithChildren<LinkProps> {
  variant?: 'gradient' | 'white';
  dimension?: 'x' | 's' | 'm' | 'l';
  action?: 'none' | 'bottomLine';
  square?: boolean;
  uppercase?: boolean;
  children?: ReactNode;
  className?: string;
}

const NavLink: FC<NavLinkProps> = ({
  variant = 'filled',
  action = 'none',
  dimension = 's',
  uppercase,
  children,
  className,
  ...props
}) => {
  return (
    <Link
      className={clsx(
        styles.NavLink,
        styles[variant],
        styles[dimension],
        styles[action],
        { [styles.uppercase]: uppercase },
        className
      )}
      {...props}
    >
      {children}
    </Link>
  );
};

export default NavLink;


