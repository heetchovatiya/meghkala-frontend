

// contexts/CartContext.tsx
"use client";

import { createContext, useState, useEffect, ReactNode } from 'react';
import { Product } from '@/components/products/ProductCard';
import * as api from '@/lib/api';
import { useAuth } from '@/hooks/useAuth';
import toast from 'react-hot-toast';

export interface CartItem extends Product {
  quantity: number;
}

// ✅ FIX: Add the missing properties to the context's type definition.
interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, newQuantity: number) => void;
  clearCart: () => void;
  cartTotal: number;
  itemCount: number;
  couponCode: string | null; // Stores the code the user entered
  applyCouponCode: (code: string) => void; // A simple function to set the code
  removeCoupon: () => void; // A function to clear the code
}

const CartContext = createContext<CartContextType | null>(null);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

 // ✅ MODIFIED: State now only holds the coupon code string.
  const [couponCode, setCouponCode] = useState<string | null>(null);

// Load cart from localStorage on initial render
  useEffect(() => {
    const storedCart = localStorage.getItem('shoppingCart');
    if (storedCart) {
      setCartItems(JSON.parse(storedCart));
    }
    const storedCoupon = localStorage.getItem('couponCode');
    if (storedCoupon) {
        setCouponCode(storedCoupon);
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('shoppingCart', JSON.stringify(cartItems));
  }, [cartItems]);

  // Save coupon to localStorage whenever it changes
  useEffect(() => {
    if (couponCode) {
        localStorage.setItem('couponCode', couponCode);
    } else {
        localStorage.removeItem('couponCode');
    }
  }, [couponCode]);

const addToCart = (product: Product) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item._id === product._id);
      if (existingItem) {
        // If item exists, just increase quantity
        return prevItems.map(item =>
          item._id === product._id ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        // If new item, add it to the cart with quantity 1
        return [...prevItems, { ...product, quantity: 1 }];
      }
    });
  };

  const removeFromCart = (productId: string) => {
    setCartItems(prevItems => prevItems.filter(item => item._id !== productId));
  };

  const updateQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
    } else {
      setCartItems(prevItems =>
        prevItems.map(item =>
          item._id === productId ? { ...item, quantity: newQuantity } : item
        )
      );
    }
  };
  const clearCart = () => {
    setCartItems([]);
    setCouponCode(null); // Clear the coupon code as well
  };

  

  
  
  const applyCouponCode = (code: string) => {
    setCouponCode(code.toUpperCase().trim());
  };

  const removeCoupon = () => {
    setCouponCode(null);
  };
  

  const cartTotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  const itemCount = cartItems.reduce((count, item) => count + item.quantity, 0);
  
  // The value object is now simpler
  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    cartTotal,
    itemCount,
    couponCode,
    applyCouponCode,
    removeCoupon,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export default CartContext;