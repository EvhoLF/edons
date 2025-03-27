import clsx from "clsx";
import styles from "./page.module.scss";
import Head from "next/head";
import BG from "@/components/UI/BG/BG";
import { Button, Container, Stack, Typography } from "@mui/material";
import Header from "@/components/Header/Header";

export default function Home() {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      </Head>
      <Header />
      <Container maxWidth='xl' >
        <main className={styles.main}>
          <section className={clsx(styles.section, styles.sectionFull, styles.center)}>
            <div className={styles.dividerA}>
              <div className={styles.blockInf}>
                <Typography variant='h3'>EDONs — Визуализация, анализ, оптимизация кода</Typography>
                <Typography variant='body1'>Разбирайтесь в коде быстрее. Автоматический анализ, визуализация зависимостей, рекомендации по улучшению и совместная работа — всё в одном месте</Typography>
                <Stack direction='row' spacing={2}>
                  <Button size='large' variant='contained'>Начать работать</Button>
                  <Button size='large' variant='outlined'>Узнать подробнее</Button>
                </Stack>
              </div>

              <div className={styles.tres}>
                <div className={styles.tres_bd}>

                </div>
                <div className={styles.tres_bd_2}>

                </div>
              </div>
            </div>
          </section>

          <div className={styles.sections}>
            <section>
            </section>

            <section className={clsx(styles.section, styles.sectionFull)}>
              <div className={styles.grid}>
                <div className={clsx(styles.grid_item, styles.large, styles.GlassPanel)}>
                  <h1 className={styles.headingB}>Визуализация связей кода и данных</h1>
                </div>
                <div className={clsx(styles.grid_item, styles.GlassPanel)}>
                  <h1 className={styles.headingB}>Анализ кода с ИИ-помощником</h1>
                </div>
                <div className={clsx(styles.grid_item, styles.GlassPanel)}>
                  <h1 className={styles.headingB}>Совместная работа</h1>
                </div>
                <div className={clsx(styles.grid_item, styles.GlassPanel)}>
                  <h1 className={styles.headingB}>Интеграция с GitHub</h1>
                </div>
                <div className={clsx(styles.grid_item, styles.GlassPanel)}>
                  <h1 className={styles.headingB}>Совместная работа</h1>
                </div>
                <div className={clsx(styles.grid_item, styles.large, styles.GlassPanel)}>
                  <h1 className={styles.headingB}>Интерактивные диаграммы, таблицы и графики</h1>
                </div>
              </div>
            </section>
          </div>
        </main>

        <footer className={styles.footer}>
          <div className={styles.copyright}>© 2025. All rights reserved - by Chistoedov Maxim</div>
          <div>A B C D</div>
          <div>A B C D</div>
        </footer>
      </Container>

      <BG />
    </>
  );
}
