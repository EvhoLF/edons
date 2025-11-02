'use client'
import React, { useCallback } from 'react';
import { Stack, IconButton, Typography, Divider, Button, Link } from '@mui/material';
import { Icon } from '@/components/UI/Icon/Icon';
import Frame from '@/components/UI/Frame/Frame';
import NextLinkButton from '@/components/UI/MUI/NextLinkButton';
import PopoverMenu from '@/components/UI/MUI/PopoverMenu';
import InputButton from '@/components/UI/MUI/InputButton';
import { signIn, useSession } from 'next-auth/react';
import { encryptDataURI } from '@/utils/uid_crypto';
import { useModal } from '@/hooks/useModal';
import ModalImportGitHub from '@/components/Modals/ModalImportGitHub';

const PanelMenu = ({ GitLoadRepo = () => { }, isPublicAccess = false, saveMap = () => { }, TakeScreenshot = () => { }, LoadFromGitMap = () => { }, LoadFromFileMap = () => { }, githubAccess = false, repos = [] }) => {
  const { data: session } = useSession();
  const { showModal, closeModal } = useModal();

  const GitNode = () => githubAccess && session
    ? repos?.length > 0
      ? repos.map(e => (<InputButton onClick={() => LoadFromGitMap(e)} key={e.id} draggable="false" variant='text'><Typography fontSize='.8rem' textAlign='center' color='ui'>{e.name}</Typography></InputButton>))
      : <Typography fontSize='.8rem' textAlign='center' color='ui'>Нет репозиториев</Typography>
    : <>
      <Typography fontSize='.8rem' textAlign='center' color='ui'>Подключите GitHub для доступа к своим репозиториям</Typography>
      <InputButton onClick={async () => {
        saveMap();
        signIn('github', { prompt: 'select_account', callbackUrl: `/auth/link-account?u=${encryptDataURI(session.user.id)}` })
      }} variant='contained' size='large' startIcon='github' fullWidth />
    </>

  const ShowModalGitURl = useCallback(() => {
    showModal({
      content: (
        <ModalImportGitHub
          onRepoSelect={GitLoadRepo}
          closeModal={closeModal}
        />
      ),
    });
  }, [closeModal, showModal, GitLoadRepo]);

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
        
        {/* Для авторизованных пользователей - их репозитории */}
        {githubAccess && session && (
          <PopoverMenu
            openButton={({ handleOpen }) => <InputButton disabled={isPublicAccess} fullWidth onClick={handleOpen} draggable="false" variant='text'><Typography fontSize='.8rem' textAlign='center' color='ui'>Мои репозитории</Typography></InputButton>}
            sx={{ marginLeft: 2 }}
            stack={{ spacing: 1 }}
          >
            <Stack maxHeight='300px'>
              <GitNode />
            </Stack>
          </PopoverMenu>
        )}
        
        {/* Для всех - импорт публичных репозиториев */}
        <Button onClick={ShowModalGitURl} draggable="false" variant='text'>
          <Typography fontSize='.8rem' textAlign='center' color='ui'>
            Импорт публичного репозитория
          </Typography>
        </Button>

        <InputButton onClick={LoadFromFileMap} draggable="false" variant='text'>
          <Typography fontSize='.8rem' textAlign='center' color='ui'>
            Импорт из файла
          </Typography>
        </InputButton>
      </PopoverMenu>
    </Frame>
  );
};

export default React.memo(PanelMenu);