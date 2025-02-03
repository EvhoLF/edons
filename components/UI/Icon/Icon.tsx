import { IconName, icons_data } from '@/data/data_icons';
import styles from './Icon.module.scss'

interface Icon {
  icon?: IconName,
  color?: string,
  className?: string,
}

export const Icon = ({ icon, color = "#eff", className, ...props }: Icon) => {
  const IconComponent = icons_data[icon] || icons_data.default;
  const style = `${styles.Icon} ${className ? className : ""}`
  return (
    <svg fill={color} className={style} {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
      <IconComponent />;
    </svg>
  )
};