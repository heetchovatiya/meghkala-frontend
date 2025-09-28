// components/products/ProductCard.tsx
"use client";

import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/hooks/useCart';
import { useAuth } from '@/hooks/useAuth';
import toast from 'react-hot-toast';
import { ShoppingBag } from 'lucide-react';
import * as api from '@/lib/api';

export interface Product {
    _id: string;
    title: string;
    price: number;
    originalPrice?: number;
    discountPercentage?: number;
    discountStartDate?: string;
    discountEndDate?: string;
    images: string[];
    quantity: number;
    reserved?: number;
    availability: string;
    description?: string;
    category?: { _id: string; name: string };
    subcategory?: { _id: string; name: string };
    sku?: string;
    weight?: number;
    dimensions?: {
        length?: number;
        width?: number;
        height?: number;
    };
    tags?: string[];
    isFeatured?: boolean;
    averageRating?: number;
    reviewCount?: number;
}

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  if (!product) { return null; }

  const { addToCart } = useCart();
  const { user } = useAuth();
  const displayImage = product.images?.[0] || '/placeholder-product.jpg';
  const isOutOfStock = product.quantity <= 0;

  const handleAddToCart = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault(); 
    e.stopPropagation();
    if (isOutOfStock) {
      toast.error(`${product.title} is out of stock`);
      return;
    }
    addToCart(product);
  };

  const handleNotifyMe = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault(); 
    e.stopPropagation();
    
    if (!user?.email) {
      toast.error('Please log in to get notifications');
      return;
    }

    try {
      await api.createStockNotification(product._id, user.email);
      toast.success(`We'll notify you when ${product.title} is back in stock!`);
    } catch (error: any) {
      toast.error(error.message || 'Failed to set up notification');
    }
  };

  // Check if product has discount
  const hasDiscount = product.discountPercentage && product.discountPercentage > 0;
  const isDiscountActive = product.discountStartDate && product.discountEndDate ? 
    new Date() >= new Date(product.discountStartDate) && new Date() <= new Date(product.discountEndDate) : 
    true;

  return (
    <div className={`group bg-white rounded-3xl shadow-sm transition-all duration-500 overflow-hidden border ${
      isOutOfStock 
        ? 'border-gray-200 opacity-75' 
        : 'border-gray-100 hover:border-gray-200 hover:shadow-xl'
    }`}>
      {/* Product Image Container */}
      <div className="relative overflow-hidden">
        <Link href={`/products/${product._id}`} className="block">
          <div className="relative aspect-square w-full">
            <Image 
              src={displayImage} 
              alt={product.title} 
              fill 
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw" 
              className="object-cover transition-transform duration-700 group-hover:scale-110" 
            />
            
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            {/* Discount Badge */}
            {hasDiscount && isDiscountActive && (
              <div className="absolute top-4 left-4">
                <span className="bg-red-500 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg backdrop-blur-sm">
                  {product.discountPercentage}% OFF
                </span>
              </div>
            )}
            
            {/* Featured Badge */}
            {product.isFeatured && !isOutOfStock && (
              <div className="absolute top-4 right-4">
                <span className="bg-yellow-400 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg backdrop-blur-sm">
                  Featured
                </span>
              </div>
            )}
            
            {/* Out of Stock Badge */}
            {isOutOfStock && (
              <div className="absolute top-4 right-4">
                <span className="bg-red-500 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg backdrop-blur-sm">
                  Out of Stock
                </span>
              </div>
            )}
          </div>
        </Link>
        
        {/* Desktop Add to Cart Overlay */}
        {!isOutOfStock && (
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-all duration-500 flex items-end justify-center pb-6 opacity-0 group-hover:opacity-100">
            <button 
              onClick={handleAddToCart} 
              className="hidden lg:flex items-center gap-2 bg-white/95 backdrop-blur-sm text-gray-800 font-semibold py-3 px-6 rounded-full shadow-xl hover:bg-white hover:shadow-2xl transition-all duration-300 transform hover:scale-105 border border-white/20" 
              aria-label={`Add ${product.title} to cart`}
            >
              <ShoppingBag size={16} />
              Add to Cart
            </button>
          </div>
        )}
      </div>
      
      {/* Product Info */}
      <div className="p-5 space-y-4">
        <Link href={`/products/${product._id}`}>
          <h3 className="text-base font-semibold text-gray-900 line-clamp-2 hover:text-accent transition-colors leading-tight group-hover:text-accent">
            {product.title}
          </h3>
        </Link>
        
        {/* Pricing */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {hasDiscount && isDiscountActive ? (
              <>
                <span className="text-xl font-bold text-gray-900">₹{product.price.toFixed(2)}</span>
                <span className="text-sm text-gray-500 line-through">₹{product.originalPrice?.toFixed(2)}</span>
              </>
            ) : (
              <span className="text-xl font-bold text-gray-900">₹{product.price.toFixed(2)}</span>
            )}
          </div>
        </div>
      </div>
      
      {/* Mobile Add to Cart Button */}
      <div className="px-5 pb-5 lg:hidden">
        {isOutOfStock ? (
          <button 
            onClick={handleNotifyMe} 
            className="w-full flex items-center justify-center gap-2 bg-blue-500 text-white font-semibold py-3 px-4 rounded-2xl hover:bg-blue-600 active:bg-blue-700 transition-all duration-300 transform active:scale-95 shadow-lg" 
            aria-label={`Notify me when ${product.title} is back in stock`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM4 19h6v-2H4v2zm0-4h6v-2H4v2zm0-4h6V9H4v2zm0-4h6V5H4v2z" />
            </svg>
            Notify Me
          </button>
        ) : (
          <button 
            onClick={handleAddToCart} 
            className="w-full flex items-center justify-center gap-2 bg-gray-900 text-white font-semibold py-3 px-4 rounded-2xl hover:bg-gray-800 active:bg-gray-700 transition-all duration-300 transform active:scale-95 shadow-lg" 
            aria-label={`Add ${product.title} to cart`}
          >
            <ShoppingBag size={16} />
            Add to Cart
          </button>
        )}
      </div>
    </div>
  );
}