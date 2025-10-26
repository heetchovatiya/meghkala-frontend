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
import Image from 'next/image';

export default function CartPage() {
  // ✅ MODIFIED: Destructure the new properties from our simplified useCart hook.
  const { cartItems, cartTotal, couponCode, applyCouponCode, removeCoupon, clearCart, updateQuantity, removeFromCart } = useCart();
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
    <div className="bg-gray-50 min-h-[calc(100vh-5rem)]">
      {/* Mobile Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-4 lg:hidden">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ShoppingBag size={24} className="text-accent" />
            <h1 className="text-xl font-bold text-gray-900">Shopping Cart</h1>
          </div>
          <Link href="/products" className="text-gray-400 hover:text-gray-600">
            <X size={24} />
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 lg:py-12">
        {/* Desktop Header */}
        <h1 className="hidden lg:block text-4xl font-serif text-heading-color mb-8">Your Shopping Cart</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 items-start">
          {/* Cart Items List */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            {/* Mobile Cart Items */}
            <div className="lg:hidden">
              {cartItems.map(item => (
                <div key={item._id} className="border-b border-gray-100 last:border-b-0">
                  <div className="p-4">
                    <div className="flex gap-4">
                      {/* Product Image */}
                      <div className="w-20 h-20 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0">
                        <Image 
                          src={item.images?.[0] || '/placeholder-product.jpg'} 
                          alt={item.title}
                          width={80}
                          height={80}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      
                      {/* Product Details */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 text-sm leading-tight mb-1">
                          {item.title}
                        </h3>
                        <p className="text-accent font-semibold text-lg mb-3">
                          ₹{item.price.toFixed(2)}
                        </p>
                        
                        {/* Quantity Controls */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <button 
                              onClick={() => {
                                if (item.cartQuantity > 1) {
                                  updateQuantity(item._id, item.cartQuantity - 1);
                                }
                              }}
                              className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors"
                            >
                              <span className="text-gray-600">-</span>
                            </button>
                            <span className="font-medium text-gray-900 min-w-[2rem] text-center">
                              {item.cartQuantity}
                            </span>
                            <button 
                              onClick={() => {
                                updateQuantity(item._id, item.cartQuantity + 1);
                              }}
                              className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors"
                            >
                              <span className="text-gray-600">+</span>
                            </button>
                          </div>
                          
                          {/* Price and Delete */}
                          <div className="text-right">
                            <p className="font-semibold text-gray-900 text-lg">
                              ₹{(item.price * item.cartQuantity).toFixed(2)}
                            </p>
                            <button 
                              onClick={() => {
                                removeFromCart(item._id);
                              }}
                              className="text-red-500 hover:text-red-700 mt-1 transition-colors"
                            >
                              <X size={16} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop Cart Items */}
            <div className="hidden lg:block p-6">
              {cartItems.map(item => <CartItemRow key={item._id} item={item} />)}
              <div className="text-right mt-4">
                <button onClick={clearCart} className="text-sm text-text-color hover:text-red-500 underline">
                  Clear Cart
                </button>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1 lg:sticky lg:top-28">
            {/* Mobile Order Summary */}
            <div className="lg:hidden bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              {/* Note and Coupon Buttons */}
              <div className="p-4 border-b border-gray-100">
                <div className="flex gap-3">
                  <button className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-gray-50 border border-gray-200 rounded-xl text-gray-700 font-medium hover:bg-gray-100 transition-colors">
                    <span className="text-lg">✏️</span>
                    <span>NOTE</span>
                  </button>
                  <button className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-white border border-gray-200 rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition-colors">
                    <span className="text-lg">🛒</span>
                    <span>COUPON</span>
                  </button>
                </div>
              </div>

              {/* Order Note Section */}
              <div className="p-4 border-b border-gray-100">
                <label className="block text-sm font-medium text-gray-700 mb-2">Order Note</label>
                <input 
                  type="text" 
                  placeholder="Add a note for your order..." 
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                />
              </div>

              {/* Order Summary */}
              <div className="p-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-semibold text-gray-900">₹{cartTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Shipping</span>
                    <span className="text-green-600 font-medium">Free</span>
                  </div>
                  <div className="border-t border-gray-200 pt-3">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold text-gray-900">Total</span>
                      <span className="text-lg font-bold text-gray-900">₹{cartTotal.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Checkout Button */}
              <div className="p-4 bg-gray-50">
                {!isAuthenticated ? (
                  <Link href="/login" className="w-full bg-accent text-white py-4 px-6 rounded-xl font-semibold text-lg flex items-center justify-center gap-2 hover:bg-accent-hover transition-colors">
                    <LogIn size={20} />
                    LOGIN TO CONTINUE
                  </Link>
                ) : (
                  <Link href="/checkout" className="w-full bg-accent text-white py-4 px-6 rounded-xl font-semibold text-lg flex items-center justify-center gap-2 hover:bg-accent-hover transition-colors">
                    PROCEED TO CHECKOUT
                    <span>→</span>
                  </Link>
                )}
              </div>
            </div>

            {/* Desktop Order Summary */}
            <div className="hidden lg:block bg-secondary-bg/60 p-6 rounded-lg shadow-sm">
              <h2 className="text-2xl font-serif text-heading-color border-b border-secondary-bg pb-4">
                Order Summary
              </h2>
              
              {/* Coupon Section */}
              <div className="py-4 space-y-2">
                <label htmlFor="coupon" className="text-sm font-semibold text-heading-color">Have a coupon?</label>
                {!couponCode ? (
                  <div className="flex gap-2">
                    <input 
                      id="coupon" 
                      type="text" 
                      value={couponInput} 
                      onChange={(e) => setCouponInput(e.target.value)}
                      placeholder="COUPONCODE" 
                      className="flex-grow px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-accent focus:border-transparent"
                    />
                    <button 
                      onClick={handleApplyCoupon} 
                      className="bg-accent text-white px-4 py-2 rounded-md hover:bg-accent-hover transition-colors"
                    >
                      Apply
                    </button>
                  </div>
                ) : (
                  <div className="flex justify-between items-center p-2 bg-green-100 rounded-md">
                    <span className="font-mono font-semibold text-green-700">{couponCode}</span>
                    <button onClick={handleRemoveCoupon} className="text-red-500 hover:text-red-700">
                      <X size={18} />
                    </button>
                  </div>
                )}
              </div>
              
              {/* Totals Display */}
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