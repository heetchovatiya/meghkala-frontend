// components/checkout/ShippingOptions.tsx
"use client";

import { useState, useEffect } from 'react';
import { useCart } from '@/hooks/useCart';
import * as api from '@/lib/api';

interface ShippingOption {
  _id: string;
  name: string;
  description: string;
  estimatedDays: {
    min: number;
    max: number;
  };
  isFastDelivery: boolean;
  fastDeliveryExtraCharge: number;
}

export function ShippingOptions({ onShippingChange }: { onShippingChange: (cost: number, method: any) => void }) {
  const { cartItems, cartTotal } = useCart();
  const [shippingMethods, setShippingMethods] = useState<ShippingOption[]>([]);
  const [selectedMethod, setSelectedMethod] = useState<string>('');
  const [isFastDelivery, setIsFastDelivery] = useState(false);
  const [shippingCost, setShippingCost] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchShippingMethods = async () => {
      try {
        const methods = await api.getShippingMethods();
        setShippingMethods(methods);
        if (methods.length > 0) {
          setSelectedMethod(methods[0]._id);
        }
      } catch (error) {
        console.error('Failed to fetch shipping methods:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchShippingMethods();
  }, []);

  useEffect(() => {
    const calculateShipping = async () => {
      if (!selectedMethod || cartItems.length === 0) return;

      try {
        const items = cartItems.map(item => ({
          _id: item._id,
          quantity: item.cartQuantity,
          price: item.price
        }));

        const result = await api.calculateShippingCost({
          items,
          country: 'IN',
          shippingMethodId: selectedMethod,
          isFastDelivery
        });

        setShippingCost(result.shippingCost);
        onShippingChange(result.shippingCost, result.shippingMethod);
      } catch (error) {
        console.error('Failed to calculate shipping:', error);
      }
    };

    calculateShipping();
  }, [selectedMethod, isFastDelivery, cartItems, onShippingChange]);

  if (loading) {
    return (
      <div className="p-6 bg-secondary-bg/60 rounded-lg">
        <h2 className="text-2xl font-serif text-heading-color mb-4">Shipping Options</h2>
        <div className="animate-pulse">
          <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-gray-300 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  const selectedShippingMethod = shippingMethods.find(method => method._id === selectedMethod);

  return (
    <div className="p-6 bg-secondary-bg/60 rounded-lg">
      <h2 className="text-2xl font-serif text-heading-color mb-4">Shipping Options</h2>
      
      {/* Simple delivery charge info */}
      <div className="mb-6 p-4 bg-white rounded-lg border">
        <h3 className="font-semibold text-heading-color mb-2">Delivery Charges</h3>
        <div className="text-sm text-text-color space-y-1">
          <p>• Orders above ₹699: <span className="text-green-600 font-semibold">FREE DELIVERY</span></p>
          <p>• Orders below ₹699: <span className="text-text-color font-semibold">₹40 delivery charge</span></p>
          <p className="text-xs text-gray-500 mt-2">
            Current order total: <span className="font-semibold">₹{cartTotal.toLocaleString()}</span>
          </p>
        </div>
      </div>

      {/* Shipping method selection */}
      <div className="space-y-3">
        {shippingMethods.map(method => (
          <label key={method._id} className="flex items-start space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
            <input
              type="radio"
              name="shippingMethod"
              value={method._id}
              checked={selectedMethod === method._id}
              onChange={(e) => setSelectedMethod(e.target.value)}
              className="mt-1"
            />
            <div className="flex-1">
              <div className="font-medium text-heading-color">{method.name}</div>
              <div className="text-sm text-text-color">{method.description}</div>
              <div className="text-sm text-gray-500">
                Estimated delivery: {method.estimatedDays.min}-{method.estimatedDays.max} days
              </div>
            </div>
          </label>
        ))}
      </div>

      {/* Fast delivery option */}
      {selectedShippingMethod?.isFastDelivery && (
        <div className="mt-4 p-3 border rounded-lg bg-blue-50">
          <label className="flex items-center space-x-3 cursor-pointer">
            <input
              type="checkbox"
              checked={isFastDelivery}
              onChange={(e) => setIsFastDelivery(e.target.checked)}
              className="rounded"
            />
            <div>
              <div className="font-medium text-heading-color">Fast Delivery</div>
              <div className="text-sm text-text-color">
                Extra charge: ₹{selectedShippingMethod.fastDeliveryExtraCharge}
              </div>
              <div className="text-sm text-gray-500">
                Estimated delivery: 1-2 days
              </div>
            </div>
          </label>
        </div>
      )}

      {/* Shipping cost summary */}
      <div className="mt-4 p-3 bg-white rounded-lg border">
        <div className="flex justify-between items-center">
          <span className="font-medium text-heading-color">Shipping Cost:</span>
          <span className="font-semibold text-lg">
            {shippingCost === 0 ? (
              <span className="text-green-600">FREE</span>
            ) : (
              `₹${shippingCost}`
            )}
          </span>
        </div>
      </div>
    </div>
  );
}
