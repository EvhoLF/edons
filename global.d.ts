// import { JWT } from "next-auth/jwt";
import { IUser } from "./DB/models/User";

declare module "next-auth" {
  interface Session {
    user: IUser
    lastProvider?: string,
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