import { FC } from 'react';
import NextLink from 'next/link';
import { Link as MuiLink, LinkProps } from '@mui/material';

const InputLink: FC<LinkProps & { href: string }> = ({ children, href, underline = 'none', sx, ...props }) => {
  return (
    <MuiLink
      component={NextLink}
      href={href}
      underline={underline}
      sx={{
        transition: 'all .3s',
        '&:hover': {
          color: 'primary.light',
        },
        '&:active': {
          color: 'primary.dark',
        },
        '&:focus-visible': {
          outline: '2px solid',
          outlineColor: 'primary.main',
        },
        '@media (hover: none)': {
          '&:active': {
            color: 'secondary.main',
          },
        },
        ...sx,
      }}
      {...props}
    >
      {children}
    </MuiLink>
  );
};

export default InputLink;
