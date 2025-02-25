'use client'
import Button from '@/components/UI/Button/Button'
import Frame from '@/components/UI/Frame/Frame'
import InputText from '@/components/UI/InputText/InputText'
import React from 'react'
import styles from "./SigninForm.module.scss";
import LineDivider from '@/components/UI/LineDivider/LineDivider';
import NavLink from '@/components/UI/NavLink/NavLink';
import AuthButton from '../AuthButton/AuthButton'

const SigninForm = () => {
  return (
    <Frame className={styles.SigninForm}>
      <h1>Авторизироваться</h1>
      <InputText placeholder='Логин' label='Логин' />
      <InputText placeholder='Пароль' label='Пароль' />
      <div className={styles.SigninForm_buttons}>
        <Button fillX>Авторизироваться</Button>
        <NavLink variant='gradient' href='/auth/signup'>Создать аккаунт</NavLink>
      </div>
      <LineDivider>ИЛИ</LineDivider>
      <div className={styles.providersButtons}>
        <AuthButton provider='github' />
        <AuthButton provider='google' />
      </div>
    </Frame>
  )
}

export default SigninForm