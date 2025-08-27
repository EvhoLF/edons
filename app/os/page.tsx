'use client'
import { Typography } from '@mui/material'
import React from 'react'

const page = () => {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '2rem',
      margin: '2rem 0'
    }}
    >
      <Typography variant='h3' textAlign='center'>OUR STORY</Typography>
      <div style={{
        position: 'relative',
        width: '100%',
        height: '480px',
        maxWidth: '850px',
        margin: '0 auto'
      }}>
        <iframe
          src="/game/index.html"
          style={{
            // position: 'absolute',
            width: '850px',
            height: '550px',
            border: 'none'
          }}
          title="Legacy Content"
        />
      </div>
    </div >
  )
}

export default page