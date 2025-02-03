// import type { Metadata } from "next";
import { ReactNode } from "react";
import SessionWrapper from "@/components/Auth/SessionWrapper";
import "./globals.css";

export const metadata = { /*: Metadata*/
  title: "EDONs",
  description: "EDONs",
};

export default function RootLayout({ children, }: { children: ReactNode }) { // : Readonly<{ children: React.ReactNode; }>
  return (
    <SessionWrapper>
      <html lang="en">
        <body>
          {children}
        </body>
      </html>
    </SessionWrapper>
  );
}