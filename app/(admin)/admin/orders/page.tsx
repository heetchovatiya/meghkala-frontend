// app/(admin)/admin/orders/page.tsx
"use client";

import { useAuth } from '@/hooks/useAuth';
import { useEffect, useState } from 'react';
import * as api from '@/lib/api';
import toast from 'react-hot-toast'; // Import toast for user feedback
import { Modal } from '@/components/ui/Modal';
import { OrderDetailsModal } from '@/components/admin/OrderDetailsModal';

export default function AdminOrdersPage() {
  const { token } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);

  const fetchOrders = () => {
    if (token) {
      api.adminGetAllOrders(token)
        .then(data => setOrders(data))
        .catch(() => toast.error("Failed to fetch orders."))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  };

  useEffect(fetchOrders, [token]);

  // ✅ NEW: Function to handle the status update.
  // This function lives in the parent component so it can refresh the data.
  const handleUpdateStatus = async (orderId: string, newStatus: string) => {
    if (!token) return toast.error("Authentication session expired.");

    const toastId = toast.loading("Updating status...");
    try {
      await api.adminUpdateOrderStatus(token, orderId, newStatus);
      toast.success(`Order status updated!`, { id: toastId });
      
      fetchOrders(); // Re-fetch the orders to show the change in the table.
      setSelectedOrder(null); // Close the modal on success.
    } catch (error: any) {
      toast.error(`Error: ${error.message}`, { id: toastId });
    }
  };

  if (loading && orders.length === 0) return <div>Loading orders...</div>;

  return (
    <div>
      <h1 className="text-3xl font-serif text-heading-color mb-8">Manage Orders</h1>
      <div className="bg-primary-bg rounded-lg shadow-md overflow-x-auto">
        <table className="w-full text-left min-w-[700px]">
          {/* ... (thead and tbody are correct) ... */}
          <tbody>
            {orders.map(order => (
              <tr key={order._id} className="border-b border-secondary-bg last:border-b-0">
                <td className="p-4 font-mono text-sm">#{order._id.slice(-6).toUpperCase()}</td>
                <td className="p-4">{new Date(order.createdAt).toLocaleDateString()}</td>
                <td className="p-4">{order.user?.name || 'N/A'}</td>
                <td className="p-4 font-semibold">
                  {typeof order.finalAmount === 'number' ? `₹${order.finalAmount.toFixed(2)}` : 'N/A'}
                </td>
                <td className="p-4 capitalize">{order.status ? order.status.replace(/_/g, ' ') : 'Unknown'}</td>
                <td className="p-4">
                  <button onClick={() => setSelectedOrder(order)} className="text-accent hover:underline">
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal 
        isOpen={!!selectedOrder} 
        onClose={() => setSelectedOrder(null)}
        title={`Order Details #${selectedOrder?._id.slice(-6).toUpperCase()}`}
      >
        {/* ✅ MODIFIED: Pass the handleUpdateStatus function as a prop */}
        {selectedOrder && (
          <OrderDetailsModal 
            order={selectedOrder} 
            onUpdateStatus={handleUpdateStatus} 
          />
        )}
      </Modal>
    </div>
  );
}