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

  // Protection logic: Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading) {
      if (!isAuthenticated) {
        toast.error("Please log in to proceed to checkout.");
        router.push('/login?redirect=/checkout');
      }
    }
  }, [isAuthenticated, authLoading, router]);

  const handlePlaceOrder = async () => {
    if (!token) {
      toast.error("Authentication session has expired. Please log in again.");
      return;
    }
    // ✅ DEBUG POINT 3: More specific validation messages
    if (!shippingAddress.street || !shippingAddress.city || !shippingAddress.postalCode || !shippingAddress.country || !shippingAddress.contactNumber) {
        return toast.error("Please fill in all shipping address and contact fields.");
    }
    
    if (!user?.name) {
        return toast.error("User name is required for shipping address.");
    }
    
    setIsSubmitting(true);
    const toastId = toast.loading("Creating your order...");

    // Transform shipping address to match backend expectations
    const transformedShippingAddress = {
      name: user?.name || 'Customer', // Use user's name or default
      line1: shippingAddress.street,
      city: shippingAddress.city,
      postalCode: shippingAddress.postalCode,
      country: shippingAddress.country,
      contactNumber: shippingAddress.contactNumber,
    };

    // This payload construction is correct, assuming CartContext uses `cartQuantity`
    const orderData = {
      orderItems: cartItems.map(item => ({
        productId: item._id,
        quantity: item.cartQuantity,
      })),
      shippingAddress: transformedShippingAddress,
      couponCode: couponCode,
    };

    try {
      // Try to save the address for future use (optional - don't fail order if this fails)
      try {
        await api.addUserAddress(token, {
          line1: shippingAddress.street,
          city: shippingAddress.city,
          postalCode: shippingAddress.postalCode,
          country: shippingAddress.country,
          contactNumber: shippingAddress.contactNumber,
        });
      } catch (addressError) {
        // Address saving failed, but continue with order
        console.log('Address saving failed:', addressError);
      }

      const newOrder = await api.createOrder(token, orderData);
      toast.success("Order created! Proceed to payment.", { id: toastId });
      
      // The redirect logic using the backend's `finalAmount` is correct and secure.
      router.push(`/payment?orderId=${newOrder._id}&amount=${newOrder.finalAmount}`);
    } catch (error: any) {
      toast.error(`Error: ${error.message}`, { id: toastId });
      setIsSubmitting(false);
    }
  };

  // Show loading state while authentication is being checked
  if (authLoading) {
    return <div className="text-center py-20">Loading Checkout...</div>;
  }

  // The JSX is well-structured.
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 py-8">
        <h1 className="text-3xl sm:text-4xl font-serif text-center mb-8 text-gray-900">Checkout</h1>
        
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            {/* Left Column - Shipping Form */}
            <div className="lg:col-span-2 space-y-8">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <ShippingForm user={user} onFormChange={setShippingAddress} />
              </div>
              
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-serif text-heading-color mb-4">Payment Method</h2>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-text-color">After confirming your order, you will be redirected to the payment page with instructions for our manual UPI payment process.</p>
                </div>
              </div>
            </div>

            {/* Right Column - Order Summary */}
            <div className="lg:col-span-1">
              <div className="lg:sticky lg:top-8">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <OrderSummary /> 
                </div>
                
                <button 
                  onClick={handlePlaceOrder}
                  disabled={isSubmitting}
                  className="w-full mt-6 bg-accent text-white font-semibold rounded-lg py-4 text-lg
                             transition-all duration-300 ease-in-out hover:bg-accent-hover
                             disabled:bg-accent/50 disabled:cursor-not-allowed shadow-lg"
                >
                  {isSubmitting ? "Processing..." : "Confirm & Proceed to Payment"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}