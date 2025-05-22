import BG from "@/components/UI/BG/BG";
import SignupForm from "@/components/Auth/Forms/SignupForm";
import { Container } from "@mui/material";
import Header from "@/components/Header/Header";
import { Suspense } from "react";
import LoaderCircular from "@/components/UI/Loader/LoaderCircular";

export default function Page() {
  return (
    <>
      <Header />
      <Container sx={{ display: 'flex', height: '100vh', justifyContent: 'center', alignItems: 'center' }}>
        <Suspense fallback={<div><LoaderCircular/></div>}><SignupForm /></Suspense>
      </Container>
      <BG />
    </>
  );
}
