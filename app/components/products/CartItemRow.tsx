// components/products/CartItemRow.tsx
"use client"; // Note: "use-client" was a typo, should be "use client"

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
    <div className="flex items-center gap-4 py-4 border-b border-secondary-bg last:border-b-0">
      {/* Product Image & Name */}
      <div className="flex items-center gap-4 flex-1">
        <Link href={`/products/${item._id}`}>
          <div className="relative w-16 h-20 bg-secondary-bg rounded-md overflow-hidden">
            <Image src={displayImage} alt={item.title} fill className="object-cover" />
          </div>
        </Link>
        <div>
          <Link href={`/products/${item._id}`} className="font-semibold text-heading-color hover:text-accent transition-colors">
            {item.title} 
          </Link>
          <p className="text-sm text-text-color">₹{item.price.toFixed(2)}</p>
        </div>
      </div>

      {/* Quantity Selector */}
      <div className="flex items-center border border-secondary-bg rounded-md">
        <button 
          // ✅ Use `cartQuantity` for the calculation
          onClick={() => updateQuantity(item._id, item.cartQuantity - 1)}
          className="px-3 py-2 text-text-color hover:bg-secondary-bg/60 transition-colors disabled:opacity-50"
          aria-label="Decrease quantity"
          // ✅ Use `cartQuantity` for the disabled check
          disabled={item.cartQuantity <= 1}
        >
          <Minus size={16} />
        </button>
        {/* ✅ Display `cartQuantity` */}
        <span className="px-3 text-center w-12 font-medium text-heading-color">{item.cartQuantity}</span>
        <button 
          // ✅ Use `cartQuantity` for the calculation
          onClick={() => updateQuantity(item._id, item.cartQuantity + 1)}
          className="px-3 py-2 text-text-color hover:bg-secondary-bg/60 transition-colors"
          aria-label="Increase quantity"
        >
          <Plus size={16} />
        </button>
      </div>

      {/* Total Price for this item */}
      <div className="w-24 text-right">
        {/* ✅ Use `cartQuantity` for the total calculation */}
        <p className="font-semibold text-heading-color">₹{(item.price * item.cartQuantity).toFixed(2)}</p>
      </div>
      
      {/* Remove Button */}
      <div className="w-10 text-right">
        <button onClick={() => removeFromCart(item._id)} className="text-text-color hover:text-red-500 transition-colors" aria-label={`Remove ${item.title} from cart`}>
          <X size={20} />
        </button>
      </div>
    </div>
  );
}