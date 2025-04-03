import BG from "@/components/UI/BG/BG";
import { Container } from "@mui/material";
import SigninForm from "@/components/Auth/Forms/SigninForm";
import Header from "@/components/Header/Header";
import { Suspense } from "react";

export default function Page() {
  return (
    <>
      <Header />
      <Container sx={{ display: 'flex', height: '100vh', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
        <Suspense fallback={<div>Loading...</div>}>
          <SigninForm />
        </Suspense>
      </Container>
      <BG />
    </>
  );
}
