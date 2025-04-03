'use client'
import React, { useRef } from 'react';
import {
  Menu,
  MenuItem,
  ListItemText,
  ListItemIcon,
  IconButton,
  Tooltip,
  Divider,
  Stack
} from '@mui/material';
import { Icon } from '../UI/Icon/Icon';
import Frame from '../UI/Frame/Frame';

const AdminHeader = () => {
  const ref = useRef(null);
  const [open, setOpen] = React.useState(false);

  const handleClick = () => setOpen(true)
  const handleClose = () => setOpen(false)
  const handleNavigation = (href) => handleClose();

  return (
    <>
      <Frame ref={ref} aria-controls="admin-dropdown-menu" aria-haspopup="true" aria-expanded={open ? 'true' : undefined} >
        <Stack height='100%' width='100%' direction='row' spacing={2} alignItems='center' justifyContent='center'>
          <Tooltip title='Админ панель'>
            <IconButton onClick={handleClick}><Icon fontSize='medium' icon='option' /></IconButton>
          </Tooltip>
        </Stack>
      </Frame>


      <Menu
        disableScrollLock
        id="admin-dropdown-menu"
        anchorEl={ref.current}
        open={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right', }}
        transformOrigin={{ vertical: 'top', horizontal: 'right', }}
        PaperProps={{ style: { marginTop: '12px', }, }}
      >
        {/* Основные ссылки */}
        <MenuItem onClick={() => handleNavigation('/admin/dashboard')} component="a" href="/admin">
          <ListItemIcon> <Icon fontSize="medium" icon='dashboard' /></ListItemIcon>
          <ListItemText>Админ панель</ListItemText>
        </MenuItem>

        <MenuItem onClick={() => handleNavigation('/admin/users')} component="a" href="/admin/log">
          <ListItemIcon> <Icon fontSize="medium" icon='book' /></ListItemIcon>
          <ListItemText>Журнал</ListItemText>
        </MenuItem>

        <MenuItem onClick={() => handleNavigation('/admin/users')} component="a" href="/admin/users">
          <ListItemIcon> <Icon fontSize="medium" icon='users' /></ListItemIcon>
          <ListItemText>Пользователи</ListItemText>
        </MenuItem>

        <MenuItem onClick={() => handleNavigation('/admin/settings')} component="a" href="/admin/maps">
          <ListItemIcon> <Icon fontSize="medium" icon='map' /></ListItemIcon>
          <ListItemText>Карты</ListItemText>
        </MenuItem>
      </Menu>
    </>
  );
};

export default AdminHeader;