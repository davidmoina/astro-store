import { db, Role, User, Product, ProductImage } from "astro:db";
import { v4 as uuid } from "uuid";
import { hashSync } from "bcrypt-ts";
import { seedProducts } from "./seed-data";
import type { BatchItem } from "drizzle-orm/batch";

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

  const queries: BatchItem<"sqlite">[] = [];

  seedProducts.forEach((p) => {
    const product = {
      id: uuid(),
      ...p,
      user: jhonDoe.id,
      sizes: p.sizes.join(","),
      tags: p.tags.join(","),
    };

    queries.push(db.insert(Product).values(product));

    p.images.forEach((image) => {
      const productImage = {
        id: uuid(),
        image,
        productId: product.id,
      };

      queries.push(db.insert(ProductImage).values(productImage));
    });
  });

  await db.batch(queries as any);
}
