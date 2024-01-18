import NextAuth from "next-auth";
import Auth0Provider from "next-auth/providers/auth0";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions = {
  providers: [
    process.env.EMAIL_PASSWORD_AUTHENTICATION === "true" &&
      CredentialsProvider({
        name: "email",
        credentials: {
          identifier: {
            label: "Email",
            type: "email",
            placeholder: "foo@bar.com",
            required: true,
          },
          password: { label: "Password", type: "password", required: true },
        },
        async authorize(credentials) {
          const { identifier, password } = credentials;
          const url = new URL(
            "api/auth/local",
            process.env.NEXT_PUBLIC_STRAPI_BACKEND_URL,
          );
          const res = await fetch(url, {
            method: "POST",
            body: JSON.stringify({ identifier, password }),
            headers: { "Content-Type": "application/json" },
          });
          const data = await res.json();

          if (res.ok && data.jwt) {
            const user = { ...data.user, jwt: data.jwt };
            return user;
          }
          return null;
        },
      }),
    Auth0Provider({
      clientId: process.env.AUTH0_CLIENT_ID,
      clientSecret: process.env.AUTH0_CLIENT_SECRET,
      issuer: `https://${process.env.AUTH0_DOMAIN}`,
    }),
  ],

  // Details: https://next-auth.js.org/configuration/callbacks
  callbacks: {
    async signIn({ user, account }) {
      // For auth0 we reuqest the callback to get strapi jwt token. If user exists
      // token is returned otherwise the request will fail with a 400 error which
      // we use for rejecting sign in attempt from non-invited users.
      if (account.provider === "auth0") {
        const url = new URL(
          `/api/auth/${account.provider}/callback`,
          process.env.NEXT_PUBLIC_STRAPI_BACKEND_URL,
        );
        url.search = `access_token=${account.access_token}`;
        const res = await fetch(url);
        const data = await res.json();
        // Note: If the email is already registered on Strapi app without using Auth0
        // then it will fail to get JWT token
        // https://github.com/strapi/strapi/issues/12907
        if (res.ok) {
          const { jwt } = data;
          // Storing the token in the user object so that it can then be passed to the
          // session token in the jwt callback
          user.jwt = jwt;
          return true;
        } else {
          return false;
        }
      }

      // We return true by default as for credentials login only invited users will pass
      // the authorization step and land here.
      return true;
    },
    // This callback is called whenever a JSON Web Token is created (i.e. at sign in)
    // or updated(i.e whenever a session is accessed in the client).
    async jwt({ token, user }) {
      if (user) {
        token.jwt = user.jwt;

        // Set user status to actice
        const acceptInvitationUrl = new URL(
          "/api/auth/accept-invitation",
          process.env.NEXT_PUBLIC_STRAPI_BACKEND_URL,
        );
        await fetch(acceptInvitationUrl, {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token.jwt}`,
          },
        });

        // Fetch user role data from /api/users/me?populate=role
        const usersUrl = new URL(
          "/api/users/me",
          process.env.NEXT_PUBLIC_STRAPI_BACKEND_URL,
        );
        usersUrl.search = "populate=*";
        const res2 = await fetch(usersUrl, {
          headers: {
            Authorization: `Bearer ${token.jwt}`,
          },
        });

        if (res2.ok) {
          const userData = await res2.json();
          // Add the role name to session JWT
          token.name = userData?.name || null;
          token.userRole = userData?.role?.name || null;
          token.id = userData?.id || null;
          if (userData.profile_image !== null) {
            token.image =
              process.env.NEXT_PUBLIC_STRAPI_BACKEND_URL +
              userData.profile_image.url;
          }
        }
      }

      // The returned value will be encrypted, and it is stored in a cookie.
      // We can access it through the session callback.
      return token;
    },

    // The session callback is called whenever a session is checked.
    async session({ session, token }) {
      // Decrypt the token in the cookie and return needed values
      delete session.user.image;
      session.user.jwt = token.jwt; // JWT token to access the Strapi API
      session.user.role = token.userRole;
      session.user.id = token.id;
      if ("image" in token) {
        session.user.image = token.image;
      }
      return session;
    },
  },

  session: {
    // The default is `"jwt"`, an encrypted JWT (JWE) stored in the session cookie.
    // If you use an `adapter` however, we default it to `"database"` instead.
    // You can still force a JWT session by explicitly defining `"jwt"`.
    strategy: "jwt",
  },

  // Not providing any secret or NEXTAUTH_SECRET will throw an error in production.
  secret: process.env.NEXTAUTH_SECRET,
};

const auth = (req, res) => NextAuth(req, res, authOptions);

export default auth;
