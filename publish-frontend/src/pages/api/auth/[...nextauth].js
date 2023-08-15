import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import EmailProvider from 'next-auth/providers/email';
import GoogleProvider from 'next-auth/providers/google';

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'email',
      credentials: {
        identifier: {
          label: 'Email',
          type: 'email',
          placeholder: 'foo@bar.com',
          required: true
        },
        password: { label: 'Password', type: 'password', required: true }
      },
      async authorize(credentials, req) {
        console.log('creds', credentials);
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_STRAPI_BACKEND_URL}/api/auth/local`,
          {
            method: 'POST',
            body: JSON.stringify(credentials),
            headers: { 'Content-Type': 'application/json' }
          }
        );
        const data = await res.json();
        console.log('data', data);

        if (res.ok && data.jwt) {
          const user = { ...data.user, jwt: data.jwt };
          return user;
        }
        return null;
      }
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_OAUTH_CLIENT_ID,
      clientSecret: process.env.GOOGLE_OAUTH_CLIENT_SECRET
    })
  ],

  // Details: https://next-auth.js.org/configuration/callbacks
  callbacks: {
    // This callback is called whenever a JSON Web Token is created (i.e. at sign in)
    // or updated(i.e whenever a session is accessed in the client).
    async jwt({ token, account, user }) {
      if (account || user) {
        // Get JWT token to access the Strapi API
        // Note: This is different from the session JWT that is stored in the cookie at the end of this callback
        if (account) {
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_STRAPI_BACKEND_URL}/api/auth/${account.provider}/callback?access_token=${account.access_token}`
          );
          const data = await res.json();
          // Note: If the email is already registered on Strapi app without using Google Auth
          // then it will fail to get JWT token
          // https://github.com/strapi/strapi/issues/12907
          const { jwt } = data;
          // Add the JWT token for Strapi API to session JWT
          token.jwt = jwt;
        } else {
          console.log(user);
          token.jwt = user.jwt;
        }

        // Fetch user role data from /api/users/me?populate=role
        const res2 = await fetch(
          `${process.env.NEXT_PUBLIC_STRAPI_BACKEND_URL}/api/users/me?populate=role`,
          {
            headers: {
              Authorization: `Bearer ${token.jwt}`
            }
          }
        );

        if (res2.ok) {
          const userData = await res2.json();
          // Add the role name to session JWT
          token.userRole = userData?.role?.name || null;
          console.log('token.userRole:', token.userRole);
        }
      }
      // The returned value will be encrypted, and it is stored in a cookie.
      // We can access it through the session callback.
      return token;
    },

    // The session callback is called whenever a session is checked.
    async session({ session, token }) {
      // Decrypt the token in the cookie and return needed values
      session.user.jwt = token.jwt; // JWT token to access the Strapi API
      session.user.role = token.userRole;
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

const auth = (req, res) => NextAuth(req, res, authOptions);

export default auth;
