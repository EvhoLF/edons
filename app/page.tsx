import clsx from "clsx";
import styles from "./page.module.scss";
import Head from "next/head";
import BG from "@/components/UI/BG/BG";
import { Box, Button, Container, Grid, Grid2, Stack, Typography } from "@mui/material";
import Header from "@/components/Header/Header";
import Frame from "@/components/UI/Frame/Frame";
import ContactForm from "@/components/UI/ContactForm/ContactForm";
import GettingStarted from "@/components/UI/GettingStarted/GettingStarted";
import Image from "next/image";

export default function Home() {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      </Head>
      <Header />
      <Container maxWidth='lg' >
        <main className={styles.main}>
          <section className={clsx(styles.section, styles.sectionFull, styles.center)}>
            <Grid2 container>
              <Grid2 size={{ xs: 12, md: 6 }}>
                <Stack spacing={3}>
                  <Typography variant='h3'>EDONs Визуализация, анализ, оптимизация кода</Typography>
                  <Typography variant='body1'>Разбирайтесь в коде быстрее. Автоматический анализ, визуализация зависимостей, рекомендации по улучшению и совместная работа — всё в одном месте</Typography>
                  <Stack direction='row' spacing={2}>
                    <Button href='/maps' size='large' variant='contained'>Начать работать</Button>
                    <Button href='/documentation' size='large' variant='outlined'>Узнать подробнее</Button>
                  </Stack>
                </Stack>
              </Grid2>
              <Grid2 size={{ xs: 12, md: 6 }}>
                <Box sx={{ position: 'relative', width: '100%', height: 300 }}>
                  <Image style={{ objectFit: 'contain' }} fill alt='' src='/ui/s1.png' />
                </Box>
              </Grid2>
            </Grid2>
          </section>

          <div className={styles.sections}>
            <section>
              <Stack spacing={2}>
                <Typography variant='h3'>Что такое EDONs?</Typography>
                <Typography variant='h6'>
                  EDONs — это универсальная платформа для анализа и визуализации архитектуры программного обеспечения. Мы упрощаем рутинные задачи благодаря автоматическому анализу кода, удобному редактору архитектурных схем и совместной работе в реальном времени. С помощью EDONs команда быстрее находит взаимосвязи, эффективно планирует работу и ускоряет процесс разработки.
                </Typography>
              </Stack>
            </section>
            <section>
              <Grid2 container spacing={2}>
                <Grid2 size={{ xs: 12, md: 8 }}>
                  <Frame>
                    <Stack height='200px' justifyContent='end' p={2}>
                      <Typography variant='h4'>Визуализация</Typography>
                      <Typography>Интерактивная карта зависимостей</Typography>
                    </Stack>
                  </Frame>
                </Grid2>
                <Grid2 size={{ xs: 12, md: 4 }}>
                  <Frame>
                    <Stack height='200px' justifyContent='end' p={2}>
                      <Typography variant='h4'>Анализ кода</Typography>
                      <Typography>Парсинг репозиториев GitHub</Typography>
                    </Stack>
                  </Frame>
                </Grid2>
                <Grid2 size={{ xs: 12, md: 4 }}>
                  <Frame>
                    <Stack height='200px' justifyContent='end' p={2}>
                      <Typography variant='h4'>Экспорт</Typography>
                      <Typography>Сохранение схемы в PNG и прочие форматы</Typography>
                    </Stack>
                  </Frame>
                </Grid2>
                <Grid2 size={{ xs: 12, md: 8 }}>
                  <Frame>
                    <Stack height='200px' justifyContent='end' p={2}>
                      <Typography variant='h4'>Совместная работа</Typography>
                      <Typography>Редактирование в реальном времени, отслеживание действий коллег</Typography>
                    </Stack>
                  </Frame>
                </Grid2>
              </Grid2>
            </section>

            <section>
              <GettingStarted />
            </section>

            <section>
              <Container maxWidth='lg'>
                <ContactForm />
              </Container>
            </section>
          </div>
        </main>


        <footer className={styles.footer}>
          <Stack alignItems='center' p={2} mt={10}>
            <Typography>
              © 2025. All rights reserved - by Chistoedov Maxim
            </Typography>
          </Stack>
        </footer>
      </Container>

      <BG />
    </>
  );
}
