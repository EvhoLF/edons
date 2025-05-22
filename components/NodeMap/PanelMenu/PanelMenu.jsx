'use client'
import React from 'react';
import { Stack, IconButton, Typography, Divider, Button, Link } from '@mui/material';
import { Icon } from '@/components/UI/Icon/Icon';
import Frame from '@/components/UI/Frame/Frame';
import NextLinkButton from '@/components/UI/MUI/NextLinkButton';
import PopoverMenu from '@/components/UI/MUI/PopoverMenu';
import InputButton from '@/components/UI/MUI/InputButton';
import { signIn, useSession } from 'next-auth/react';
import { encryptDataURI } from '@/utils/uid_crypto';

const PanelMenu = ({ isPublicAccess = false, saveMap = () => { }, TakeScreenshot = () => { }, LoadFromGitMap = () => { }, githubAccess = false, repos = [] }) => {
  const { data: session } = useSession();

  const GitNode = () => githubAccess && session
    ? repos?.length > 0
      ? repos.map(e => (<InputButton onClick={() => LoadFromGitMap(e)} key={e.id} draggable="false" variant='text'><Typography fontSize='.8rem' textAlign='center' color='ui'>{e.name}</Typography></InputButton>))
      : <Typography fontSize='.8rem' textAlign='center' color='ui'>Нет репозиториев</Typography>
    : <>
      <Typography fontSize='.8rem' textAlign='center' color='ui'>Подключите GitHub</Typography>
      <InputButton onClick={async () => {
        saveMap();
        signIn('github', { prompt: 'select_account', callbackUrl: `/auth/link-account?u=${encryptDataURI(session.user.id)}` })
      }} variant='contained' size='large' startIcon='github' fullWidth />
    </>

  return (
    <Frame sx={{ width: 'fit-content' }} p={.5}>
      <PopoverMenu
        openButton={({ handleOpen }) => <IconButton onClick={handleOpen} color='primary'><Icon icon='list' color='ui' /></IconButton>}
        sx={{ marginLeft: 2, }}
        stack={{ spacing: 1 }}
      >
        <Stack>
          <Link href='/' draggable="false" border='none' sx={{ textDecoration: 'none' }}><Typography variant='h5' textAlign='center'>EDONs</Typography></Link>
        </Stack>
        <Divider />
        <NextLinkButton href='/maps' draggable="false" variant='text'><Typography fontSize='.8rem' textAlign='center' color='ui'>Карты</Typography></NextLinkButton>
        <Divider />
        <InputButton onClick={saveMap} draggable="false" variant='text'><Typography fontSize='.8rem' textAlign='center' color='ui'>Сохранить карту</Typography></InputButton>
        <Button onClick={TakeScreenshot} draggable="false" variant='text'><Typography fontSize='.8rem' textAlign='center' color='ui'>Снимок экрана</Typography></Button>
        <Divider />
        <PopoverMenu
          openButton={({ handleOpen }) => <InputButton disabled={isPublicAccess} fullWidth onClick={handleOpen} draggable="false" variant='text'><Typography fontSize='.8rem' textAlign='center' color='ui'>Импорт GitHub</Typography></InputButton>}
          sx={{ marginLeft: 2 }}
          stack={{ spacing: 1 }}
        >
          <Stack maxHeight='300px'>
            <GitNode />
          </Stack>
        </PopoverMenu>
        {/* <NextLinkButton href='/' draggable="false" variant='text'><Typography fontSize='.8rem' textAlign='center' color='ui'>Экспорт</Typography></NextLinkButton> */}
      </PopoverMenu>
    </Frame >
  );
};

export default React.memo(PanelMenu);
