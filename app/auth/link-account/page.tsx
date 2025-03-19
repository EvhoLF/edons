import BG from "@/components/UI/BG/BG";
import { Container } from "@mui/material";
import LinkAccountForm from "@/components/Auth/Forms/LinkAccountForm";

export default function Page() {
  return (
    <>
      <Container sx={{ display: 'flex', height: '100vh', justifyContent: 'center', alignItems: 'center' }}>
        <LinkAccountForm />
      </Container>
      <BG />
    </>
  );
}
