import { IconName, icons_data } from '@/data/data_icons';
import styles from './Icon.module.scss';
import clsx from 'clsx';
import { SvgIcon, SvgIconProps } from '@mui/material';

interface IconProps extends SvgIconProps {
  icon?: IconName;
}

export const Icon = ({ icon = 'default', className, ...props }: IconProps) => {
  const IconComponent = icons_data[icon] || icons_data.default;

  return (
    <SvgIcon
      {...props}
      className={clsx(styles.Icon, className)}
    >
      <IconComponent />
    </SvgIcon>
  );
};
