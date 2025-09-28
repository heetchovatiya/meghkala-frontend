// contexts/CartContext.tsx
"use client";

import { createContext, useState, useEffect, ReactNode } from 'react';
import { Product } from '@/components/products/ProductCard';
import toast from 'react-hot-toast';
import { validateCoupon, calculateShippingCost } from '@/lib/api';

export interface CartItem extends Product {
  cartQuantity: number;
}

export interface CouponData {
  code: string;
  discountType: 'Percentage' | 'Fixed';
  value: number;
  expiryDate: string;
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
  couponData: CouponData | null;
  discountAmount: number;
  finalTotal: number;
  applyCouponCode: (code: string) => Promise<boolean>;
  removeCoupon: () => void;
  shippingCost: number;
  setShippingCost: (cost: number) => void;
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

  const [couponData, setCouponData] = useState<CouponData | null>(() => {
    if (typeof window !== 'undefined') {
      const storedCouponData = localStorage.getItem('couponData');
      return storedCouponData ? JSON.parse(storedCouponData) : null;
    }
    return null;
  });

  const [shippingCost, setShippingCost] = useState<number>(0);

  // Auto-calculate shipping when cart items change
  useEffect(() => {
    const calculateShipping = async () => {
      if (cartItems.length === 0) {
        setShippingCost(0);
        return;
      }

      try {
        const items = cartItems.map(item => ({
          _id: item._id,
          quantity: item.cartQuantity,
          price: item.price
        }));

        const result = await calculateShippingCost({
          items,
          country: 'IN' // Default to India
        });

        setShippingCost(result.shippingCost);
      } catch (error) {
        console.error('Failed to calculate shipping:', error);
        setShippingCost(0);
      }
    };

    calculateShipping();
  }, [cartItems]);

  // useEffects to SAVE data to localStorage
  useEffect(() => { 
    localStorage.setItem('shoppingCart', JSON.stringify(cartItems)); 
  }, [cartItems]);
  
  useEffect(() => {
    if (couponCode) { 
      localStorage.setItem('couponCode', couponCode); 
    } else { 
      localStorage.removeItem('couponCode'); 
    }
  }, [couponCode]);

  useEffect(() => {
    if (couponData) {
      localStorage.setItem('couponData', JSON.stringify(couponData));
    } else {
      localStorage.removeItem('couponData');
    }
  }, [couponData]);

  // Enhanced inventory management with proper stock checking
  const updateQuantity = (productId: string, newCartQuantity: number) => {
    setCartItems(prevItems => {
      const itemToUpdate = prevItems.find(item => item._id === productId);
      if (!itemToUpdate) return prevItems;

      if (newCartQuantity <= 0) {
        return prevItems.filter(item => item._id !== productId);
      }
      
      // Check available quantity (total - reserved)
      const availableQuantity = itemToUpdate.quantity - (itemToUpdate.reserved || 0);
      
      if (itemToUpdate.availability === 'IN_STOCK' && availableQuantity < newCartQuantity) {
        toast.error(`Sorry, only ${availableQuantity} of ${itemToUpdate.title} are available.`);
        return prevItems;
      }

      return prevItems.map(item =>
        item._id === productId ? { ...item, cartQuantity: newCartQuantity } : item
      );
    });
  };

  // Enhanced add to cart with proper stock validation
  const addToCart = (product: Product, quantityToAdd: number = 1) => {
    const existingItem = cartItems.find(item => item._id === product._id);

    if (existingItem) {
      updateQuantity(product._id, existingItem.cartQuantity + quantityToAdd);
    } else {
      // Check available quantity for new items
      const availableQuantity = product.quantity - (product.reserved || 0);
      
      if (product.availability === 'IN_STOCK' && availableQuantity < quantityToAdd) {
        toast.error(`Sorry, only ${availableQuantity} of ${product.title} are available.`);
        return;
      }
      
      setCartItems(prevItems => [...prevItems, { ...product, cartQuantity: quantityToAdd }]);
      toast.success(`${product.title} added to cart!`);
    }
  };

  const removeFromCart = (productId: string) => { 
    setCartItems(prevItems => prevItems.filter(item => item._id !== productId)); 
  };
  
  const clearCart = () => { 
    setCartItems([]); 
    setCouponCode(null); 
    setCouponData(null);
    setShippingCost(0);
  };

  // Enhanced coupon application with API validation
  const applyCouponCode = async (code: string): Promise<boolean> => {
    try {
      const coupon = await validateCoupon(code);
      if (coupon) {
        setCouponCode(code.toUpperCase().trim());
        setCouponData(coupon);
        toast.success('Coupon applied successfully!');
        return true;
      }
      return false;
    } catch (error: any) {
      toast.error(error.message || 'Invalid coupon code');
      return false;
    }
  };

  const removeCoupon = () => { 
    setCouponCode(null); 
    setCouponData(null);
    toast.success('Coupon removed');
  };
  
  // Calculate totals
  const cartTotal = cartItems.reduce((total, item) => total + item.price * item.cartQuantity, 0);
  const itemCount = cartItems.reduce((count, item) => count + item.cartQuantity, 0);
  
  // Calculate discount amount
  const discountAmount = (() => {
    if (!couponData) return 0;
    
    if (couponData.discountType === 'Fixed') {
      return Math.min(couponData.value, cartTotal);
    } else {
      return (cartTotal * couponData.value) / 100;
    }
  })();

  const finalTotal = Math.max(0, cartTotal - discountAmount + shippingCost);
  
  const value = {
    cartItems, 
    addToCart, 
    removeFromCart, 
    updateQuantity, 
    clearCart,
    cartTotal, 
    itemCount, 
    couponCode, 
    couponData,
    discountAmount,
    finalTotal,
    applyCouponCode, 
    removeCoupon,
    shippingCost,
    setShippingCost,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export default CartContext;