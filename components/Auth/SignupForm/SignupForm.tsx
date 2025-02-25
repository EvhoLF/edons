'use client'
import Button from '@/components/UI/Button/Button'
import Frame from '@/components/UI/Frame/Frame'
import InputText from '@/components/UI/InputText/InputText'
import React from 'react'
import styles from "./SignupForm.module.scss";
import LineDivider from '@/components/UI/LineDivider/LineDivider';
import NavLink from '@/components/UI/NavLink/NavLink';
import AuthButton from '../AuthButton/AuthButton'

const SignupForm = () => {
  return (
    <Frame className={styles.SignupForm}>
      <h1>Зарегистрироваться</h1>
      <InputText placeholder='Логин' />
      <InputText placeholder='Email' />
      <InputText placeholder='Пароль' />
      <InputText placeholder='Пароль' />
      <div>
        <Button>Зарегистрироваться</Button>
        <NavLink variant='gradient' href='/auth/signin'>Авторизироваться</NavLink>
      </div>
      <LineDivider>ИЛИ</LineDivider>
      <div className={styles.providersButtons}>
        <AuthButton provider='github' />
        <AuthButton provider='google' />
      </div>
    </Frame>
  )
}

export default SignupForm