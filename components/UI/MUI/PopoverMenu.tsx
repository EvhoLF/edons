'use client'
import React, { useState, useCallback, ReactNode, MouseEvent } from 'react';
import { Popover, Stack, PopoverOrigin, SxProps, Theme, StackProps, ClickAwayListener } from '@mui/material';

interface PopoverMenuProps {
  children: ReactNode,
  openButton: ({ handleOpen, handleClose, isOpen }: { isOpen: boolean, handleOpen: (event: MouseEvent<HTMLElement>,) => void, handleClose: (event: MouseEvent<HTMLElement>,) => void }) => ReactNode;
  anchorOrigin?: PopoverOrigin;
  transformOrigin?: PopoverOrigin;
  sxStack?: SxProps<Theme> | undefined
  stack?: StackProps
  sx?: SxProps<Theme> | undefined
}

const PopoverMenu: React.FC<PopoverMenuProps> = ({ openButton, children, anchorOrigin, transformOrigin, sx, sxStack, stack, ...props }) => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const handleOpen = useCallback((event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  }, []);

  const handleClose = useCallback(() => {
    setAnchorEl(null);
  }, []);

  const open = Boolean(anchorEl);
  return (
    <>
      {openButton({ handleOpen, handleClose, isOpen: !!anchorEl })}
      <Popover
        open={open}
        anchorEl={anchorEl}
        anchorOrigin={anchorOrigin || { vertical: 'top', horizontal: 'right' }}
        transformOrigin={transformOrigin || { vertical: 'top', horizontal: 'left' }}
        {...props}
        sx={{ pointerEvents: 'none', ...sx }}
      >
        <ClickAwayListener onClickAway={handleClose}>
          <Stack p={1} sx={{ ...sxStack, pointerEvents: 'auto' }} {...stack}>{children}</Stack>
        </ClickAwayListener>
      </Popover >
    </>
  );
};

export default React.memo(PopoverMenu);