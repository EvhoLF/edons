// import { JWT } from "next-auth/jwt";
import { DefaultUser } from "next-auth";
import { IUser } from "./DB/models/User";

declare module "next-auth" {
  interface Session {
    user: DefaultUser & IUser,
    lastProvider?: string,
    github_access_token?: string | null
    // user: {
    //   id: string;
    //   username?: string,
    //   name?: string;
    //   email?: string;
    //   image?: string;
    //   role?: UserRole;
    //   token?: JWT & {
    //     github?: unknown;
    //     google?: unknown;
    //   };
    //   github?: unknown;
    //   google?: unknown;
    // };
  }
  interface User {
    github_access_token?: string;
  }
  interface JWT {
    user: DefaultUser & IUser & { github_access_token?: string }
    github_access_token?: string | null;
    lastProvider?: string;
  }
}


declare module "@mui/material/styles" {
  interface Palette {
    primary_alt: PaletteColorOptions;
    ui: PaletteColorOptions;
  }

  interface PaletteOptions {
    primary_alt?: PaletteColorOptions;
    ui?: PaletteColorOptions;
  }
}

declare module "@mui/material/SvgIcon" {
  interface SvgIconPropsColorOverrides {
    primary_alt: true;
    ui: true;
  }
}