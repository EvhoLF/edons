import React from 'react'
import InputLink from '../UI/InputLink/InputLink'
import InputButton from '../UI/InputButton/InputButton'
import { Icon } from '../UI/Icon/Icon'
import { Stack, Typography } from '@mui/material'
import styles from "./Header.module.scss"
import Frame from '../UI/Frame/Frame'
import clsx from 'clsx'

const Header = ({ unfixed = false }) => {
  return (
    <header className={clsx(styles.header, { [styles.fixed]: !unfixed })}>
      <Frame>
        <Stack direction='row' spacing={3} paddingX={1} alignItems='center'>
          <Typography variant='h6' textAlign='center'>
            <Stack direction='row' spacing={1} alignItems='center'>
              <Icon icon="edons" />EDONs
            </Stack>
          </Typography>
          <nav>
            <Stack direction='row' spacing={1} alignItems='center'>
              <InputLink href='#'>Docs</InputLink>
              <InputLink href='/workspace'>Worksapce</InputLink>
              <InputLink href='#'>Contact</InputLink>
            </Stack>
          </nav>
          <InputButton variant='contained' startIcon='profile' href='/profile'>Profile</InputButton>
        </Stack>
      </Frame>
    </header >
  )
}

export default Header