import TableMaps from "@/components/Admin/TableMaps";
import BG from "@/components/UI/BG/BG";
import { Container, Stack, Typography } from "@mui/material";

export default function Page() {
  return (
    <>
      <Container maxWidth='xl' sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Stack width='100%' spacing={2}>
          <TableMaps />
        </Stack>
      </Container>
      <BG />
    </>
  );
}
