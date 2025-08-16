// components/products/ProductCard.tsx
"use client";

import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/hooks/useCart';
import toast from 'react-hot-toast';
import { ShoppingBag } from 'lucide-react';

export interface Product {
    _id: string;
    name: string;
    price: number;
    images: string[];
    quantity: number;
    availability: string;
    description?: string;
    category?: { _id: string; name: string };
}

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  if (!product) { return null; }

  const { addToCart } = useCart();
  const displayImage = product.images?.[0] || '/placeholder-product.jpg';

  const handleAddToCart = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault(); 
    e.stopPropagation();
    addToCart(product);
    toast.success(`${product.name} added to cart!`);
  };

  return (
    <div>
      <div className="group relative overflow-hidden rounded-lg shadow-sm bg-secondary-bg/50 transition-shadow duration-300 hover:shadow-lg">
        <Link href={`/products/${product._id}`} className="block">
            <div className="relative aspect-[4/5] w-full">
              <Image src={displayImage} alt={product.name} fill sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw" className="object-cover transition-transform duration-500 group-hover:scale-105" />
            </div>
        </Link>
        <div className="absolute bottom-0 left-0 w-full p-2 transform translate-y-full lg:group-hover:translate-y-0 transition-transform duration-300 ease-in-out">
            <button onClick={handleAddToCart} className="w-full hidden lg:flex items-center justify-center gap-2 bg-primary-bg/80 backdrop-blur-sm text-heading-color font-semibold py-2 px-4 rounded-md shadow-md hover:bg-accent hover:text-white transition-colors" aria-label={`Add ${product.name} to cart`}>
                <ShoppingBag size={18} />
                Add to Cart
            </button>
        </div>
      </div>
      <div className="mt-3 text-left">
        <Link href={`/products/${product._id}`}>
            <h3 className="text-md font-medium text-heading-color truncate hover:text-accent transition-colors">{product.name}</h3>
        </Link>
        <p className="mt-1 text-md font-semibold text-text-color">₹{product.price.toFixed(2)}</p>
      </div>
      <div className="mt-4 lg:hidden">
        <button onClick={handleAddToCart} className="w-full flex items-center justify-center gap-2 bg-primary-bg text-heading-color font-semibold py-2 px-4 rounded-md shadow-sm border border-secondary-bg active:bg-accent active:text-white active:border-accent transition-all duration-300 ease-in-out" aria-label={`Add ${product.name} to cart`}>
            <ShoppingBag size={18} />
            Add to Cart
        </button>
      </div>
    </div>
  );
}