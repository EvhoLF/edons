import BG from "@/components/UI/BG/BG";
import { Container } from "@mui/material";
import LinkAccountForm from "@/components/Auth/Forms/LinkAccountForm";
import { Suspense } from "react";
import LoaderCircular from "@/components/UI/Loader/LoaderCircular";

export default function Page() {
  return (
    <>
      <Container sx={{ display: 'flex', height: '100vh', justifyContent: 'center', alignItems: 'center' }}>
        <Suspense fallback={<div><LoaderCircular/></div>}>
          <LinkAccountForm />
        </Suspense>
      </Container>
      <BG />
    </>
  );
}
