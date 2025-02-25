import { AuthOptions, User } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Github from "next-auth/providers/github"
import Google from "next-auth/providers/google"

export const authConfig: AuthOptions = {
  providers: [
    Github({
      clientId: process.env.AUTH_GITHUB_ID!,
      clientSecret: process.env.AUTH_GITHUB_SECRET!,
      authorization: {
        params: {
          scope: 'repo read:user user:email',
        },
      }
    }),
    Google({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
    }),
    Credentials({
      credentials: {
        email: { label: 'email', type: 'email', required: true },
        password: { label: 'password', type: 'password', required: true }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) return null;

        const users = [
          {
            id: 'zxc', login: 'zxc', email: '4maks3@gmail.com', password: 'zxc',
          }
        ]

        const currentUser = users.find(user => user.email === credentials.email);
        if (currentUser && currentUser.password === credentials.password) {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { password, ...userWithoutPassword } = currentUser;
          return userWithoutPassword as User;
        }

        return null;
      }
    })
  ],
  callbacks: {
    jwt({ token, user, profile, account }) {
      if (user) token.user = user;
      if (profile) token.profile = profile;
      if (account) token.account = account;
      return token;
    },
    session({ session, token }) { //user
      if (session.user)
        session.user = {
          ...session.user,
          username: token.profile.login,
          access_token: token.account.access_token,
          token: token
        };
      return session;
    },
  },

  pages: {
    signIn: '/auth/signin',
  }
}