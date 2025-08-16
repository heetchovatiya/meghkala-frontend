// app/cart/page.tsx
"use client";

import { useCart } from '@/hooks/useCart';
import { CartItemRow } from '@/components/products/CartItemRow';
import { Button } from '@/components/common/Button';
import Link from 'next/link';
import { ShoppingBag, X } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';

export default function CartPage() {
  const { cartItems, cartTotal, couponCode, applyCouponCode, removeCoupon, clearCart } = useCart();
  const [couponInput, setCouponInput] = useState(couponCode || '');

  const handleApplyCoupon = () => { /* ... */ };
  const handleRemoveCoupon = () => { /* ... */ };

  // --- Empty Cart View (Aesthetic redesign) ---
  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto text-center py-20 px-6 flex flex-col items-center">
        <ShoppingBag size={64} className="text-secondary-bg" strokeWidth={1} />
        <h1 className="text-4xl font-serif text-heading-color mt-6">Your Cart is Empty</h1>
        <p className="text-text-color mt-2 max-w-sm">Looks like you haven't added any art to your collection yet.</p>
        <div className="mt-8">
          <Button href="/products" size="lg">Start Exploring</Button>
        </div>
      </div>
    );
  }

  // --- Main Cart View ---
  return (
    <div className="bg-primary-bg">
      <div className="container mx-auto px-4 sm:px-6 py-12">
        <div className="text-center mb-10">
            <h1 className="text-4xl font-serif text-heading-color">Your Shopping Cart</h1>
        </div>
        
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start">
          
          {/* Cart Items List (left side) */}
          <div className="w-full lg:w-[65%]">
            {/* Desktop Header */}
            <div className="hidden sm:grid grid-cols-5 gap-4 text-sm font-semibold text-text-color/80 pb-2 border-b border-secondary-bg">
              <div className="col-span-2">PRODUCT</div>
              <div className="col-span-1 text-center">QUANTITY</div>
              <div className="col-span-1 text-right">TOTAL</div>
              <div className="col-span-1"></div>
            </div>
            {cartItems.map(item => (
              <CartItemRow key={item._id} item={item} />
            ))}
            <div className="text-right mt-4">
              <button onClick={clearCart} className="text-sm text-text-color hover:text-red-500 underline">
                Clear Cart
              </button>
            </div>
          </div>

          {/* Order Summary (right side) */}
          <div className="w-full lg:w-[35%] lg:sticky lg:top-28">
            <div className="bg-secondary-bg/60 p-6 rounded-lg shadow-sm">
              <h2 className="text-2xl font-serif text-heading-color border-b border-secondary-bg pb-4">
                Order Summary
              </h2>
              {/* Coupon Form */}
              <div className="py-6 space-y-2">
                <label htmlFor="coupon" className="text-sm font-semibold text-heading-color">Have a coupon?</label>
                {!couponCode ? (
                  <div className="flex gap-2">
                    <input id="coupon" type="text" value={couponInput} onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                           placeholder="Enter Code" className="flex-grow px-3 py-2 bg-primary-bg border border-secondary-bg rounded-md focus:ring-2 focus:ring-accent outline-none"/>
                    <button onClick={handleApplyCoupon} className="bg-accent text-white font-semibold px-4 rounded-md hover:bg-accent-hover disabled:opacity-50">Apply</button>
                  </div>
                ) : (
                  <div className="flex justify-between items-center p-2 bg-green-100/50 rounded-md">
                    <span className="font-mono font-semibold text-green-700">{couponCode}</span>
                    <button onClick={handleRemoveCoupon} className="text-red-500 hover:text-red-700">
                      <X size={18} />
                    </button>
                  </div>
                )}
              </div>
              
              {/* Totals */}
              <div className="space-y-2 py-4 border-t border-secondary-bg">
                <div className="flex justify-between text-text-color"><span>Subtotal</span><span className="font-semibold text-heading-color">₹{cartTotal.toFixed(2)}</span></div>
                <div className="flex justify-between text-text-color"><span>Shipping</span><span className="text-sm">Calculated later</span></div>
                {/* ... (you can add tax line here if needed) ... */}
              </div>
              <div className="border-t border-secondary-bg pt-4">
                <div className="flex justify-between font-bold text-lg text-heading-color">
                  <span>Estimated Total</span>
                  <span>₹{cartTotal.toFixed(2)}</span>
                </div>
              </div>
              
              {/* Checkout Button */}
              <div className="mt-6">
                <Link href="/checkout" 
                      className="w-full block text-center bg-accent text-white font-semibold rounded-md py-3 text-lg
                                 transition-all duration-300 ease-in-out
                                 hover:bg-accent-hover hover:shadow-lg hover:-translate-y-0.5"
                >
                  Proceed to Checkout
                </Link>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}