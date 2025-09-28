// components/products/AddToCartButton.tsx
 "use client"; // ✅ This directive makes it an interactive Client Component

import { useState } from 'react';
import { useCart } from "@/hooks/useCart";
import { Product } from "./ProductCard"; // Reuse the Product type
import { QuantitySelector } from "./QuantitySelector";
import toast from 'react-hot-toast';

export function AddToCartButton({ product }: { product: Product }) {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = () => {
    // Add the product to cart with the selected quantity
    addToCart(product, quantity);
  };

  return (
    <div className="space-y-4">
      {/* Quantity Selector */}
      <div className="flex items-center gap-4">
        <label htmlFor="quantity" className="text-sm font-medium text-gray-700">
          Quantity:
        </label>
        <QuantitySelector
          initialQuantity={quantity}
          min={1}
          max={product.quantity - (product.reserved || 0)}
          onQuantityChange={setQuantity}
        />
      </div>

      {/* Add to Cart Button */}
      <button
        onClick={handleAddToCart}
        className="w-full bg-amber-100 text-amber-800 font-semibold rounded-3xl px-8 py-4 text-lg
                   transition-all duration-300 ease-in-out
                   hover:bg-amber-200 hover:shadow-lg hover:-translate-y-0.5
                   focus:outline-none focus:ring-4 focus:ring-amber-200 border border-amber-200
                   shadow-sm"
      >
        Add to Cart
      </button>
    </div>
  );
}