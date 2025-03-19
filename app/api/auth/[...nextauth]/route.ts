import NextAuth, { AuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Github from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import { IUser, User, UserRole } from "@/DB/models/User";
import connectDB from "@/DB/connectDB";
import bcrypt from "bcryptjs";
import { Account } from "@/DB/models/Account";

export const authOptions: AuthOptions = {
  providers: [
    Github({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
      authorization: { params: { scope: "repo read:user user:email" } },
    }),
    Google({
      clientId: process.env.GOOGLE_ID!,
      clientSecret: process.env.GOOGLE_SECRET!,
    }),
    Credentials({
      id: "linkAccount",
      name: "linkAccount",
      credentials: { userID: { label: "userID", type: "text", required: true } },
      async authorize(credentials) {
        if (!credentials?.userID) throw new Error("Missing credentials");
        await connectDB();
        const userFound = await User.findById(credentials.userID);
        if (!userFound) throw new Error("User not found");
        return userFound;
      },
    }),
    Credentials({
      id: "credentials",
      name: "credentials",
      credentials: {
        loginEmail: { label: "loginEmail", type: "text", required: true },
        password: { label: "password", type: "password", required: true },
      },
      async authorize(credentials) {
        if (!credentials?.loginEmail || !credentials.password) throw new Error("Missing credentials");
        await connectDB();
        const userFound =
          (await User.findOne({ email: credentials.loginEmail }).select('+password')) ||
          (await User.findOne({ authLogin: credentials.loginEmail }).select('+password'));
        console.log(userFound);
        if (!userFound) throw new Error("User not found");
        if (!(await bcrypt.compare(credentials.password, userFound.password))) throw new Error("Invalid Password");
        return userFound;
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (!account || ["credentials", "linkAccount"].includes(account.provider)) return true;
      await connectDB();
      const authAccount = (await Account.findOne({ providerAccountId: account.providerAccountId })) || new Account(account);
      const authUser = (await User.findById(authAccount.userId)) || (await User.findOne({ email: user.email })) || new User();
      Object.assign(authUser, {
        name: authUser.name || user.name,
        image: authUser.image || user.image,
        email: authUser.email || user.email,
        authLogin: authUser.authLogin || authUser.email || user.email,
        password: authUser.password || null,
        role: authUser.role || UserRole.USER,
        dateCreate: authUser.dateCreate || new Date(),
        lastLogin: new Date(),
        github: authUser.github || (account.provider === "github" ? account.providerAccountId : null),
        google: authUser.google || (account.provider === "google" ? account.providerAccountId : null),
      });
      authAccount.userId = authUser.id;
      await Promise.all([authAccount.save(), authUser.save()]);
      return true;
    },
    async jwt({ user, token, account, trigger, session }) {
      if (trigger === "update" && session) {
        return { ...token, user: session?.user || null, lastProvider: session?.lastProvider || null };
      }

      if (!account) return token;
      await connectDB();
      if (["credentials", "linkAccount"].includes(account.provider)) {
        token.user = await User.findById(user.id).select("-password");
        return token;
      }
      const authAccount = (await Account.findOne({ providerAccountId: account.providerAccountId })) || new Account(account);
      const authUser = await User.findById(authAccount.userId).select("-password");
      if (authUser) {
        token.user = authUser;
        token.lastProvider = account.provider;
      }
      return token;
    },
    async session({ session, token }) {
      session.user = token.user as IUser;
      session.lastProvider = token.lastProvider as string || "";
      return session;
    },
  },
  session: { strategy: "jwt" },
  pages: { signIn: "/auth/signin" },
};

const auth = NextAuth(authOptions);
export { auth as GET, auth as POST };
