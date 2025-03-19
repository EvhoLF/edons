'use client'
import InputButton from '@/components/UI/InputButton/InputButton'
import Frame from '@/components/UI/Frame/Frame'
import InputText from '@/components/UI/InputText/InputText'
import React, { ChangeEvent, FormEvent, useState } from 'react'
import LineDivider from '@/components/UI/LineDivider/LineDivider';
import AuthButton from '../AuthButton/AuthButton'
import InputLink from '@/components/UI/InputLink/InputLink'
import { Box, Stack, Typography } from '@mui/material'
import { signIn } from 'next-auth/react'

const SigninForm = () => {
  const [form, setForm] = useState({ loginEmail: "", password: "", });

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const res = await signIn("credentials", { ...form, callbackUrl: "/profile" });
    if (res?.error) { console.log(res.error); };
  };

  const setField = (field: string) => (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [field]: e.target.value })
  }

  return (
    <Box sx={{ width: '400px' }} >
      <Frame>
        <Stack spacing={4} padding={2} alignItems='center'>
          <form style={{ width: '100%' }} onSubmit={handleSubmit}>
            <Stack spacing={3} padding={2} alignItems='center'>
              <Typography variant="h4" gutterBottom textAlign='center'>
                Ввойти
              </Typography>
              <InputText onChange={setField('loginEmail')} name='loginEmail' variant='standard' size="medium" placeholder='Login или Email' label='Email или Login' fullWidth />
              <InputText onChange={setField('password')} name='password' variant='standard' size="small" placeholder='Пароль' label='Пароль' fullWidth />
              <Stack width='100%' spacing={1}>
                <InputButton type='submit' variant='contained' size='large' fullWidth>Ввойти</InputButton>
                <Typography variant='caption' textAlign='center' >
                  <InputLink fontSize='14px' href='/auth/signup'><Typography variant='caption' color='textPrimary' sx={{ fontSize: 'inherit', fontWeight: 'inherit' }}>Нет аккаунта?</Typography> Зарегистрироваться</InputLink>
                </Typography>
              </Stack>
            </Stack>
          </form>
          <LineDivider>ИЛИ</LineDivider>
          <Stack direction="row" width='100%' spacing={2}>
            <AuthButton provider='github' />
            <AuthButton provider='google' />
          </Stack>
        </Stack>
      </Frame >
    </Box>
  )
};

export default SigninForm