// app/checkout/page.tsx
"use client";

import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useCart } from '@/hooks/useCart';
import { useRouter } from 'next/navigation';
import * as api from '@/lib/api';
import toast from 'react-hot-toast';
import { OrderSummary } from '@/components/checkout/OrderSummary';
import { ShippingForm } from '@/components/checkout/ShippingForm';

export default function CheckoutPage() {
  // ✅ DEBUG POINT 1: Ensure we get 'user' from useAuth for the ShippingForm
  const { isAuthenticated, user, token, loading: authLoading } = useAuth();
  
  // ✅ DEBUG POINT 2: Ensure we get 'couponCode' from useCart, NOT 'coupon'
  const { cartItems, couponCode } = useCart();
  const router = useRouter();
  
  const [shippingAddress, setShippingAddress] = useState({
    street: '', city: '', postalCode: '', country: '', contactNumber: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Protection logic: This is well-written and correct.
  useEffect(() => {
    if (!authLoading) {
      if (!isAuthenticated) {
        toast.error("Please log in to proceed to checkout.");
        router.push('/login?redirect=/checkout');
      } else if (cartItems.length === 0) {
        // This check is important to prevent users from accessing an empty checkout
        toast.error("Your cart is empty.", { id: 'empty-cart-toast' });
        router.push('/products');
      }
    }
  }, [isAuthenticated, authLoading, router, cartItems.length]);

  const handlePlaceOrder = async () => {
    if (!token) {
      toast.error("Authentication session has expired. Please log in again.");
      return;
    }
    // ✅ DEBUG POINT 3: More specific validation messages
    if (!shippingAddress.street || !shippingAddress.city || !shippingAddress.postalCode || !shippingAddress.country || !shippingAddress.contactNumber) {
        return toast.error("Please fill in all shipping address and contact fields.");
    }
    
    setIsSubmitting(true);
    const toastId = toast.loading("Creating your order...");

    // This payload construction is correct, assuming CartContext uses `cartQuantity`
    const orderData = {
      orderItems: cartItems.map(item => ({
        productId: item._id,
        quantity: item.cartQuantity,
      })),
      shippingAddress,
      couponCode: couponCode,
    };

    try {
      const newOrder = await api.createOrder(token, orderData);
      toast.success("Order created! Proceed to payment.", { id: toastId });
      
      // The redirect logic using the backend's `finalAmount` is correct and secure.
      router.push(`/payment?orderId=${newOrder._id}&amount=${newOrder.finalAmount}`);
    } catch (error: any) {
      toast.error(`Error: ${error.message}`, { id: toastId });
      setIsSubmitting(false);
    }
  };

  // This loading state is also correct.
  if (authLoading || cartItems.length === 0) {
    return <div className="text-center py-20">Loading Checkout...</div>;
  }

  // The JSX is well-structured.
  return (
    <div className="container mx-auto px-4 sm:px-6 py-12">
      <h1 className="text-4xl font-serif text-center mb-12">Checkout</h1>
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-start">
        <div className="lg:col-span-3">
          <ShippingForm user={user} onFormChange={setShippingAddress} />
           <div className="mt-8">
                <h2 className="text-2xl font-serif text-heading-color mb-4">Payment Method</h2>
                <div className="p-6 bg-secondary-bg/60 rounded-lg">
                  <p className="text-text-color">After confirming your order, you will be redirected to the payment page with instructions for our manual UPI payment process.</p>
                </div>
              </div>
        </div>

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