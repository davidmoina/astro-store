import type { AdapterUser } from "@auth/core/adapters";
import Credentials from "@auth/core/providers/credentials";
import { db, eq, User } from "astro:db";
import { defineConfig } from "auth-astro";
import { compare, compareSync } from "bcrypt-ts";

export default defineConfig({
  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {},
      },
      authorize: async (credentials) => {
        const [user] = await db
          .select()
          .from(User)
          .where(eq(User.email, String(credentials.email)));

        if (!user) {
          throw new Error("User not found");
        }

        const isValidPassword = compareSync(
          String(credentials.password),
          user.password
        );

        if (!isValidPassword) {
          throw new Error("Invalid password");
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          createdAt: user.createdAt,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    jwt: ({ token, user }) => {
      if (user) {
        token.user = user;
      }

      return token;
    },
    session: ({ session, token }) => {
      session.user = token.user as AdapterUser;
      return session;
    },
  },
});
