import { ImageUpload } from "@/utils/image-upload";
import { defineAction } from "astro:actions";
import { z } from "astro:content";
import { db, eq, Product, ProductImage } from "astro:db";
import { getSession } from "auth-astro/server";
import { v4 as uuid } from "uuid";

const MAX_FILE_SIZE = 5242880; // 5MB

const ACCEPTED_MIMES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/svg+xml",
  "image/jpg",
];

export const createUpdateProduct = defineAction({
  accept: "form",
  input: z.object({
    id: z.string().optional(),
    stock: z.number(),
    price: z.number(),
    slug: z.string(),
    title: z.string(),
    description: z.string(),
    sizes: z.string(),
    tags: z.string(),
    type: z.string(),
    gender: z.string(),
    imageFiles: z
      .array(
        z
          .instanceof(File)
          .refine(
            (file) => file.size <= MAX_FILE_SIZE,
            "La imagen debe tener un tamaño menor o igual a 5MB"
          )
          .refine(
            (file) => ACCEPTED_MIMES.includes(file.type),
            `Only supported image files are valid ${ACCEPTED_MIMES.join(", ")}`
          )
      )
      .optional(),
  }),
  handler: async (form, { request }) => {
    const session = await getSession(request);
    const user = session?.user;

    if (!user || !user.id) {
      throw new Error("Unauthorized");
    }

    const { id = uuid(), imageFiles, ...rest } = form;
    rest.slug = rest.slug.toLowerCase().replaceAll(" ", "-").trim();

    const product = { id, user: user.id, ...rest };

    const queries: any = [];

    if (!form.id) {
      queries.push(db.insert(Product).values({ ...product }));
    } else {
      queries.push(db.update(Product).set(product).where(eq(Product.id, id)));
    }

    const secureUrls: string[] = [];

    if (form.imageFiles && form.imageFiles.length > 0) {
      const urls = await Promise.all(
        form.imageFiles.map((file) => ImageUpload.upload(file))
      );
      secureUrls.push(...urls);
    }

    if (secureUrls.length > 0) {
      secureUrls.forEach((url) => {
        const imageObj = {
          id: uuid(),
          image: url,
          productId: id,
        };

        queries.push(db.insert(ProductImage).values(imageObj));
      });
    }

    await db.batch(queries);

    return product;
  },
});
