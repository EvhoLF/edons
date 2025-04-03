import BG from "@/components/UI/BG/BG";
import { Container } from "@mui/material";
import LinkAccountForm from "@/components/Auth/Forms/LinkAccountForm";
import { Suspense } from "react";

export default function Page() {
  return (
    <>
      <Container sx={{ display: 'flex', height: '100vh', justifyContent: 'center', alignItems: 'center' }}>
        <Suspense fallback={<div>Loading...</div>}>
          <LinkAccountForm />
        </Suspense>
      </Container>
      <BG />
    </>
  );
}
