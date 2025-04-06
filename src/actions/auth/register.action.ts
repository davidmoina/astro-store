import { defineAction } from "astro:actions";
import { db, User } from "astro:db";
import { z } from "astro:schema";
import { hashSync } from "bcrypt-ts";
import { v4 as uuid } from "uuid";

export const registerUser = defineAction({
  accept: "form",
  input: z.object({
    name: z.string().min(2),
    email: z.string().email(),
    password: z.string().min(6),
  }),
  handler: async ({ name, email, password }) => {
    try {
      const [user] = await db
        .insert(User)
        .values({
          id: uuid(),
          name,
          email,
          password: hashSync(password),
          createdAt: new Date(),
          role: "user",
        })
        .returning();

      return {
        id: user.id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
        role: user.role,
      };
    } catch (error) {
      console.error(error);
      throw new Error("Failed to register user");
    }
  },
});
