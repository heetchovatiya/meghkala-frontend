// components/checkout/OrderSummary.tsx
"use client";

import { useCart } from '@/hooks/useCart';

export function OrderSummary() {
  // ✅ MODIFIED: Get all necessary cart data including discount
  const { cartItems, cartTotal, couponCode, discountAmount, finalTotal, shippingCost } = useCart();

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-serif text-heading-color border-b border-gray-200 pb-3">
        Order Summary
      </h2>
      
      {/* List of items in the cart */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-gray-700">Items ({cartItems.length})</h3>
        <div className="space-y-3 max-h-48 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
          {cartItems.map(item => (
            <div key={item._id} className="flex justify-between items-start text-sm py-2 border-b border-gray-100 last:border-b-0">
              <div className="flex-1 min-w-0 pr-2">
                <p className="text-gray-900 font-medium truncate">{item.title}</p>
                <p className="text-gray-500 text-xs">Qty: {item.cartQuantity}</p>
              </div>
              <span className="font-semibold text-heading-color whitespace-nowrap">
                ₹{(item.price * item.cartQuantity).toFixed(2)}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Totals section */}
      <div className="space-y-3 pt-4 border-t border-gray-200">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Subtotal</span>
          <span className="font-medium text-gray-900">₹{cartTotal.toFixed(2)}</span>
        </div>
        
        {/* ✅ MODIFIED: Display the applied coupon code if it exists */}
        {couponCode && (
          <div className="flex justify-between text-sm text-green-600">
            <span>Coupon Applied:</span>
            <span className="font-mono font-semibold">{couponCode}</span>
          </div>
        )}
        
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Shipping</span>
          <span className="text-gray-900">
            {cartTotal >= 700 ? (
              <span className="text-green-600 font-medium">Free</span>
            ) : (
              `₹${shippingCost.toFixed(2)}`
            )}
          </span>
        </div>
        
        {discountAmount > 0 && (
          <div className="flex justify-between text-sm text-green-600">
            <span>Discount</span>
            <span className="font-semibold">-₹{discountAmount.toFixed(2)}</span>
          </div>
        )}
      </div>
      
      {/* Final total with all calculations */}
      <div className="border-t border-gray-200 pt-4">
        <div className="flex justify-between font-bold text-lg">
          <span className="text-heading-color">Total</span>
          <span className="text-heading-color">₹{finalTotal.toFixed(2)}</span>
        </div>
        {cartTotal < 700 && (
          <p className="text-xs text-gray-500 mt-1">
            Add ₹{(700 - cartTotal).toFixed(2)} more for free shipping
          </p>
        )}
      </div>
    </div>
  );
}