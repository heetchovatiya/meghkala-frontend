// components/admin/OrderDetailsModal.tsx
"use client";
import { useState } from 'react';

interface OrderDetailsModalProps {
  order: any;
  onUpdateStatus: (orderId: string, newStatus: string) => void;
}

export function OrderDetailsModal({ order, onUpdateStatus }: OrderDetailsModalProps) {
  // Guard clause: If for some reason there's no order, show nothing.
  if (!order) {
    return <div className="p-4">No order data available.</div>;
  }

  // Initialize the dropdown with the order's current status.
  const [newStatus, setNewStatus] = useState(order.status || '');
  
  const handleUpdateClick = () => {
    onUpdateStatus(order._id, newStatus);
  };

  return (
    <div className="space-y-6 text-sm">
      {/* Customer Details */}
      <div className="p-4 bg-secondary-bg/50 rounded-md">
        <h3 className="font-semibold text-heading-color mb-2">Customer Information</h3>
        {order.user ? (
          <>
            <p><span className="font-medium">Name:</span> {order.user.name}</p>
            <p><span className="font-medium">Email:</span> {order.user.email}</p>
          </>
        ) : <p>No customer information available.</p>}
      </div>

      {/* Ordered Products */}
      <div>
        <h3 className="font-semibold text-heading-color mb-2">Items Ordered</h3>
        <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
          {order.products && order.products.length > 0 ? (
            order.products.map((item: any) => (
              <div key={item._id} className="flex justify-between items-center p-2 border-b border-secondary-bg">
                <div>
                  <p className="font-medium text-heading-color">{item.product?.title || 'Product not found'}</p>
                  <p className="text-text-color">Qty: {item.quantity}</p>
                </div>
                <p className="text-text-color">₹{item.priceAtPurchase?.toFixed(2) || '0.00'} each</p>
              </div>
            ))
          ) : <p>No products found in this order.</p>}
        </div>
        <div className="text-right font-bold text-lg text-heading-color mt-2">
          Total: ₹{order.finalAmount?.toFixed(2) || '0.00'}
        </div>
      </div>

      {/* Payment Details */}
      {order.manualPaymentDetails?.screenshotUrl && (
        <div className="p-4 bg-secondary-bg/50 rounded-md">
          <h3 className="font-semibold text-heading-color mb-2">Payment Screenshot</h3>
          <p className="text-text-color mb-2">
            Submitted: {new Date(order.manualPaymentDetails.submittedAt).toLocaleString()}
          </p>
          <a href={order.manualPaymentDetails.screenshotUrl} target="_blank" rel="noopener noreferrer">
            <img src={order.manualPaymentDetails.screenshotUrl} alt="Payment Screenshot" className="max-w-xs h-auto rounded-md border-2 border-secondary-bg hover:opacity-80 transition"/>
          </a>
        </div>
      )}

      {/* Action: Update Status */}
      <div className="pt-4 border-t border-secondary-bg">
        <h3 className="font-semibold text-heading-color mb-2">Update Status</h3>
        <div className="flex gap-2">
          {/* ✅ FIX: Values are now uppercase to match backend best practices */}
          <select 
            value={newStatus}
            onChange={(e) => setNewStatus(e.target.value)}
            className="flex-grow p-2 rounded-md bg-primary-bg border border-secondary-bg text-heading-color focus:ring-2 focus:ring-accent outline-none"
          >
             <option value="Awaiting Manual Payment">Awaiting Manual Payment</option>
            <option value="Pending Verification">Pending Verification</option>
            <option value="Processing">Processing</option>
            <option value="Dispatched">Dispatched</option>
            <option value="Delivered">Delivered</option>
            <option value="Cancelled">Cancelled</option>
          </select>
          <button onClick={handleUpdateClick} className="bg-accent text-white font-semibold px-4 rounded-md hover:bg-accent-hover">
            Update
          </button>
        </div>
      </div>
    </div>
  );
}