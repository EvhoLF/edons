import { CircularProgress } from '@mui/material'
import React from 'react'

const LoaderCircular = ({ sx = {}, ...props }) => {
  return (
    <>
      <svg width={0} height={0}>
        <defs>
          <linearGradient id="my_gradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#de2163" />
            <stop offset="100%" stopColor="#df1b7d" />
          </linearGradient>
        </defs>
      </svg>
      <CircularProgress size='3rem' {...props} sx={{ ...sx, 'svg circle': { stroke: 'url(#my_gradient)' } }} />
    </>
  )
}

export default LoaderCircular