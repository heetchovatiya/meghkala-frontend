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

export function CartItemRow({ item }: CartItemRowProps) {
  const { updateQuantity, removeFromCart } = useCart();
  if (!item) { return null; }
  const displayImage = item.images?.[0] || '/placeholder-product.jpg';

  return (
    <div className="grid grid-cols-4 sm:grid-cols-5 gap-4 items-center py-6 border-b border-secondary-bg last:border-b-0">
      
      {/* Product Image & Name (takes up 2 columns) */}
      <div className="col-span-2 flex items-center gap-4">
        <Link href={`/products/${item._id}`}>
          <div className="relative w-20 h-24 bg-secondary-bg rounded-md overflow-hidden shrink-0">
            <Image src={displayImage} alt={item.title} fill className="object-cover" />
          </div>
        </Link>
        <div>
          <Link href={`/products/${item._id}`} className="font-semibold text-heading-color hover:text-accent transition-colors">
            {item.title}
          </Link>
          <p className="text-sm text-text-color mt-1">₹{item.price.toFixed(2)}</p>
          {/* Mobile-only remove button */}
          <button onClick={() => removeFromCart(item._id)} className="sm:hidden mt-2 text-xs text-red-500 hover:underline">
            Remove
          </button>
        </div>
      </div>

      {/* Quantity Selector (1 column) */}
      <div className="col-span-1 justify-self-center">
        <div className="flex items-center border border-secondary-bg rounded-md">
          <button onClick={() => updateQuantity(item._id, item.cartQuantity - 1)} className="px-3 py-2..." disabled={item.cartQuantity <= 1}>
            <Minus size={16} />
          </button>
          <span className="px-3 ...">{item.cartQuantity}</span>
          <button onClick={() => updateQuantity(item._id, item.cartQuantity + 1)} className="px-3 py-2...">
            <Plus size={16} />
          </button>
        </div>
      </div>
      
      {/* Total Price (1 column) */}
      <div className="col-span-1 text-right">
        <p className="font-semibold text-heading-color">₹{(item.price * item.cartQuantity).toFixed(2)}</p>
      </div>
      
      {/* Desktop-only Remove Button (1 column) */}
      <div className="hidden sm:block col-span-1 text-right">
        <button onClick={() => removeFromCart(item._id)} className="text-text-color hover:text-red-500 transition-colors">
          <X size={20} />
        </button>
      </div>
    </div>
  );
}