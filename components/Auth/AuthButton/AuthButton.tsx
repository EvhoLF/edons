"use client";
import InputButton from "@/components/UI/MUI/InputButton";
import { ButtonProps } from "@mui/material";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import React, { FC } from "react";

interface AuthButtonProps extends ButtonProps {
  provider: "github" | "google";
  callbackUrl?: string;
}

const AuthButton: FC<AuthButtonProps> = ({ provider, children, callbackUrl, ...props }) => {
  const searchParams = useSearchParams();
  const defaultCbUrl = searchParams.get("callbackUrl") || "/profile";

  // ⚠️ Проверяем callbackUrl и защищаем от редиректа на /auth/signin
  let cbUrl = callbackUrl ?? defaultCbUrl;
  if (cbUrl.includes("/auth/signin")) {
    cbUrl = "/profile";
  }

  return (
    <InputButton
      onClick={() => signIn(provider, { callbackUrl: cbUrl })}
      size="large"
      variant="outlined"
      startIcon={provider}
      fullWidth
      {...props}
    >
      {children}
    </InputButton>
  );
};

export default AuthButton;
