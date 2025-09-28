"use client";

import { useState, useEffect } from 'react';
import { X, Plus, Minus, Trash2, ShoppingCart, Edit3, LogIn } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { ProductCard } from '@/components/products/ProductCard';
import { DiscountBadge } from './DiscountBadge';
import toast from 'react-hot-toast';

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CartSidebar({ isOpen, onClose }: CartSidebarProps) {
  const { 
    cartItems, 
    updateQuantity, 
    removeFromCart, 
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
    setShippingCost
  } = useCart();
  
  const { isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState<'note' | 'coupon'>('note');
  const [note, setNote] = useState('');
  const [couponInput, setCouponInput] = useState('');
  const [isCalculatingShipping, setIsCalculatingShipping] = useState(false);



  const handleApplyCoupon = async () => {
    if (!couponInput.trim()) return;
    
    try {
      const success = await applyCouponCode(couponInput.trim());
      if (success) {
        setCouponInput('');
      }
    } catch (error) {
      console.error('Failed to apply coupon:', error);
    }
  };

  const handleCheckout = () => {
    if (!isAuthenticated) {
      toast.error('Please login to continue');
      window.location.href = '/login?redirect=/checkout';
      return;
    }
    // Redirect to checkout page
    window.location.href = '/checkout';
  };

  const subtotal = cartTotal;
  const discount = discountAmount;
  const total = finalTotal;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Sidebar */}
      <div className="absolute right-0 top-0 h-full w-full max-w-sm sm:max-w-md bg-white shadow-2xl">
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-gray-200 px-6 py-5 bg-gray-50">
            <div className="flex items-center gap-2">
              <ShoppingCart size={20} className="text-accent" />
              <h2 className="text-xl font-bold text-gray-900">Shopping Cart</h2>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full p-1 transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto px-6 py-4">
            {cartItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12">
                <ShoppingCart size={48} className="text-gray-300 mb-4" />
                <p className="text-gray-500 text-center">Your cart is empty</p>
                <Button 
                  onClick={onClose}
                  className="mt-4"
                  variant="outline"
                >
                  Continue Shopping
                </Button>
              </div>
            ) : (
              <>
                {/* Discount Badges */}
                <div className="mb-4">
                  <DiscountBadge cartTotal={cartTotal} />
                </div>
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div key={item._id} className="flex items-center space-x-4 border-b border-gray-100 pb-4">
                    {/* Product Image */}
                    <div className="h-16 w-16 flex-shrink-0">
                      <img
                        src={item.images[0]}
                        alt={item.title}
                        className="h-full w-full rounded object-cover"
                      />
                    </div>
                    
                    {/* Product Details */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium text-gray-900 truncate">
                        {item.title}
                      </h3>
                      <div className="text-sm">
                        {item.originalPrice && item.originalPrice > item.price ? (
                          <div className="flex items-center gap-2">
                            <span className="text-accent font-semibold">₹{item.price.toLocaleString()}</span>
                            <span className="text-gray-500 line-through text-xs">₹{item.originalPrice.toLocaleString()}</span>
                          </div>
                        ) : (
                          <p className="text-accent font-semibold">₹{item.price.toLocaleString()}</p>
                        )}
                      </div>
                      
                      {/* Quantity Controls */}
                      <div className="flex items-center space-x-2 mt-2">
                        <button
                          onClick={() => updateQuantity(item._id, item.cartQuantity - 1)}
                          className="p-1 rounded-full hover:bg-gray-100"
                        >
                          <Minus size={16} />
                        </button>
                        <span className="text-sm font-medium w-8 text-center">
                          {item.cartQuantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item._id, item.cartQuantity + 1)}
                          className="p-1 rounded-full hover:bg-gray-100"
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                    </div>
                    
                    {/* Price and Remove */}
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">
                        ₹{(item.price * item.cartQuantity).toLocaleString()}
                      </p>
                      <button
                        onClick={() => removeFromCart(item._id)}
                        className="text-red-500 hover:text-red-700 mt-1"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              </>
            )}
          </div>

          {/* Action Tabs */}
          {cartItems.length > 0 && (
            <div className="border-t border-gray-200 px-6 py-4">
              <div className="flex space-x-4 mb-4">
                <button
                  onClick={() => setActiveTab('note')}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium ${
                    activeTab === 'note' 
                      ? 'bg-gray-100 text-gray-900' 
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Edit3 size={16} />
                  <span>NOTE</span>
                </button>
                <button
                  onClick={() => setActiveTab('coupon')}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium ${
                    activeTab === 'coupon' 
                      ? 'bg-gray-100 text-gray-900' 
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <ShoppingCart size={16} />
                  <span>COUPON</span>
                </button>
              </div>

              {/* Tab Content */}
              {activeTab === 'note' && (
                <div>
                  <Input
                    id="order-note"
                    label="Order Note"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Add a note for your order..."
                    className="w-full"
                  />
                </div>
              )}


              {activeTab === 'coupon' && (
                <div className="space-y-3">
                  {couponCode && couponData ? (
                    <div className="flex items-center justify-between bg-green-50 p-3 rounded-md">
                      <div>
                        <span className="text-sm text-green-800">Coupon: {couponCode}</span>
                        <p className="text-xs text-green-600">
                          {couponData.discountType === 'Fixed' 
                            ? `₹${couponData.value} off` 
                            : `${couponData.value}% off`}
                        </p>
                      </div>
                      <button
                        onClick={removeCoupon}
                        className="text-green-600 hover:text-green-800"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ) : (
                    <div className="flex space-x-2">
                      <Input
                        id="coupon-code"
                        label=""
                        value={couponInput}
                        onChange={(e) => setCouponInput(e.target.value)}
                        placeholder="Enter coupon code"
                        className="flex-1"
                      />
                      <Button
                        onClick={handleApplyCoupon}
                        disabled={!couponInput.trim()}
                        size="sm"
                      >
                        Apply
                      </Button>
                    </div>
                  )}
                </div>
              )}

              {/* Pricing Summary */}
              <div className="mt-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Subtotal</span>
                  <span className="text-gray-900">₹{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Shipping</span>
                  <span className="text-gray-900">
                    {isCalculatingShipping ? 'Calculating...' : 
                     shippingCost === 0 ? 'Free' : `₹${shippingCost.toLocaleString()}`}
                  </span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Coupon Discount</span>
                    <span>-₹{discount.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between text-lg font-bold border-t border-gray-200 pt-2">
                  <span>Total</span>
                  <span>₹{total.toLocaleString()}</span>
                </div>
              </div>

              {/* Checkout Button */}
              <Button
                onClick={handleCheckout}
                className="w-full mt-4"
                size="lg"
              >
                {isAuthenticated ? (
                  `CHECK OUT - ₹${total.toLocaleString()}`
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    <LogIn size={20} />
                    LOGIN TO CONTINUE
                  </div>
                )}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
