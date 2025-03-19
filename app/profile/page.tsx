import ProfileForm from "@/components/Auth/Forms/ProfileForm";
import Header from "@/components/Header/Header";
import BG from "@/components/UI/BG/BG";
import { Container } from "@mui/material";

export default function Page() {

  return (
    <>
      <Container sx={{ display: 'flex', height: '100vh', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
        <Header unfixed />
        <ProfileForm />
      </Container>
      <BG />
    </>
  );
}
