// components/cart/DiscountBadge.tsx
"use client";

import { useState, useEffect } from 'react';
import { Tag } from 'lucide-react';

interface DiscountBadgeProps {
  cartTotal: number;
  onDiscountApplied?: (discount: any) => void;
}

export function DiscountBadge({ cartTotal, onDiscountApplied }: DiscountBadgeProps) {
  const [applicableDiscounts, setApplicableDiscounts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchApplicableDiscounts = async () => {
      if (cartTotal < 100) return; // Only show discounts for orders above ₹100
      
      setIsLoading(true);
      try {
        const response = await fetch('/api/discounts/calculate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            items: [], // We'll pass empty items for general discounts
            totalAmount: cartTotal,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          setApplicableDiscounts(data.applicableDiscounts || []);
        }
      } catch (error) {
        console.error('Failed to fetch applicable discounts:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchApplicableDiscounts();
  }, [cartTotal]);

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-accent"></div>
        <span>Checking for discounts...</span>
      </div>
    );
  }

  if (applicableDiscounts.length === 0) {
    return null;
  }

  // Filter out discounts with zero value
  const validDiscounts = applicableDiscounts.filter(discount => discount.value > 0);
  
  // If no valid discounts, don't show anything
  if (validDiscounts.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-2">
      {validDiscounts
        .slice(0, 2)
        .map((discount, index) => (
        <div
          key={discount._id}
          className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium ${
            index === 0 
              ? 'bg-green-100 text-green-700 border border-green-200' 
              : 'bg-blue-100 text-blue-700 border border-blue-200'
          }`}
        >
          <Tag size={12} />
          <span>
            {discount.discountType === 'Fixed' 
              ? `₹${discount.value} OFF` 
              : `${discount.value}% OFF`}
          </span>
          {index === 0 && (
            <span className="ml-1 text-xs opacity-75">(Best)</span>
          )}
        </div>
      ))}
    </div>
  );
}
