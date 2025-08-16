// app/order-success/[orderId]/page.tsx
import { getMyOrders } from '@/lib/api'; // We can reuse getMyOrders or create a specific getOrderById
import { CheckCircle } from 'lucide-react';
import Link from 'next/link';

// This is a placeholder for getting the token on the server.
// In a real app, you'd use a library like `next-auth` or handle cookies.
// For now, this page confirms the concept.
async function getOrderDetails(orderId: string) {
  // NOTE: Getting a token on the server is an advanced topic.
  // This page will conceptually show what to display.
  // A simpler client-side fetch might be easier to start with.
  return { _id: orderId, status: 'PENDING_CONFIRMATION' }; // Mock data
}

export default async function OrderSuccessPage({ params }: { params: { orderId: string } }) {
  const order = await getOrderDetails(params.orderId);

  return (
    <div className="container mx-auto text-center py-20 px-6">
      <CheckCircle size={64} className="mx-auto text-green-500" />
      <h1 className="text-4xl font-serif text-heading-color mt-6">Thank You For Your Order!</h1>
      <p className="text-text-color mt-2 max-w-lg mx-auto">
        Your order has been placed successfully. Your order number is <strong>#{order._id.slice(-6).toUpperCase()}</strong>.
      </p>
      <div className="mt-4 p-4 bg-secondary-bg/60 rounded-md inline-block">
        <p className="font-semibold text-heading-color">
          Current Status: {order.status.replace('_', ' ')}
        </p>
      </div>
      <p className="text-text-color mt-4 text-sm max-w-lg mx-auto">
        You will receive an email confirmation shortly. For items that are "Made to Order", our team will contact you to confirm details before proceeding with payment.
      </p>
      <div className="mt-10">
        <Link href="/products" className="bg-accent text-white font-semibold py-3 px-6 rounded-md">
            Continue Shopping
        </Link>
      </div>
    </div>
  );
}