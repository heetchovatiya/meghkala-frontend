"use client";

import { useAuth } from '@/hooks/useAuth';
import { useEffect, useState } from 'react';
import * as api from '@/lib/api';
import toast from 'react-hot-toast';
import { RefreshCw, Mail, User, Package, Calendar } from 'lucide-react';

interface Notification {
  _id: string;
  user: {
    _id: string;
    name: string;
    email: string;
  };
  product: {
    _id: string;
    title: string;
    images: string[];
    price: number;
    quantity: number;
  };
  email: string;
  status: 'pending' | 'sent' | 'cancelled';
  createdAt: string;
  notifiedAt?: string;
}

export default function AdminNotificationsPage() {
  const { token } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    if (!token) return;
    
    setLoading(true);
    try {
      const data = await api.getAllStockNotifications(token);
      setNotifications(data);
    } catch (error: any) {
      toast.error(error.message || 'Failed to fetch notifications');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [token]);

  const handleSendNotifications = async (productId: string) => {
    if (!token) return;
    
    try {
      const result = await api.sendStockNotifications(token, productId);
      toast.success(`Notifications sent: ${result.successful} successful, ${result.failed} failed`);
      fetchNotifications(); // Refresh the list
    } catch (error: any) {
      toast.error(error.message || 'Failed to send notifications');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'sent': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'Pending';
      case 'sent': return 'Sent';
      case 'cancelled': return 'Cancelled';
      default: return status;
    }
  };

  // Group notifications by product
  const notificationsByProduct = notifications.reduce((acc, notification) => {
    const productId = notification.product._id;
    if (!acc[productId]) {
      acc[productId] = {
        product: notification.product,
        notifications: []
      };
    }
    acc[productId].notifications.push(notification);
    return acc;
  }, {} as Record<string, { product: any; notifications: Notification[] }>);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-5rem)]">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Stock Notifications</h1>
          <p className="text-gray-600 mt-2">Manage customer stock notification requests</p>
        </div>
        <button
          onClick={fetchNotifications}
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          <RefreshCw size={16} />
          Refresh
        </button>
      </div>

      {Object.keys(notificationsByProduct).length === 0 ? (
        <div className="text-center py-12">
          <Mail className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No notifications</h3>
          <p className="mt-1 text-sm text-gray-500">No stock notification requests found.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(notificationsByProduct).map(([productId, { product, notifications: productNotifications }]) => (
            <div key={productId} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-4">
                  {product.images?.[0] && (
                    <img
                      src={product.images[0]}
                      alt={product.title}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                  )}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{product.title}</h3>
                    <p className="text-sm text-gray-600">₹{product.price.toFixed(2)}</p>
                    <p className="text-sm text-gray-500">Stock: {product.quantity}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">
                    {productNotifications.filter(n => n.status === 'pending').length} pending
                  </p>
                  <p className="text-sm text-gray-500">
                    {productNotifications.length} total requests
                  </p>
                </div>
              </div>

              {product.quantity > 0 && productNotifications.some(n => n.status === 'pending') && (
                <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-green-800 font-medium">Product is back in stock!</p>
                      <p className="text-green-600 text-sm">
                        {productNotifications.filter(n => n.status === 'pending').length} customers waiting for notification
                      </p>
                    </div>
                    <button
                      onClick={() => handleSendNotifications(productId)}
                      className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                    >
                      Send Notifications
                    </button>
                  </div>
                </div>
              )}

              <div className="space-y-3">
                <h4 className="font-medium text-gray-900">Notification Requests</h4>
                {productNotifications.map((notification) => (
                  <div key={notification._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <User size={16} className="text-gray-400" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {notification.user?.name || 'Unknown User'}
                        </p>
                        <p className="text-sm text-gray-600">{notification.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(notification.status)}`}>
                        {getStatusText(notification.status)}
                      </span>
                      <div className="text-right text-sm text-gray-500">
                        <p>Requested: {new Date(notification.createdAt).toLocaleDateString()}</p>
                        {notification.notifiedAt && (
                          <p>Notified: {new Date(notification.notifiedAt).toLocaleDateString()}</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

