import BoardMain from "@/components/Admin/BoardMain";
import BG from "@/components/UI/BG/BG";
import { Container } from "@mui/material";

export default function Page() {
  return (
    <>
      <Container maxWidth='xl' sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <BoardMain />
      </Container>
      <BG />
    </>
  );
}
