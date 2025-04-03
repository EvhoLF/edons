import Header from "@/components/Header/Header";
import { Stack } from "@mui/material";
import { ReactNode } from "react";

export default function RootLayout({ children, }: { children: ReactNode }) {

  return (
    <>
      <Header admin />
      <Stack mt={10}>
        {children}
      </Stack>
    </>
  );
}