import { IconName, icons_data } from '@/data/data_icons';
import styles from './Icon.module.scss';
import { SVGAttributes } from 'react';
import clsx from 'clsx';

interface IconProps extends SVGAttributes<SVGSVGElement> {
  icon?: IconName;
  color?: string;
  className?: string;
}

export const Icon = ({ icon = 'default', color = "#eff", className, ...props }: IconProps) => {
  const IconComponent = icons_data[icon] || icons_data.default;

  return (
    <>
      <svg color={color} className={clsx(styles.Icon, className)} {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" >
        <IconComponent />
      </svg >
    </>
  );
};
