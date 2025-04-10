import type { ProductWithImages } from "@/interfaces";
import { useState } from "react";

interface Props {
  product: ProductWithImages;
}

export const ProductCard = ({ product }: Props) => {
  const images = product.images
    .split(",")
    .map((image) =>
      image.startsWith("http") ? image : `/images/products/${image}`
    );

  const [currentImage, setCurrentImage] = useState(images[0]);

  return (
    <a href={`/products/${product.slug}`}>
      <img
        src={currentImage}
        alt={product.title}
        className="w-full"
        onMouseEnter={() => setCurrentImage(images[1] ?? images[0])}
        onMouseLeave={() => setCurrentImage(images[0])}
      />
      <h3>{product.title}</h3>
      <p>${product.price}</p>
    </a>
  );
};
