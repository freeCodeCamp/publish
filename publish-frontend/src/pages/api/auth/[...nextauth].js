import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_OAUTH_CLIENT_ID,
      clientSecret: process.env.GOOGLE_OAUTH_CLIENT_SECRET
    })
  ],

  callbacks: {
    // This method is not invoked when you persist sessions in a database.
    async jwt({ token, account }) {
      if (account) {
        // Get JWT token to access the Strapi API
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_STRAPI_BACKEND_URL}/api/auth/${account.provider}/callback?access_token=${account.access_token}`
        );
        const data = await res.json();
        // Note: If the email is already registered on Strapi app without using Google Auth
        // then it will fail to get JWT token
        // https://github.com/strapi/strapi/issues/12907
        const { jwt } = data;
        token.jwt = jwt;
      }
      return token;
    },

    async session({ session, token }) {
      session.user.jwt = token.jwt;

      // Fetch user role data from /api/users/me?populate=role
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_STRAPI_BACKEND_URL}/api/users/me?populate=role`,
        {
          headers: {
            Authorization: `Bearer ${token.jwt}`
          }
        }
      );

      if (res.ok) {
        const userData = await res.json();
        // Save the role name to the session
        session.user.role = userData?.role?.name || null;
      }

      return session;
    }
  },

  session: {
    // The default is `"jwt"`, an encrypted JWT (JWE) stored in the session cookie.
    // If you use an `adapter` however, we default it to `"database"` instead.
    // You can still force a JWT session by explicitly defining `"jwt"`.
    strategy: 'jwt'
  },

  // Not providing any secret or NEXTAUTH_SECRET will throw an error in production.
  secret: process.env.NEXTAUTH_SECRET
};

const auth = (req, res) =>
  NextAuth(req, res, authOptions);

export default auth;

