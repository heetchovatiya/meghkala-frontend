"use client";

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import toast from 'react-hot-toast';
import * as api from '@/lib/api';

interface NotifyMeButtonProps {
  product: {
    _id: string;
    title: string;
  };
}

export function NotifyMeButton({ product }: NotifyMeButtonProps) {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const handleNotifyMe = async () => {
    if (!user?.email) {
      toast.error('Please log in to get notifications');
      return;
    }

    setIsLoading(true);
    try {
      await api.createStockNotification(product._id, user.email);
      toast.success(`We'll notify you when ${product.title} is back in stock!`);
    } catch (error: any) {
      toast.error(error.message || 'Failed to set up notification');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button 
      onClick={handleNotifyMe}
      disabled={isLoading}
      className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {isLoading ? 'Setting up...' : 'Notify Me When Available'}
    </button>
  );
}

