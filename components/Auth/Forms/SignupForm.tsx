'use client'
import InputButton from '@/components/UI/InputButton/InputButton'
import Frame from '@/components/UI/Frame/Frame'
import InputText from '@/components/UI/InputText/InputText'
import React, { ChangeEvent, useState } from 'react'
import LineDivider from '@/components/UI/LineDivider/LineDivider';
import AuthButton from '../AuthButton/AuthButton'
import InputLink from '@/components/UI/InputLink/InputLink'
import { Box, Stack, Typography } from '@mui/material'
import { redirect } from 'next/navigation'
// import { useRouter } from 'next/navigation'

const SignupForm = () => {
  // const router = useRouter();
  const [form, setForm] = useState({ authLogin: "", email: "", password: "", });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    console.log(data);


    if (res.ok) {
      redirect('/profile')
    } else if (res.status === 400) {
    } else if (res.status === 500) {

    }
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
                Регистрация
              </Typography>
              <InputText name='authLogin' value={form.authLogin} onChange={setField('authLogin')} variant='standard' size="medium" placeholder='Логин' label='Логин' fullWidth />
              <InputText name='email' value={form.email} onChange={setField('email')} type='email' variant='standard' size="small" placeholder='Email' label='Email' fullWidth />
              <InputText name='password' value={form.password} onChange={setField('password')} type='password' variant='standard' size="medium" placeholder='Пароль' label='Пароль' fullWidth />
              <Stack width='100%' spacing={1}>
                <InputButton type='submit' variant='contained' size='large' fullWidth>Зарегистрироваться</InputButton>
                <Typography variant='caption' textAlign='center' >
                  <InputLink fontSize='14px' href='/auth/signin'>
                    <Typography variant='caption' color='textPrimary' sx={{ fontSize: 'inherit', fontWeight: 'inherit' }}>Уже есть аккаунт?</Typography> Войти</InputLink>
                </Typography>
              </Stack>
            </Stack>
          </form >
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

export default SignupForm