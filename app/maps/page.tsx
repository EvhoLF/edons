import Head from "next/head";
import { Container } from "@mui/material";
import BG from "@/components/UI/BG/BG";
import Maps from "@/components/Maps/Maps";
import Header from "@/components/Header/Header";

export default function Page() {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      </Head>
      <Header />
      <Container maxWidth='xl' sx={{ marginTop: '80px' }}>
        <Maps />
      </Container >
      <BG />
    </>
  );
}