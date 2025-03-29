import { db, Role, User } from "astro:db";
import { v4 as uuid } from "uuid";
import { hash, hashSync } from "bcrypt-ts";

// https://astro.build/db/seed
export default async function seed() {
  const roles = [
    { id: "admin", name: "administrator" },
    { id: "user", name: "system user" },
  ];

  const jhonDoe = {
    id: uuid(),
    name: "Jhon Doe",
    email: "jhon.doe@example.com",
    password: hashSync("123456"),
    createdAt: new Date(),
    role: "admin",
  };

  const janeDoe = {
    id: uuid(),
    name: "Jane Doe",
    email: "jane.doe@example.com",
    password: hashSync("123456"),
    createdAt: new Date(),
    role: "user",
  };

  await db.insert(Role).values(roles);
  await db.insert(User).values([jhonDoe, janeDoe]);
}
