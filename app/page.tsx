import Map from "@/components/NodeMap/Map/Map";
import styles from "./page.module.css";
import { ReactFlowProvider } from "@xyflow/react";
import Head from "next/head";
import { DnDProvider } from "@/hooks/DnDProvider";

export default function Home() {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      </Head>
      <ReactFlowProvider>
        <DnDProvider>
          <div className={styles.page}>
            <main className={styles.main}>
              <Map />
            </main>
            <footer className={styles.footer}>
            </footer>
          </div>
        </DnDProvider>
      </ReactFlowProvider>
    </>
  );
}
