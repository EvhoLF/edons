import styles from "./page.module.scss";
import Head from "next/head";
import BG from "@/components/UI/BG/BG";
import SigninForm from "@/components/Auth/SigninForm/SigninForm";

export default function Page() {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      </Head>
      <div className={styles.container}>
        <SigninForm />
      </div>
      <BG />
    </>
  );
}
