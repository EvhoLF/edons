import { Stack, Typography } from '@mui/material'
import React from 'react'

const EntityEl = ({ text = '-' }) => {
  return (
    <Stack direction='row' height='100%' width='100%' alignItems='center' justifyContent='center' spacing={2}><Typography>{text}</Typography></Stack>
  )
}

export default EntityEl