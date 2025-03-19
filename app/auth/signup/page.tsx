import BG from "@/components/UI/BG/BG";
import SignupForm from "@/components/Auth/Forms/SignupForm";
import { Container } from "@mui/material";
import Header from "@/components/Header/Header";

export default function Page() {
  return (
    <>
      <Header />
      <Container sx={{ display: 'flex', height: '100vh', justifyContent: 'center', alignItems: 'center' }}>
        <SignupForm />
      </Container>
      <BG />
    </>
  );
}
