'use client'
import { Icon } from "@/components/UI/Icon/Icon";
import InputButton from "@/components/UI/MUI/InputButton";
import InputText from "@/components/UI/MUI/InputText";
import { UserAction } from "@/DB/actions/UserAction";
import { IErrorResponse, IUser } from "@/DB/models/User";
import { encryptDataURI } from "@/utils/uid_crypto";
import { Avatar, Box, Container, Stack, Typography } from "@mui/material";
import { signIn, signOut, useSession } from "next-auth/react";
import { ValidationError } from "next/dist/compiled/amphtml-validator";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";

interface formType {
  authLogin?: string,
  name?: string,
  email?: string,
  image?: string,
  password?: string,
  github?: string,
  google?: string,
  imageData?: File,
}

const initialForm: formType = {
  authLogin: '',
  name: '',
  email: '',
  image: '',
  password: '',
  github: '',
  google: '',
}

const ProfileForm = () => {
  const { data: session, update: setSession } = useSession();
  const [form, setForm] = useState<formType>(initialForm);
  const [error, setError] = useState<ValidationError>({});
  const [isChanged, setIsChanged] = useState(true);


  console.log(session);


  useEffect(() => {
    const updateForm = async () => {
      if (!session || !session.user) return;
      setForm(prev => ({
        authLogin: prev.authLogin || session.user.authLogin || '',
        name: prev.name || session.user.name || '',
        email: prev.email || session.user.email || '',
        image: prev.image || session.user.image || '',
        github: prev.github || session.user.github || '',
        google: prev.google || session.user.google || '',
        password: '',
      }));
      setIsChanged(true);
    }
    updateForm();
  }, [session])

  if (!session || !session.user) return <div>Loading...</div>

  const LinkProviders = (provider: 'github' | 'google') => async () => {
    signIn(provider, { callbackUrl: `/auth/link-account?u=${encryptDataURI(session.user.id)}` });
  }

  const UnlinkProviders = (provider: 'github' | 'google') => async () => {
    const res = await UserAction.update(session.user.id, { [provider]: null });
    if (!res) return;
    await setSession({ ...session, user: { ...session.user, [provider]: null }, lastProvider: null });
  }

  const onChange = (field: keyof IUser) => (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    setForm((prev) => {
      const updatedForm = { ...prev, [field]: newValue };
      const formHasChanged = Object.keys(updatedForm).some((key) => {
        if (key === "imageData") return false; // Исключаем imageData из сравнения
        return updatedForm[key as keyof formType] !== (session?.user?.[key as keyof IUser] ?? "");
      });
      setIsChanged(!formHasChanged);
      return updatedForm;
    });
  }

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setForm(prev => {
      setIsChanged(false);
      return { ...prev, image: URL.createObjectURL(file), imageData: file }
    })
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
      const { authLogin, name, email, image, imageData } = form; //password
      let updateData = { authLogin, name, email, image, }
      let new_errors = null
      const res: IUser | IErrorResponse | null = await UserAction.update(session.user.id, updateData);
      if (res?.errors) new_errors = { ...res.errors }
      if (imageData) {
        const resImg: IUser | IErrorResponse | null = await UserAction.uploadAvatar(session.user.id, imageData);
        if (resImg?.errors) new_errors = { ...new_errors, ...resImg.errors }
        if (resImg && resImg.image) updateData = { ...updateData, image: resImg.image }
      }
      if (new_errors) {
        console.log(new_errors);
        setError(new_errors);
        return;
      }
      if (res) {
        await setSession({ ...session, user: { ...session.user, ...updateData }, lastProvider: null });
      }
    }
    catch { }
  }

  return (
    <Container sx={{ display: 'flex', height: '100vh', justifyContent: 'center', alignItems: 'center' }}>
      <form onSubmit={handleSubmit}>
        {/* <Frame paddingY={2} paddingX={4}> */}
        <Stack spacing={4}>
          <Typography variant="h4" gutterBottom textAlign='center'>
            Профиль
          </Typography>
          <Stack spacing={4} direction='row' alignItems='center' justifyContent='center'>
            <input hidden id="fileInput" type="file" accept=".jpg, .jpeg, .png" onChange={handleFileChange} />
            <label htmlFor="fileInput">
              <Box sx={{ position: 'relative' }}>
                <Avatar sx={{ width: 100, height: 100 }} alt="Remy Sharp" src={form.image} />
                <Stack sx={{ opacity: '0', transition: '.3s', '&:hover': { opacity: '.75' }, '&:active': { opacity: '1' }, position: 'absolute', inset: '0', background: '#11111190', borderRadius: '999999px' }} alignItems='center' justifyContent='center'>
                  <Icon icon='pen' />
                </Stack>
              </Box>
            </label>

            <Stack spacing={4}>
              <InputText helperText={error?.name} error={error?.name} onChange={onChange('name')} value={form.name} placeholder='Имя пользователя' label='Имя пользователя' labelActive />
              <InputText helperText={error?.authLogin} error={error?.authLogin} onChange={onChange('authLogin')} value={form.authLogin} placeholder='Логин авторизации' label='Логин авторизации' labelActive />
              <InputText helperText={error?.email} error={error?.email} onChange={onChange('email')} value={form.email} placeholder='Email' label='Email' labelActive />
            </Stack>
          </Stack>
          <Stack direction="row" width='100%' spacing={2}>
            <Stack width='100%' spacing={1}>
              <InputButton onClick={LinkProviders('github')} variant={form.github ? 'contained' : 'outlined'} size='large' startIcon='github' fullWidth />
              <InputButton disabled={!form.github} onClick={UnlinkProviders('github')} variant='text' size='small' fullWidth>Отключить</InputButton>
            </Stack>
            <Stack width='100%' spacing={1}>
              <InputButton onClick={LinkProviders('google')} variant={form.google ? 'contained' : 'outlined'} size='large' startIcon='google' fullWidth />
              <InputButton disabled={!form.google} onClick={UnlinkProviders('google')} variant='text' size='small' fullWidth>Отключить</InputButton>
            </Stack>
          </Stack>
          <InputButton disabled={isChanged} type='submit' variant='contained' size='large' fullWidth>Сохранить</InputButton>
          <InputButton size='small' variant='text' fullWidth onClick={() => { signOut({ callbackUrl: '/' }) }}>Выйти</InputButton>
        </Stack>
        {/* </Frame> */}
      </form>
    </Container>
  );
}


export default ProfileForm;