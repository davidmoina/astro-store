import type { CartItem } from "@/interfaces";
import { defineAction } from "astro:actions";
import { db, eq, inArray, Product, ProductImage } from "astro:db";

export const loadProductsFromCart = defineAction({
  accept: "json",
  handler: async (_, { cookies }) => {
    const cart = JSON.parse(cookies.get("cart")?.value ?? "[]") as CartItem[];

    if (cart.length === 0) return [];

    const productsIds = cart.map((item) => item.productId);

    const dbProducts = await db
      .select()
      .from(Product)
      .innerJoin(ProductImage, eq(Product.id, ProductImage.productId))
      .where(inArray(Product.id, productsIds));

    return cart.map((cartItem) => {
      const product = dbProducts.find(
        (dbProduct) => dbProduct.Product.id === cartItem.productId
      );

      if (!product) {
        throw new Error("Product with id " + cartItem.productId + " not found");
      }

      const { Product, ProductImage } = product;

      return {
        productId: cartItem.productId,
        title: Product.title,
        size: cartItem.size,
        quantity: cartItem.quantity,
        image: ProductImage.image.startsWith("http")
          ? ProductImage.image
          : `${import.meta.env.PUBLIC_URL}/images/products/${
              ProductImage.image
            }`,
        price: Product.price,
        slug: Product.slug,
      };
    });
  },
});
