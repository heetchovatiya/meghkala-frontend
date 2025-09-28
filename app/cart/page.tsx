// app/cart/page.tsx
"use client";

import { useCart } from '@/hooks/useCart';
import { useAuth } from '@/hooks/useAuth';
import { CartItemRow } from '@/components/products/CartItemRow';
import { Button } from '@/components/common/Button';
import Link from 'next/link';
import { ShoppingBag, X, LogIn } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';

export default function CartPage() {
  // ✅ MODIFIED: Destructure the new properties from our simplified useCart hook.
  const { cartItems, cartTotal, couponCode, applyCouponCode, removeCoupon, clearCart } = useCart();
  const { isAuthenticated } = useAuth();
  
  // Local state for the input field. Initialize with the coupon code from context.
  const [couponInput, setCouponInput] = useState(couponCode || '');

  // This is now a simple, synchronous handler.
  const handleApplyCoupon = () => {
    applyCouponCode(couponInput);
  };

  const handleRemoveCoupon = () => {
    removeCoupon();
    setCouponInput('');
  };

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto text-center py-20 px-6">
        <ShoppingBag size={64} className="mx-auto text-secondary-bg" />
        <h1 className="text-4xl font-serif text-heading-color mt-6">Your Cart is Empty</h1>
        <p className="text-text-color mt-2">Looks like you haven't added any art to your collection yet.</p>
        <div className="mt-8">
          <Button href="/products" size="lg">Start Exploring</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-primary-bg min-h-[calc(100vh-5rem)] py-12">
      <div className="container mx-auto px-6">
        <h1 className="text-4xl font-serif text-heading-color mb-8">Your Shopping Cart</h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Cart Items List (no changes) */}
          <div className="lg:col-span-2 bg-secondary-bg/60 p-6 rounded-lg shadow-sm">
            {/* ... */}
            {cartItems.map(item => <CartItemRow key={item._id} item={item} />)}
            <div className="text-right mt-4">
              <button onClick={clearCart} className="text-sm text-text-color hover:text-red-500 underline">
                Clear Cart
              </button>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1 sticky top-28">
            <div className="bg-secondary-bg/60 p-6 rounded-lg shadow-sm">
              <h2 className="text-2xl font-serif text-heading-color border-b border-secondary-bg pb-4">
                Order Summary
              </h2>
              
              {/* ✅ MODIFIED: Coupon Section */}
              <div className="py-4 space-y-2">
                <label htmlFor="coupon" className="text-sm font-semibold text-heading-color">Have a coupon?</label>
                {!couponCode ? (
                  // Show input form if no coupon is applied
                  <div className="flex gap-2">
                    <input id="coupon" type="text" value={couponInput} onChange={(e) => setCouponInput(e.target.value)}
                           placeholder="COUPONCODE" className="flex-grow px-3 py-2 ..."/>
                    <button onClick={handleApplyCoupon} className="bg-accent text-white ...">
                      Apply
                    </button>
                  </div>
                ) : (
                  // Show the applied coupon if one exists
                  <div className="flex justify-between items-center p-2 bg-green-100 rounded-md">
                    <span className="font-mono font-semibold text-green-700">{couponCode}</span>
                    <button onClick={handleRemoveCoupon} className="text-red-500 hover:text-red-700">
                      <X size={18} />
                    </button>
                  </div>
                )}
              </div>
              
              {/* ✅ MODIFIED: Totals Display */}
              <div className="space-y-2 py-4 border-t border-secondary-bg">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>₹{cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Discount</span>
                  <span className="text-sm">Applied at checkout</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="text-sm">Calculated later</span>
                </div>
              </div>
              <div className="border-t border-secondary-bg pt-4">
                <div className="flex justify-between font-bold text-lg">
                  {/* The total shown is the subtotal, as final discount is on the backend */}
                  <span>Estimated Total</span>
                  <span>₹{cartTotal.toFixed(2)}</span>
                </div>
              </div>

              <div className="mt-6">
                {isAuthenticated ? (
                  <Link href="/checkout" className="w-full block text-center bg-accent text-white font-semibold rounded-md py-4 text-lg transition-all duration-300 ease-in-out hover:bg-accent-hover">
                    Proceed to Checkout
                  </Link>
                ) : (
                  <Link href="/login?redirect=/checkout" className="w-full block text-center bg-accent text-white font-semibold rounded-md py-4 text-lg transition-all duration-300 ease-in-out hover:bg-accent-hover">
                    <div className="flex items-center justify-center gap-2">
                      <LogIn size={20} />
                      Login to Continue
                    </div>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}