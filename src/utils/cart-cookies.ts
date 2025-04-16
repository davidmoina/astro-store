import type { CartItem } from "@/interfaces";
import Cookies from "js-cookie";

export const getCart = (): CartItem[] => {
  const cart = JSON.parse(Cookies.get("cart") ?? "[]");
  return cart;
};

export const addItemToCart = (item: CartItem): CartItem[] => {
  const cart = getCart();

  const existingItem = cart.find(
    (cartItem) =>
      cartItem.productId === item.productId && cartItem.size === item.size
  );

  if (existingItem) {
    existingItem.quantity += item.quantity;
  } else {
    cart.push(item);
  }

  Cookies.set("cart", JSON.stringify(cart));
  return cart;
};

export const removeItemFromCart = (
  productId: string,
  size: string
): CartItem[] => {
  const cart = getCart();
  const updatedCart = cart.filter(
    (item) => !(item.productId === productId && item.size === size)
  );
  Cookies.set("cart", JSON.stringify(updatedCart));
  return updatedCart;
};

export const clearCart = () => {
  Cookies.remove("cart");
};
