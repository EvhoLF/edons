import BG from "@/components/UI/BG/BG";
import { Container } from "@mui/material";
import Header from "@/components/Header/Header";
import ContactForm from "@/components/UI/ContactForm/ContactForm";

export default function Home() {
  return (
    <>
      <Header />
      <Container maxWidth='lg' sx={{ marginY: 15 }}>
        <ContactForm />
      </Container >
      <BG />
    </>
  );
}
