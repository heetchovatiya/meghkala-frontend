// contexts/CartContext.tsx
"use client";

import { createContext, useState, useEffect, ReactNode } from 'react';
import { Product } from '@/components/products/ProductCard';
import toast from 'react-hot-toast';

export interface CartItem extends Product {
  cartQuantity: number;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: Product, quantityToAdd?: number) => void; 
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, newCartQuantity: number) => void;
  clearCart: () => void;
  cartTotal: number;
  itemCount: number;
  couponCode: string | null;
  applyCouponCode: (code: string) => void;
  removeCoupon: () => void;
}

const CartContext = createContext<CartContextType | null>(null);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  // Initialize state safely from localStorage on the client-side
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    if (typeof window !== 'undefined') {
        const storedCart = localStorage.getItem('shoppingCart');
        return storedCart ? JSON.parse(storedCart) : [];
    }
    return [];
  });
  
  const [couponCode, setCouponCode] = useState<string | null>(() => {
     if (typeof window !== 'undefined') {
        const storedCoupon = localStorage.getItem('couponCode');
        return storedCoupon ? storedCoupon : null;
     }
     return null;
  });

  // useEffects to SAVE data to localStorage
  useEffect(() => { localStorage.setItem('shoppingCart', JSON.stringify(cartItems)); }, [cartItems]);
  useEffect(() => {
    if (couponCode) { localStorage.setItem('couponCode', couponCode); } 
    else { localStorage.removeItem('couponCode'); }
  }, [couponCode]);

  // This is the single source of truth for all quantity modifications and stock checks.
  const updateQuantity = (productId: string, newCartQuantity: number) => {
    setCartItems(prevItems => {
      const itemToUpdate = prevItems.find(item => item._id === productId);
      if (!itemToUpdate) return prevItems;

      if (newCartQuantity <= 0) {
        return prevItems.filter(item => item._id !== productId);
      }
      
      if (itemToUpdate.availability === 'IN_STOCK' && itemToUpdate.quantity < newCartQuantity) {
        // ✅ Use `itemToUpdate.name` for consistency
        toast.error(`Sorry, only ${itemToUpdate.quantity} of ${itemToUpdate.title} are available.`);
        return prevItems;
      }

      return prevItems.map(item =>
        item._id === productId ? { ...item, cartQuantity: newCartQuantity } : item
      );
    });
  };

  // ✅ MODIFIED: This function is now simpler and delegates its logic.
  const addToCart = (product: Product, quantityToAdd: number = 1) => {
    // Check if the item already exists in the current state (not inside the updater).
    const existingItem = cartItems.find(item => item._id === product._id);

    if (existingItem) {
      // If the item exists, simply call our robust updateQuantity function.
      updateQuantity(product._id, existingItem.cartQuantity + quantityToAdd);
    } else {
      // If it's a new item, perform a direct stock check first.
      if (product.availability === 'IN_STOCK' && product.quantity < quantityToAdd) {
        toast.error(`Sorry, only ${product.quantity} of ${product.title} are available.`);
        return; // Abort if not enough stock for a new item.
      }
      // Add the new item to the cart.
      setCartItems(prevItems => [...prevItems, { ...product, cartQuantity: quantityToAdd }]);
    }
  };

  const removeFromCart = (productId: string) => { setCartItems(prevItems => prevItems.filter(item => item._id !== productId)); };
  const clearCart = () => { setCartItems([]); setCouponCode(null); };
  const applyCouponCode = (code: string) => { setCouponCode(code.toUpperCase().trim()); };
  const removeCoupon = () => { setCouponCode(null); };
  
  const cartTotal = cartItems.reduce((total, item) => total + item.price * item.cartQuantity, 0);
  const itemCount = cartItems.reduce((count, item) => count + item.cartQuantity, 0);
  
  const value = {
    cartItems, addToCart, removeFromCart, updateQuantity, clearCart,
    cartTotal, itemCount, couponCode, applyCouponCode, removeCoupon,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export default CartContext;