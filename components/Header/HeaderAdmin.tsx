import React from 'react'
import InputLink from '../UI/MUI/InputLink'
import { Icon } from '../UI/Icon/Icon'
import { IconButton, Link, Stack, Tooltip, Typography } from '@mui/material'
import styles from "./Header.module.scss"
import Frame from '../UI/Frame/Frame'
import clsx from 'clsx'
import UserPanel from '../Auth/UserPanel/UserPanel'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/libs/auth'
import { UserRole } from '@/DB/models/User'

const Header = async ({ unfixed = false }) => {
  const session = await getServerSession(authOptions);
  const isAdmin = session ? session?.user?.role == UserRole.ADMIN || false : false;

  return (
    <header className={clsx(styles.header, { [styles.fixed]: !unfixed })}>
      <Stack direction='row' spacing={2}>
        <Frame>
          <nav>
            <Stack direction='row' spacing={3} paddingX={1} alignItems='center'>
              <Link href='/' style={{ textDecoration: 'none' }} color='ui' sx={{ transition: '.3s', "&:hover": { color: '#de2163' }, "&:active": { color: '#9b1745' } }}>
                <Stack direction='row' spacing={1} alignItems='center'>
                  <Icon icon="edons" />
                  <Typography variant='h5' textAlign='center'>
                    EDONs
                  </Typography>
                </Stack>
              </Link>

              <Stack direction='row' spacing={2} alignItems='center'>
                <InputLink href='#'>Документация</InputLink>
                <InputLink href='/contact'>Конаткты </InputLink>
                <InputLink href='/maps'>Карты</InputLink>
              </Stack>


              <UserPanel />

              {/* <InputButton variant='contained' startIcon='profile' href='/profile'>

          </InputButton> */}
            </Stack>
          </nav>
        </Frame>
        {
          isAdmin && <Frame>
            <Stack height='100%' width='100%' direction='row' spacing={2} alignItems='center' justifyContent='center'>
              <Tooltip title='Админ панель'>
                <IconButton href='/admin'><Icon fontSize='medium' icon='option' /></IconButton>
              </Tooltip>
            </Stack>
          </Frame>
        }
      </Stack>
    </header >
  )
}

export default Header