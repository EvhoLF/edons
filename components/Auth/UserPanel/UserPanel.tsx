'use client'
import InputButton from '@/components/UI/MUI/InputButton';
import { Avatar, IconButton, Link, Stack, Typography } from '@mui/material';
import { useSession } from 'next-auth/react';
import { memo } from 'react';

const UserPanel = () => {
  const { data: session } = useSession();
  if (!session) return <InputButton variant='contained' startIcon='profile' href='/profile'>Войти</InputButton>
  return (
    <Link href='/profile' sx={{ textDecoration: 'none' }} color='ui'>
      <Stack direction='row' justifyContent='center' alignItems='center' spacing={1}>
        <IconButton sx={{ scale: '1', padding: .25, }} color='primary'>
          <Avatar sx={{ width: '40px', height: '40px' }} alt="user" src={session?.user?.image} />
        </IconButton>
        {/* <Typography variant='h6' fontWeight='300'>Profile</Typography> */}
      </Stack>
    </Link>
  );
};


export default memo(UserPanel)