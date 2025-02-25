import clsx from "clsx";
import styles from "./page.module.scss";
import Head from "next/head";
import { Icon } from "@/components/UI/Icon/Icon";
import Button from "@/components/UI/Button/Button";
import ButtonLink from "@/components/UI/Button/ButtonLink";
import NavLink from "@/components/UI/NavLink/NavLink";
import BG from "@/components/UI/BG/BG";
import StatCounters from "@/components/StatCounters/StatCounters";

export default function Home() {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      </Head>
      <div className={styles.container}>
        <header className={styles.header}>
          <div className={clsx(styles.header_body, styles.GlassPanel)}>
            <div className={styles.logo}><Icon icon="edons" className={styles.logo_img} /><span className={styles.logo_text}>EDONs</span></div>
            <nav>
              <NavLink variant="white" href='#'>Docs</NavLink>
              <NavLink variant="white" href='/workspace'>Worksapce</NavLink>
              <NavLink variant="white" href='#'>Contact</NavLink>
            </nav>
            <ButtonLink href='/profile' dimension='s' iconLeft='user'>Profile</ButtonLink>
            {/* <button className={styles.proBtn}>React Flow Pro</button> */}
          </div>
        </header>

        <main className={styles.main}>
          <div className={clsx(styles.container)}>
            <section className={clsx(styles.section, styles.sectionFull, styles.center)}>
              {/* <ReactFlowProvider>
                <DnDProvider>
                  <SimpleMap />
                </DnDProvider>
              </ReactFlowProvider> */}
              <div className={styles.dividerA}>
                <div className={styles.blockInf}>
                  <h1 className={styles.headingA}>Wire Your Ideas with <span className={styles.textGradient}>React Flow</span></h1>
                  <p className={styles.headingA_sub}>A customizable React component for building node-based editors and interactive diagrams</p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                    <Button dimension="m" variant='filled'>Quickstart</Button>
                    <Button dimension="m" variant='colorGlass'>React pro</Button>
                  </div>
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
                <StatCounters />
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
                    <h1 className={styles.headingB}>Анализ кода с ИИ-помощником</h1>
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
          </div>
        </main>

        <footer className={styles.footer}>
          <div className={styles.copyright}>© 2025. All rights reserved - by Chistoedov Maxim</div>
          <div>A B C D</div>
          <div>A B C D</div>
        </footer>
      </div>

      <BG />
    </>
  );
}
