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
    <div className="space-y-4 sm:space-y-6 text-sm">
      {/* Customer Details */}
      <div className="p-3 sm:p-4 bg-secondary-bg/50 rounded-md">
        <h3 className="font-semibold text-heading-color mb-2 text-sm sm:text-base">Customer Information</h3>
        {order.user ? (
          <div className="space-y-1">
            <p className="break-words"><span className="font-medium">Name:</span> {order.user.name}</p>
            <p className="break-words"><span className="font-medium">Email:</span> {order.user.email}</p>
          </div>
        ) : <p>No customer information available.</p>}
      </div>

      {/* Ordered Products */}
      <div>
        <h3 className="font-semibold text-heading-color mb-2 text-sm sm:text-base">Items Ordered</h3>
        <div className="space-y-2 max-h-32 sm:max-h-48 overflow-y-auto pr-2">
          {order.products && order.products.length > 0 ? (
            order.products.map((item: any) => (
              <div key={item._id} className="flex justify-between items-start p-2 border-b border-secondary-bg">
                <div className="flex-1 min-w-0 pr-2">
                  <p className="font-medium text-heading-color text-xs sm:text-sm break-words">{item.product?.title || 'Product not found'}</p>
                  <p className="text-text-color text-xs">Qty: {item.quantity}</p>
                </div>
                <p className="text-text-color text-xs sm:text-sm flex-shrink-0">₹{item.priceAtPurchase?.toFixed(2) || '0.00'}</p>
              </div>
            ))
          ) : <p>No products found in this order.</p>}
        </div>
        <div className="text-right font-bold text-base sm:text-lg text-heading-color mt-2">
          Total: ₹{order.finalAmount?.toFixed(2) || '0.00'}
        </div>
      </div>

      {/* Order Summary */}
      <div className="p-3 sm:p-4 bg-secondary-bg/50 rounded-md">
        <h3 className="font-semibold text-heading-color mb-2 text-sm sm:text-base">Order Summary</h3>
        <div className="space-y-1 text-xs sm:text-sm">
          <div className="flex justify-between">
            <span>Subtotal:</span>
            <span>₹{order.subtotal?.toFixed(2) || '0.00'}</span>
          </div>
          <div className="flex justify-between">
            <span>Shipping:</span>
            <span>₹{order.shippingCost?.toFixed(2) || '0.00'}</span>
          </div>
          {order.discountAmount > 0 && (
            <div className="flex justify-between text-green-600">
              <span>Discount:</span>
              <span>-₹{order.discountAmount?.toFixed(2) || '0.00'}</span>
            </div>
          )}
          <div className="flex justify-between font-bold border-t pt-1 text-sm sm:text-base">
            <span>Final Amount:</span>
            <span>₹{order.finalAmount?.toFixed(2) || '0.00'}</span>
          </div>
        </div>
      </div>

      {/* Shipping Address */}
      {order.shippingAddress && (
        <div className="p-3 sm:p-4 bg-secondary-bg/50 rounded-md">
          <h3 className="font-semibold text-heading-color mb-2 text-sm sm:text-base">Shipping Address</h3>
          <div className="text-xs sm:text-sm space-y-1">
            <p className="break-words"><span className="font-medium">Name:</span> {order.shippingAddress.name}</p>
            <p className="break-words"><span className="font-medium">Address:</span> {order.shippingAddress.line1}</p>
            <p className="break-words"><span className="font-medium">City:</span> {order.shippingAddress.city}</p>
            <p className="break-words"><span className="font-medium">Postal Code:</span> {order.shippingAddress.postalCode}</p>
            <p className="break-words"><span className="font-medium">Country:</span> {order.shippingAddress.country}</p>
            <p className="break-words"><span className="font-medium">Contact:</span> {order.shippingAddress.contactNumber}</p>
          </div>
        </div>
      )}

      {/* Payment Details */}
      {order.manualPaymentDetails?.screenshotUrl && (
        <div className="p-3 sm:p-4 bg-secondary-bg/50 rounded-md">
          <h3 className="font-semibold text-heading-color mb-2 text-sm sm:text-base">Payment Screenshot</h3>
          <p className="text-text-color mb-2 text-xs sm:text-sm">
            Submitted: {new Date(order.manualPaymentDetails.submittedAt).toLocaleString()}
          </p>
          <a href={order.manualPaymentDetails.screenshotUrl} target="_blank" rel="noopener noreferrer">
            <img src={order.manualPaymentDetails.screenshotUrl} alt="Payment Screenshot" className="w-full max-w-xs h-auto rounded-md border-2 border-secondary-bg hover:opacity-80 transition"/>
          </a>
        </div>
      )}

      {/* Action: Update Status */}
      <div className="pt-3 sm:pt-4 border-t border-secondary-bg">
        <h3 className="font-semibold text-heading-color mb-2 text-sm sm:text-base">Update Status</h3>
        <div className="flex flex-col sm:flex-row gap-2">
          {/* ✅ FIX: Values are now uppercase to match backend best practices */}
          <select 
            value={newStatus}
            onChange={(e) => setNewStatus(e.target.value)}
            className="flex-grow p-2 rounded-md bg-primary-bg border border-secondary-bg text-heading-color focus:ring-2 focus:ring-accent outline-none text-sm"
          >
             <option value="Awaiting Manual Payment">Awaiting Manual Payment</option>
            <option value="Pending Verification">Pending Verification</option>
            <option value="Processing">Processing</option>
            <option value="Dispatched">Dispatched</option>
            <option value="Delivered">Delivered</option>
            <option value="Cancelled">Cancelled</option>
          </select>
          <button onClick={handleUpdateClick} className="bg-accent text-white font-semibold px-4 py-2 rounded-md hover:bg-accent-hover text-sm sm:text-base">
            Update
          </button>
        </div>
      </div>
    </div>
  );
}