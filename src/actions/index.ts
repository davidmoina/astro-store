import { loginUser, registerUser } from "./auth";
import { loadProductsFromCart } from "./cart/load-products-from-cart.action";
import { getProductBySlug } from "./products/get-product-by-slug.action";
import { getProductsByPage } from "./products/get-products-by-page.action";

export const server = {
  // actions

  // Auth
  loginUser,
  registerUser,

  // Products
  getProductsByPage,
  getProductBySlug,

  // Cart
  loadProductsFromCart,
};
