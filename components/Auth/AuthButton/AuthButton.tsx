"use client"
import Button, { ButtonProps } from '@/components/UI/Button/Button'
import { signIn } from 'next-auth/react'
import { useSearchParams } from 'next/navigation'
import React, { FC } from 'react'

interface AuthButton extends ButtonProps {
  provider: 'github' | 'google'
}

const AuthButton: FC<AuthButton> = ({ provider, children, ...props }) => {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/profile';
  return (
    <Button iconLeft={provider} fillX onClick={() => signIn(provider, { callbackUrl })} {...props}>{children}</Button>
  )
}

export default AuthButton