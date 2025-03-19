import { FC } from 'react';
import { Link, LinkProps } from '@mui/material';

// interface InputLinkProps extends LinkProps {
//   textTransform?: 'none' | 'capitalize' | 'uppercase' | 'lowercase' | 'full-width' | 'full-size-kana',
//   startIcon?: IconName,
//   endIcon?: IconName,
// }

const InputLink: FC<LinkProps> = ({ children, underline = 'none', ...props }) => {

  return (
    <Link underline={underline} {...props}>{children}</Link>
  );
};

export default InputLink;