// app/checkout/page.tsx
"use client";

import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useCart } from '@/hooks/useCart';
import { useRouter } from 'next/navigation';
import * as api from '@/lib/api';
import toast from 'react-hot-toast';
import { OrderSummary } from '@/components/checkout/OrderSummary';
import { ShippingForm } from '@/components/checkout/ShippingForm'; // Re-import ShippingForm

export default function CheckoutPage() {
  const { isAuthenticated, user, token, loading: authLoading } = useAuth();
  // ✅ MODIFIED: Get 'couponCode' from the simplified cart context
  const { cartItems, couponCode, clearCart } = useCart();
  const router = useRouter();
  
  const [shippingAddress, setShippingAddress] = useState({
    street: '', city: '', postalCode: '', country: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Protection logic (redirect if not logged in or cart is empty)
  useEffect(() => {
    if (!authLoading) {
      if (!isAuthenticated) {
        toast.error("Please log in to proceed to checkout.");
        router.push('/login?redirect=/checkout');
      } else if (cartItems.length === 0) {
        toast.error("Your cart is empty.");
        router.push('/products');
      }
    }
  }, [isAuthenticated, authLoading, router, cartItems.length]);

  const handlePlaceOrder = async () => {
    if (!token) return toast.error("Authentication error. Please log in again.");
    if (!shippingAddress.street || !shippingAddress.city) {
        return toast.error("Please fill in your shipping address.");
    }
    
    setIsSubmitting(true);
    const toastId = toast.loading("Creating your order...");

    // ✅ MODIFIED: Pass 'couponCode' directly in the payload
    const orderData = {
      orderItems: cartItems.map(item => ({
        productId: item._id,
        quantity: item.quantity,
      })),
      shippingAddress, // Add shipping address to the order
      couponCode: couponCode, // Pass the coupon code string from the context
    };

    try {
      const newOrder = await api.createOrder(token, orderData);
      toast.success("Order created! Proceed to payment.", { id: toastId });
      
      // Redirect to the payment page with the final amount calculated by the backend
      router.push(`/payment?orderId=${newOrder._id}&amount=${newOrder.finalAmount}`);
    } catch (error: any) {
      toast.error(`Error: ${error.message}`, { id: toastId });
      setIsSubmitting(false);
    }
  };

  if (authLoading || cartItems.length === 0) {
    return <div className="text-center py-20">Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 py-12">
      <h1 className="text-4xl font-serif text-center mb-12">Checkout</h1>
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-start">
        {/* Shipping Form on the left */}
        <div className="lg:col-span-3">
          <ShippingForm user={user} onFormChange={setShippingAddress} />
           <div className="mt-8">
                <h2 className="text-2xl font-serif text-heading-color mb-4">Payment Method</h2>
                <div className="p-6 bg-secondary-bg/60 rounded-lg">
                  <p className="text-text-color">After confirming your order, you will be redirected to the payment page with instructions for our manual UPI payment process.</p>
                </div>
              </div>
        </div>

        {/* Order Summary and Action Button on the right */}
        <div className="lg:col-span-2">
          <div className="sticky top-28">
            <OrderSummary /> 
            <button 
              onClick={handlePlaceOrder}
              disabled={isSubmitting}
              className="w-full mt-6 bg-accent text-white font-semibold rounded-md py-4 text-lg
                         transition-all duration-300 ease-in-out hover:bg-accent-hover
                         disabled:bg-accent/50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Processing..." : "Confirm & Proceed to Payment"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}