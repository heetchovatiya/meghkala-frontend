// components/checkout/OrderSummary.tsx
"use client";

import { useCart } from '@/hooks/useCart';

export function OrderSummary() {
  // ✅ MODIFIED: We no longer get 'grandTotal'. We get 'couponCode' instead.
  const { cartItems, cartTotal, couponCode } = useCart();

  return (
    <div className="bg-secondary-bg/60 p-6 rounded-lg shadow-sm">
      <h2 className="text-2xl font-serif text-heading-color border-b border-secondary-bg pb-4 mb-4">
        Order Summary
      </h2>
      
      {/* List of items in the cart */}
      <div className="space-y-4 max-h-64 overflow-y-auto pr-2">
        {cartItems.map(item => (
          <div key={item._id} className="flex justify-between items-center text-sm">
            <span className="text-text-color pr-2">{item.name} x {item.quantity}</span>
            <span className="font-medium text-heading-color whitespace-nowrap">₹{(item.price * item.quantity).toFixed(2)}</span>
          </div>
        ))}
      </div>

      {/* Totals section */}
      <div className="space-y-2 py-4 mt-4 border-t border-secondary-bg">
        <div className="flex justify-between">
          <span className="text-text-color">Subtotal</span>
          <span className="font-semibold text-heading-color">₹{cartTotal.toFixed(2)}</span>
        </div>
        
        {/* ✅ MODIFIED: Display the applied coupon code if it exists */}
        {couponCode && (
          <div className="flex justify-between text-green-600">
            <span>Coupon Applied:</span>
            <span className="font-mono font-semibold">{couponCode}</span>
          </div>
        )}
        
        <div className="flex justify-between">
          <span className="text-text-color">Shipping</span>
          <span className="text-sm">Calculated later</span>
        </div>
        <div className="flex justify-between">
            <span className="text-text-color">Discount</span>
            <span className="text-sm">Calculated at checkout</span>
        </div>
      </div>
      
      {/* ✅ MODIFIED: The final total is now the subtotal.
          The text clarifies that the final price will be confirmed. */}
      <div className="border-t border-secondary-bg pt-4">
        <div className="flex justify-between font-bold text-lg">
          <span className="text-heading-color">Estimated Total</span>
          <span className="text-heading-color">₹{cartTotal.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
}