// components/products/CartItemRow.tsx
"use client";

import Image from 'next/image';
import Link from 'next/link';
import { X, Plus, Minus } from 'lucide-react';
import { CartItem } from '@/contexts/CartContext';
import { useCart } from "@/hooks/useCart";

interface CartItemRowProps {
  item: CartItem;
}

// Reusable Quantity Selector Component to avoid repetition
const QuantitySelector = ({ item }: { item: CartItem }) => {
  const { updateQuantity } = useCart();
  return (
    <div className="flex items-center border border-secondary-bg rounded-md bg-background">
      <button
        onClick={() => updateQuantity(item._id, item.cartQuantity - 1)}
        className="px-2.5 py-2 text-text-color disabled:opacity-50"
        disabled={item.cartQuantity <= 1}
      >
        <Minus size={16} />
      </button>
      <span className="px-3 py-1 text-sm font-medium text-heading-color">{item.cartQuantity}</span>
      <button
        onClick={() => updateQuantity(item._id, item.cartQuantity + 1)}
        className="px-2.5 py-2 text-text-color"
      >
        <Plus size={16} />
      </button>
    </div>
  );
};

export function CartItemRow({ item }: CartItemRowProps) {
  const { removeFromCart } = useCart();
  if (!item) { return null; }
  const displayImage = item.images?.[0] || '/placeholder-product.jpg';

  return (
    // CHANGE: The main container is a simple block, becoming a grid on 'sm' screens.
    <div className="py-6 border-b border-secondary-bg last:border-b-0 sm:grid sm:grid-cols-5 sm:items-center sm:gap-4">
      
      {/* Product Info & Mobile Quantity Container */}
      {/* CHANGE: Added 'relative' to be the anchor for the absolute-positioned quantity selector. */}
      <div className="relative sm:col-span-2 flex items-start gap-4">
        
        <Link href={`/products/${item._id}`}>
          <div className="relative w-20 h-24 bg-secondary-bg rounded-md overflow-hidden shrink-0">
            <Image src={displayImage} alt={item.title} fill className="object-cover" />
          </div>
        </Link>

        <div className="flex flex-col">
          <Link href={`/products/${item._id}`} className="font-semibold text-heading-color hover:text-accent transition-colors pr-28 sm:pr-0">
            {item.title}
          </Link>
          <p className="text-sm text-text-color mt-1">₹{item.price.toFixed(2)}</p>
          <button onClick={() => removeFromCart(item._id)} className="sm:hidden mt-2 text-xs text-red-500 hover:underline self-start">
            Remove
          </button>
        </div>

        {/* CHANGE: Mobile-only Quantity Selector */}
        {/* Positioned absolutely to the top-right of the relative parent above. Hidden on 'sm' screens. */}
        <div className="absolute top-0 right-0 sm:hidden">
          <QuantitySelector item={item} />
        </div>
      </div>

      {/* --- Desktop Layout Columns --- */}

      {/* CHANGE: Desktop-only Quantity Selector */}
      {/* Hidden by default, becomes a centered grid item on 'sm' screens. */}
      <div className="hidden sm:flex sm:col-span-1 sm:justify-self-center">
        <QuantitySelector item={item} />
      </div>
      
      {/* Total Price */}
      {/* CHANGE: On mobile, this now sits below the product info. We add margin-top and justify-end. */}
      <div className="text-right mt-4 sm:mt-0 sm:col-span-1">
        <p className="font-semibold text-heading-color">₹{(item.price * item.cartQuantity).toFixed(2)}</p>
      </div>
      
      {/* Desktop-only Remove Button */}
      <div className="hidden sm:block sm:col-span-1 text-right">
        <button onClick={() => removeFromCart(item._id)} className="text-text-color hover:text-red-500 transition-colors">
          <X size={20} />
        </button>
      </div>
    </div>
  );
}