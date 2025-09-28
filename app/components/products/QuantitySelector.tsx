// components/products/QuantitySelector.tsx
"use client";

import { useState, useEffect } from 'react';
import { Minus, Plus } from 'lucide-react';

interface QuantitySelectorProps {
  initialQuantity?: number;
  min?: number;
  max?: number;
  onQuantityChange?: (quantity: number) => void;
}

export function QuantitySelector({ 
  initialQuantity = 1, 
  min = 1, 
  max = 99,
  onQuantityChange 
}: QuantitySelectorProps) {
  // Ensure quantity is never less than min
  const [quantity, setQuantity] = useState(Math.max(initialQuantity, min));

  // Update quantity when initialQuantity prop changes
  useEffect(() => {
    setQuantity(Math.max(initialQuantity, min));
  }, [initialQuantity, min]);

  const handleDecrease = () => {
    if (quantity > min) {
      const newQuantity = quantity - 1;
      setQuantity(newQuantity);
      onQuantityChange?.(newQuantity);
    }
  };

  const handleIncrease = () => {
    if (quantity < max) {
      const newQuantity = quantity + 1;
      setQuantity(newQuantity);
      onQuantityChange?.(newQuantity);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || min;
    const clampedValue = Math.max(min, Math.min(max, value));
    setQuantity(clampedValue);
    onQuantityChange?.(clampedValue);
  };

  return (
    <div className="flex items-center border border-gray-300 rounded-md overflow-hidden">
      <button
        onClick={handleDecrease}
        disabled={quantity <= min}
        className="px-3 py-2 bg-gray-50 hover:bg-gray-100 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
        aria-label="Decrease quantity"
      >
        <Minus size={16} />
      </button>
      <input
        type="number"
        value={quantity}
        onChange={handleInputChange}
        min={min}
        max={max}
        className="w-16 px-3 py-2 text-center border-0 focus:outline-none focus:ring-0"
        aria-label="Quantity"
      />
      <button
        onClick={handleIncrease}
        disabled={quantity >= max}
        className="px-3 py-2 bg-gray-50 hover:bg-gray-100 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
        aria-label="Increase quantity"
      >
        <Plus size={16} />
      </button>
    </div>
  );
}
