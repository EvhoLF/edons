import React from 'react'
import InputLink from '../UI/MUI/InputLink'
import { Icon } from '../UI/Icon/Icon'
import { Link, Stack, Typography } from '@mui/material'
import styles from "./Header.module.scss"
import Frame from '../UI/Frame/Frame'
import clsx from 'clsx'
import InputButton from '../UI/MUI/InputButton'
import UserPanel from '../Auth/UserPanel/UserPanel'

const Header = ({ unfixed = false }) => {
  return (
    <header className={clsx(styles.header, { [styles.fixed]: !unfixed })}>
      <Frame>
        <Stack direction='row' spacing={3} paddingX={1} alignItems='center'>
          <Link href='/' style={{ textDecoration: 'none' }} color='ui' sx={{ transition: '.3s', "&:hover": { color: '#de2163' }, "&:active": { color: '#9b1745' } }}>
            <Stack direction='row' spacing={1} alignItems='center'>
              <Icon icon="edons" />
              <Typography variant='h5' textAlign='center'>
                EDONs
              </Typography>
            </Stack>
          </Link>
          <nav>
            <Stack direction='row' spacing={2} alignItems='center'>
              <InputLink href='/maps'>Карты</InputLink>
              <InputLink href='#'>Документация</InputLink>
              <InputLink href='/contact'>Связаться </InputLink>
            </Stack>
          </nav>

          <UserPanel />

          {/* <InputButton variant='contained' startIcon='profile' href='/profile'>

          </InputButton> */}
        </Stack>
      </Frame>
    </header >
  )
}

export default Header