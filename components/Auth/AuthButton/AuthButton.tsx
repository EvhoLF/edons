"use client";
import { Button, ButtonProps } from "@mui/material";
// import InputButton, { InputButtonProps } from "@/components/UI/InputButton/InputButton";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import React, { FC } from "react";

interface AuthButtonProps extends ButtonProps {
  provider: "github" | "google";
  callbackUrl?: string;
}

const AuthButton: FC<AuthButtonProps> = ({ provider, children, callbackUrl = '/profile', ...props }) => {
  const searchParams = useSearchParams();
  const defaultCbUrl = searchParams.get("callbackUrl") || "/profile";
  const cbUrl = callbackUrl ?? defaultCbUrl;

  return (
    <Button
      onClick={() => signIn(provider, { callbackUrl: cbUrl })}
      size="large"
      variant="outlined"
      startIcon={provider}
      fullWidth
      {...props}
    >
      {children}
    </Button>
  );
};

export default AuthButton;
