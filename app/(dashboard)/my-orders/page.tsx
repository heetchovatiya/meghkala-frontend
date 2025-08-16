// app/(dashboard)/my-orders/page.tsx
"use client";

import { useAuth } from '@/hooks/useAuth';
import { useEffect, useState } from 'react';
import * as api from '@/lib/api';
import Link from 'next/link';

export default function MyOrdersPage() {
  const { token } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      api.getMyOrders(token)
        .then(data => setOrders(data))
        .catch(err => console.error("Failed to fetch orders:", err))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [token]);
  
  if (loading) {
    return <div>Loading orders...</div>;
  }

  return (
    <div className="bg-secondary-bg/60 p-8 rounded-lg shadow-sm">
      <h1 className="text-3xl font-serif text-heading-color mb-6 border-b border-secondary-bg pb-4">
        My Orders
      </h1>
      <div className="space-y-6">
        {orders.length > 0 ? (
          orders.map(order => (
            <div key={order._id} className="border border-secondary-bg p-4 rounded-md bg-primary-bg">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-semibold text-heading-color">Order ID: #{order._id.slice(-6).toUpperCase()}</p>
                  <p className="text-sm text-text-color">
                    Date: {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <span 
                  className="text-xs font-bold py-1 px-3 rounded-full capitalize"
                  style={{ 
                    backgroundColor: getStatusColor(order.status).bg, 
                    color: getStatusColor(order.status).text 
                  }}
                >
                  {order.status ? order.status.replace(/_/g, ' ') : 'Unknown'}
                </span>
              </div>
              
              {/* ✅ --- THIS IS THE FIX --- ✅ */}
              <div className="mt-4 border-t border-secondary-bg pt-4">
                {/* Use optional chaining `?.` to safely call .slice()
                    This checks if `order.orderItems` exists before trying to slice it.
                    If it doesn't exist, the expression short-circuits and does nothing, preventing the crash.
                */}
                {order.orderItems?.slice(0, 2).map((item: any) => (
                  <p key={item.productId || item._id} className="text-sm text-text-color">
                    {item.quantity} x {item.product?.name || 'Product'}
                  </p>
                ))}
                {(order.orderItems?.length || 0) > 2 && <p className="text-sm text-text-color">...and more</p>}
              </div>

              <div className="text-right mt-2 font-semibold text-heading-color">
                {/* Also add a defensive check for finalAmount */}
                Total: ₹{typeof order.finalAmount === 'number' ? order.finalAmount.toFixed(2) : '0.00'}
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-text-color py-8">You have not placed any orders yet.</p>
        )}
      </div>
    </div>
  );
}

// Helper function for styling order statuses
const getStatusColor = (status: string) => {
  switch (status) {
    case 'PROCESSING': return { bg: '#E0E7FF', text: '#3730A3' };
    case 'DISPATCHED': return { bg: '#D1FAE5', text: '#065F46' };
    case 'DELIVERED': return { bg: '#E5E7EB', text: '#374151' };
    case 'CANCELLED': return { bg: '#FEE2E2', text: '#991B1B' };
    default: return { bg: '#FEF3C7', text: '#92400E' }; // PENDING
  }
};