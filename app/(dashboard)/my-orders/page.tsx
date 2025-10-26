// app/(dashboard)/my-orders/page.tsx
"use client";

import { useAuth } from '@/hooks/useAuth';
import { useEffect, useState } from 'react';
import * as api from '@/lib/api';
import Link from 'next/link';
import { Search, Eye, Package, RefreshCw } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import Image from 'next/image';
import toast from 'react-hot-toast';

export default function MyOrdersPage() {
  const { token, isAuthenticated } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchOrders = () => {
    if (token) {
      setLoading(true);
      api.getMyOrders(token)
        .then(data => {
          setOrders(data);
          setFilteredOrders(data);
        })
        .catch(err => {
          console.error("Failed to fetch orders:", err);
          toast.error("Failed to load orders");
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [token]);

  // Filter orders based on search
  useEffect(() => {
    let filtered = [...orders];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(order =>
        order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.status?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredOrders(filtered);
  }, [orders, searchTerm]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Please Login</h1>
          <p className="text-gray-600 mb-6">You need to be logged in to view your orders.</p>
          <Link href="/login" className="bg-accent text-white px-6 py-3 rounded-lg hover:bg-accent-hover transition-colors">
            Login Now
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-accent" />
          <p className="text-gray-600">Loading your orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">My Orders</h1>
          <p className="text-gray-600">Track and manage your order history</p>
        </div>

        {/* Simple Search */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6 mb-6">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text"
                placeholder="Search orders by ID or status..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent text-sm"
              />
            </div>
            <div className="text-sm text-gray-600">
              {filteredOrders.length} orders
            </div>
          </div>
        </div>

        {/* Orders List */}
        {filteredOrders.length === 0 ? (
          <div className="text-center py-12">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {orders.length === 0 ? 'No Orders Yet' : 'No Orders Found'}
            </h3>
            <p className="text-gray-600 mb-6">
              {orders.length === 0 
                ? 'You haven\'t placed any orders yet. Start shopping to see your orders here.'
                : 'Try adjusting your search or filter criteria.'
              }
            </p>
            {orders.length === 0 && (
              <Link href="/products" className="bg-accent text-white px-6 py-3 rounded-lg hover:bg-accent-hover transition-colors">
                Start Shopping
              </Link>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map(order => (
              <OrderCard key={order._id} order={order} onViewDetails={setSelectedOrder} />
            ))}
          </div>
        )}

        {/* Order Details Modal */}
        <Modal 
          isOpen={!!selectedOrder} 
          onClose={() => setSelectedOrder(null)}
          title={`Order Details #${selectedOrder?._id.slice(-6).toUpperCase()}`}
        >
          {selectedOrder && <OrderDetailsModal order={selectedOrder} />}
        </Modal>
      </div>
    </div>
  );
}

// Order Card Component
function OrderCard({ order, onViewDetails }: { order: any, onViewDetails: (order: any) => void }) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PROCESSING': return 'bg-blue-100 text-blue-800';
      case 'DISPATCHED': return 'bg-green-100 text-green-800';
      case 'DELIVERED': return 'bg-gray-100 text-gray-800';
      case 'CANCELLED': return 'bg-red-100 text-red-800';
      case 'Awaiting Payment': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-orange-100 text-orange-800';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      {/* Mobile Card View */}
      <div className="lg:hidden">
        <div className="p-4">
          <div className="flex justify-between items-start mb-3">
            <div>
              <h3 className="font-semibold text-gray-900">#{order._id.slice(-6).toUpperCase()}</h3>
              <p className="text-sm text-gray-500">
                {new Date(order.createdAt).toLocaleDateString()}
              </p>
            </div>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
              {order.status?.replace(/_/g, ' ') || 'Unknown'}
            </span>
          </div>
          
          {/* Order Items */}
          <div className="mb-4">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Order Items</h4>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {order.products?.slice(0, 3).map((item: any, index: number) => (
                <div key={index} className="flex justify-between items-center text-xs bg-gray-50 p-2 rounded">
                  <span className="text-gray-600 truncate flex-1 mr-2">
                    {item.product?.title || 'Product'} x{item.quantity}
                  </span>
                  <span className="font-medium text-gray-900">
                    ₹{item.priceAtPurchase?.toFixed(2) || '0.00'}
                  </span>
                </div>
              ))}
              {order.products?.length > 3 && (
                <div className="text-xs text-gray-500 text-center">
                  +{order.products.length - 3} more items
                </div>
              )}
            </div>
            <div className="flex justify-between text-sm mt-3 pt-2 border-t border-gray-200">
              <span className="text-gray-600">Total:</span>
              <span className="font-semibold text-lg">₹{order.finalAmount?.toFixed(2) || '0.00'}</span>
            </div>
          </div>
          
          <button
            onClick={() => onViewDetails(order)}
            className="w-full bg-accent text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-accent-hover transition-colors"
          >
            View Details
          </button>
        </div>
      </div>

      {/* Desktop Card View */}
      <div className="hidden lg:block">
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Order #{order._id.slice(-6).toUpperCase()}</h3>
              <p className="text-sm text-gray-500">
                Placed on {new Date(order.createdAt).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            </div>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
              {order.status?.replace(/_/g, ' ') || 'Unknown'}
            </span>
          </div>
          
          {/* Order Items */}
          <div className="mb-4">
            <h4 className="text-sm font-medium text-gray-700 mb-3">Order Items</h4>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {order.products?.slice(0, 4).map((item: any, index: number) => (
                <div key={index} className="flex justify-between items-center text-sm bg-gray-50 p-3 rounded-lg">
                  <div className="flex-1 min-w-0">
                    <p className="text-gray-900 font-medium truncate">
                      {item.product?.title || 'Product'}
                    </p>
                    <p className="text-gray-500 text-xs">Qty: {item.quantity}</p>
                  </div>
                  <span className="font-semibold text-gray-900 ml-2">
                    ₹{item.priceAtPurchase?.toFixed(2) || '0.00'}
                  </span>
                </div>
              ))}
              {order.products?.length > 4 && (
                <div className="text-sm text-gray-500 text-center py-2">
                  +{order.products.length - 4} more items
                </div>
              )}
            </div>
            <div className="flex justify-between items-center mt-4 pt-3 border-t border-gray-200">
              <span className="text-lg font-medium text-gray-600">Total Amount:</span>
              <span className="text-2xl font-bold text-gray-900">₹{order.finalAmount?.toFixed(2) || '0.00'}</span>
            </div>
          </div>
          
          <div className="flex justify-end">
            <button
              onClick={() => onViewDetails(order)}
              className="flex items-center gap-2 bg-accent text-white px-4 py-2 rounded-lg hover:bg-accent-hover transition-colors"
            >
              <Eye size={16} />
              View Details
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Order Details Modal Component
function OrderDetailsModal({ order }: { order: any }) {
  return (
    <div className="space-y-6">
      {/* Order Summary */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="font-semibold text-gray-900 mb-3">Order Summary</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-600">Order ID:</span>
            <span className="ml-2 font-medium">#{order._id.slice(-6).toUpperCase()}</span>
          </div>
          <div>
            <span className="text-gray-600">Status:</span>
            <span className="ml-2 font-medium">{order.status?.replace(/_/g, ' ') || 'Unknown'}</span>
          </div>
          <div>
            <span className="text-gray-600">Order Date:</span>
            <span className="ml-2 font-medium">{new Date(order.createdAt).toLocaleDateString()}</span>
          </div>
          <div>
            <span className="text-gray-600">Total Amount:</span>
            <span className="ml-2 font-medium">₹{order.finalAmount?.toFixed(2) || '0.00'}</span>
          </div>
        </div>
      </div>

      {/* Order Items */}
      <div>
        <h3 className="font-semibold text-gray-900 mb-3">Order Items</h3>
        <div className="space-y-3">
          {order.products && order.products.length > 0 ? (
            order.products.map((item: any, index: number) => (
              <div key={index} className="flex items-center space-x-4 p-3 border border-gray-200 rounded-lg">
                <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden">
                  <Image
                    src={item.product?.images?.[0] || '/placeholder-product.jpg'}
                    alt={item.product?.title || 'Product'}
                    width={64}
                    height={64}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">
                    {item.product?.title || 'Product'}
                  </h4>
                  <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                  <p className="text-sm font-medium text-gray-900">
                    ₹{item.priceAtPurchase?.toFixed(2) || '0.00'}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Package className="w-12 h-12 mx-auto mb-2 text-gray-300" />
              <p>No order items found</p>
            </div>
          )}
        </div>
      </div>

      {/* Shipping Address */}
      {order.shippingAddress && (
        <div>
          <h3 className="font-semibold text-gray-900 mb-3">Shipping Address</h3>
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="text-sm space-y-1">
              <p><span className="font-medium">Name:</span> {order.shippingAddress.name}</p>
              <p><span className="font-medium">Address:</span> {order.shippingAddress.line1}</p>
              <p><span className="font-medium">City:</span> {order.shippingAddress.city}</p>
              <p><span className="font-medium">Postal Code:</span> {order.shippingAddress.postalCode}</p>
              <p><span className="font-medium">Country:</span> {order.shippingAddress.country}</p>
              <p><span className="font-medium">Contact:</span> {order.shippingAddress.contactNumber}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}