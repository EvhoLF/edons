import { ReactNode } from "react";
import SessionWrapper from "@/components/Auth/SessionWrapper";
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import IconGradient from "@/components/UI/Icon/IconGradient";
import "./globals.scss";
import next_fonts from "@/styles/next_fonts";
import { ThemeProvider } from "@mui/material";
import mui_theme from "@/styles/mui_theme";
import { ModalProvider } from "@/hooks/useModal";
import SnackbarProviderClient from "@/components/Snackbar/SnackbarProviderClient";


export const metadata = {
  title: "EDONs",
  description: "EDONs",
};

export default function RootLayout({ children, }: { children: ReactNode }) {

  return (
    <SessionWrapper>
      <html lang="en" className={next_fonts}>
        <body>
          <AppRouterCacheProvider>
            <ThemeProvider theme={mui_theme}>
              <ModalProvider>
                <SnackbarProviderClient>
                  {children}
                </SnackbarProviderClient>
                <IconGradient />
              </ModalProvider>
            </ThemeProvider>
          </AppRouterCacheProvider>
        </body>
      </html>
    </SessionWrapper>
  );
}