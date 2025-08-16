// components/products/AddToCartButton.tsx
 "use client"; // ✅ This directive makes it an interactive Client Component

import { useCart } from "@/hooks/useCart";
import { Product } from "./ProductCard"; // Reuse the Product type
import toast from 'react-hot-toast';

export function AddToCartButton({ product }: { product: Product }) {
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    addToCart(product);
    toast.success(`${product.title} added to cart!`);
  };

  return (
    <button
      onClick={handleAddToCart}
      className="w-full bg-accent text-white font-semibold rounded-md px-8 py-4 text-lg
                 transition-all duration-300 ease-in-out
                 hover:bg-accent-hover hover:shadow-lg hover:-translate-y-0.5
                 focus:outline-none focus:ring-4 focus:ring-accent/50"
    >
      Add to Cart
    </button>
  );
}