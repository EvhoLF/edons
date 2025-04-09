'use client'
import Frame from '@/components/UI/Frame/Frame'
import InputText from '@/components/UI/MUI/InputText'
import React, { ChangeEvent, useState } from 'react'
import AuthButton from '../AuthButton/AuthButton'
import InputLink from '@/components/UI/MUI/InputLink'
import { Box, Button, Divider, Stack, Typography } from '@mui/material'
import { redirect } from 'next/navigation'
import { enqueueSnackbar } from 'notistack'
// import { useRouter } from 'next/navigation'

interface IErrors { authLogin: null | string, email: null | string, password: null | string }

const initialDataForm = { authLogin: "", email: "", password: "" };

const SignupForm = () => {
  // const router = useRouter();
  const [form, setForm] = useState(initialDataForm);
  const [errors, setErrors] = useState<IErrors>(initialDataForm);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const new_errors: IErrors = { authLogin: "", email: "", password: "" };
    if (!form.authLogin) new_errors.authLogin = 'Вы не ввели Логин';
    if (!form.email) new_errors.email = 'Вы не ввели Email'
    if (!form.password) new_errors.password = 'Вы не ввели Пароль'
    if (!form.authLogin || !form.email || !form.password) return setErrors(new_errors);
    else {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        enqueueSnackbar('Пользователь успешно создан', { variant: 'success', });
        redirect('/profile');
      }
      else {
        enqueueSnackbar('Не удалось создать пользователя', { variant: 'error', });
      }
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
              <InputText name='authLogin' value={form.authLogin} onChange={setField('authLogin')} variant='standard' size="medium" placeholder='Логин' label='Логин' fullWidth
                error={!!errors.authLogin} helperText={errors.authLogin}
              />
              <InputText name='email' value={form.email} onChange={setField('email')} type='email' variant='standard' size="small" placeholder='Email' label='Email' fullWidth
                error={!!errors.email} helperText={errors.email}
              />
              <InputText name='password' value={form.password} onChange={setField('password')} type='password' variant='standard' size="medium" placeholder='Пароль' label='Пароль' fullWidth
                error={!!errors.password} helperText={errors.password}
              />
              <Stack width='100%' spacing={1}>
                <Button type='submit' variant='contained' size='large' fullWidth>Зарегистрироваться</Button>
                <Typography variant='caption' textAlign='center' >
                  <InputLink fontSize='14px' href='/auth/signin'>
                    <Typography variant='caption' color='textPrimary' sx={{ fontSize: 'inherit', fontWeight: 'inherit' }}>Уже есть аккаунт?</Typography> Авторизироваться</InputLink>
                </Typography>
              </Stack>
            </Stack>
          </form >
          <Divider>ИЛИ</Divider>
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