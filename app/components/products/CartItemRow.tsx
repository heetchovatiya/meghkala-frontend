// components/products/CartItemRow.tsx
"use client";

import Image from 'next/image';
import Link from 'next/link';
import { X } from 'lucide-react';
import {  CartItem } from '@/contexts/CartContext'; // Import CartItem type
import { useCart } from "@/hooks/useCart";

interface CartItemRowProps {
  item: CartItem;
}

export function CartItemRow({ item }: CartItemRowProps) {
  const { updateQuantity, removeFromCart } = useCart();

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuantity = parseInt(e.target.value, 10);
    if (!isNaN(newQuantity)) {
      updateQuantity(item._id, newQuantity);
    }
  };

  return (
    <div className="flex items-center gap-4 py-4 border-b border-secondary-bg">
      {/* Product Image & Name */}
      <div className="flex items-center gap-4 flex-1">
        <Link href={`/products/${item._id}`}>
          <div className="relative w-16 h-20 bg-secondary-bg rounded-md overflow-hidden">
<Image src={item.images.length > 0 ? item.images[0] : '/default-image.jpg'} alt={item.name} fill className="object-cover" />
          </div>
        </Link>
        <div>
          <Link href={`/products/${item._id}`} className="font-semibold text-heading-color hover:text-accent transition-colors">
            {item.name}
          </Link>
<p className="text-sm text-text-color">₹{item.price.toFixed(2)}</p>
        </div>
      </div>

      {/* Quantity Selector */}
      <div className="flex items-center">
        <input
          type="number"
          min="1"
          value={item.quantity}
          onChange={handleQuantityChange}
          className="w-16 text-center bg-primary-bg border border-secondary-bg rounded-md p-2"
          aria-label={`Quantity for ${item.name}`}
        />
      </div>

      {/* Total Price for this item */}
      <div className="w-24 text-right">
<p className="font-semibold text-heading-color">₹{(item.price * item.quantity).toFixed(2)}</p>
      </div>
      
      {/* Remove Button */}
      <div className="w-10 text-right">
        <button onClick={() => removeFromCart(item._id)} className="text-text-color hover:text-red-500 transition-colors" aria-label={`Remove ${item.name} from cart`}>
          <X size={20} />
        </button>
      </div>
    </div>
  );
}