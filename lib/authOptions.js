import Github from "next-auth/providers/github"

export const authOptions = {
  providers: [
    Github({
      clientId: process.env.AUTH_GITHUB_ID,
      clientSecret: process.env.AUTH_GITHUB_SECRET,
      authorization: {
        params: {
          scope: 'repo read:user user:email',
        },
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
}