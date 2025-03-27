import BG from "@/components/UI/BG/BG";
import { Box, Container, Grid2, Stack, Typography } from "@mui/material";
import Header from "@/components/Header/Header";
import Frame from "@/components/UI/Frame/Frame";
import InputText from "@/components/UI/MUI/InputText";
import { Icon } from "@/components/UI/Icon/Icon";
import InputButton from "@/components/UI/MUI/InputButton";
import InputLink from "@/components/UI/MUI/InputLink";

export default function Home() {
  return (
    <>
      <Header />
      <Container maxWidth='lg' sx={{ marginY: 15 }}>
        <Stack spacing={5}>
          <Stack spacing={1}>
            <Stack direction='row' justifyContent='center' alignItems='center' spacing={1}><Icon sx={{ height: '20px' }} icon='mail' /><Typography variant='subtitle1' textTransform='uppercase' fontSize={16} lineHeight={1} textAlign='center'>Связаться с нами</Typography></Stack>
            <Typography variant='h2' textAlign='center' lineHeight={1}>Мы с радостью<br />ответим на ваши вопросы</Typography>
            <Typography textAlign='center'>Мы стараемся ответить как можно скорее, обычно в течение пары дней</Typography>
          </Stack>
          <Frame p={2}>
            <Grid2 container spacing={5}>
              <Grid2 size={{ xs: 12, md: 6 }}>
                <Frame p={3}>
                  <Stack spacing={3}>
                    <InputText label='Ваш Email' />
                    <InputText label='Ваше сообщение' minRows={5} multiline sx={{ '& *': { padding: '0px' } }} />
                    <InputButton variant='contained_alt'>Отправить</InputButton>
                  </Stack>
                </Frame>
              </Grid2>
              <Grid2 size={{ xs: 12, md: 6 }}>
                <Stack spacing={2} p={2} height={'100%'} justifyContent='space-between'>
                  <Stack spacing={3}>
                    <Typography textAlign='center' variant='h5' fontWeight='300'>Вы также можете найти нас на...</Typography>
                    <InputButton fullWidth href='https://github.com/EvhoLF' startIcon='github' sx={{ fontSize: '18px' }}>GitHub</InputButton>
                    <InputButton fullWidth href='https://t.me/EDONs_channel' startIcon='telegram' sx={{ fontSize: '18px' }}>Telegram</InputButton>
                    <InputButton fullWidth href='https://t.me/EDONs_bot' startIcon='telegram' sx={{ fontSize: '18px' }}>Telegram Bot</InputButton>
                  </Stack>
                  <Typography textAlign='center' variant='body1' fontWeight='300'>... или написать на edons_info@gmail.com</Typography>
                </Stack>
              </Grid2>
            </Grid2>
          </Frame>
        </Stack>
      </Container >
      <BG />
    </>
  );
}
