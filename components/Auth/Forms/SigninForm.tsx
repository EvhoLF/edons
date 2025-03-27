"use client";
import Frame from "@/components/UI/Frame/Frame";
import InputText from "@/components/UI/MUI/InputText";
import React, { ChangeEvent, FormEvent, useState } from "react";
import AuthButton from "../AuthButton/AuthButton";
import InputLink from "@/components/UI/MUI/InputLink";
import { Box, Button, Divider, Stack, Typography } from "@mui/material";
import { signIn } from "next-auth/react";
import { useSearchParams, useRouter } from "next/navigation";

interface IErrors { loginEmail: null | string, password: null | string, error: null | string }

const initialDataForm = { loginEmail: "", password: "" };

const SigninForm = () => {
  const [form, setForm] = useState(initialDataForm);
  const [errors, setErrors] = useState<IErrors>({ ...initialDataForm, error: '' });
  const searchParams = useSearchParams();
  const router = useRouter();

  let callbackUrl = searchParams.get("callbackUrl") || "/profile";

  if (callbackUrl.includes("/auth/signin")) {
    callbackUrl = "/profile";
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const new_errors: IErrors = { loginEmail: null, password: null, error: null };
    if (!form.loginEmail) new_errors.loginEmail = 'Вы не ввели Логин или Email';
    if (!form.password) new_errors.password = 'Вы не ввели Пароль'
    if (!form.loginEmail || !form.password) return setErrors(new_errors);
    else {
      const res = await signIn("credentials", { ...form, redirect: false });
      if (res?.error) {
        setErrors({ ...initialDataForm, error: 'Неправильный Логин или Пароль' });
      }
      else {
        setErrors({ ...initialDataForm, error: '' });
        router.push(callbackUrl);
      }
    }
  };

  const setField = (field: string) => (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [field]: e.target.value });
  };

  return (
    <Box sx={{ width: "400px" }}>
      <Frame>
        <Stack spacing={4} padding={2} alignItems="center">
          <form style={{ width: "100%" }} onSubmit={handleSubmit}>
            <Stack spacing={3} padding={2} alignItems="center">
              <Typography variant="h4" gutterBottom textAlign="center">
                Войти
              </Typography>
              <InputText
                onChange={setField("loginEmail")}
                name="loginEmail"
                variant="standard"
                size="medium"
                placeholder="Логин или Email"
                label="Логин или Email"
                fullWidth
                error={!!errors.loginEmail}
                helperText={errors.loginEmail}
              />
              <InputText
                onChange={setField("password")}
                name="password"
                variant="standard"
                size="small"
                placeholder="Пароль"
                label="Пароль"
                fullWidth
                error={!!errors.password}
                helperText={errors.password}
              />
              <Typography fontSize='0.85rem' color='error'>{errors.error}</Typography>
              <Stack width="100%" spacing={1}>
                <Button type="submit" variant="contained" size="large" fullWidth>
                  Войти
                </Button>
                <Typography variant="caption" textAlign="center">
                  <InputLink fontSize="14px" href="/auth/signup">
                    <Typography variant="caption" color="textPrimary" sx={{ fontSize: "inherit", fontWeight: "inherit" }}>
                      Нет аккаунта?
                    </Typography>{" "}
                    Зарегистрироваться
                  </InputLink>
                </Typography>
              </Stack>
            </Stack>
          </form>
          <Stack width='100%'>
            <Divider>ИЛИ</Divider>
          </Stack>
          <Stack direction="row" width="100%" spacing={2}>
            <AuthButton provider="github" callbackUrl={callbackUrl} />
            <AuthButton provider="google" callbackUrl={callbackUrl} />
          </Stack>
        </Stack>
      </Frame>
    </Box>
  );
};

export default SigninForm;
