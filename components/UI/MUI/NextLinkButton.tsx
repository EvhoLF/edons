import { FC } from 'react';
import Link from 'next/link';
import { Button, ButtonProps } from '@mui/material';
import { IconName } from '@/data/data_icons';
import { Icon } from '../Icon/Icon';

interface NextLinkButtonProps extends ButtonProps {
  startIcon?: IconName;
  endIcon?: IconName;
}

const NextLinkButton: FC<NextLinkButtonProps> = ({ startIcon, endIcon, href, ...props }) => {
  const renderIcon = (icon?: IconName) => (icon ? <Icon icon={icon} /> : null);

  return (
    <Button LinkComponent={Link} href={href} startIcon={renderIcon(startIcon)} endIcon={renderIcon(endIcon)} {...props} />
  );
};

export default NextLinkButton;
