// components/products/ProductList.tsx
"use client";

import { useState, Suspense } from 'react';
import { ProductCard } from './ProductCard';
import { SortDropdown } from './SortDropdown';
import { MobileFilterSheet } from './MobileFilterSheet'; // The sheet itself

// Define the shapes of the data this component will receive
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
    availability: string;
    description?: string;
    category?: { _id: string; name: string };
}
interface Category { _id: string; name: string; }

interface ProductListProps {
  products: Product[];
  categories: Category[];
  pageTitle: string;
}

export function ProductList({ products, categories, pageTitle }: ProductListProps) {
  // ✅ State for the mobile filter sheet is now managed here
  const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false);

  return (
    <main className="col-span-1 lg:col-span-3">
      {/* --- Header Section --- */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">{pageTitle}</h1>
            <p className="text-sm text-gray-600">{products.length} {products.length === 1 ? 'item' : 'items'} found</p>
          </div>
          
          {/* Desktop Sort */}
          <div className="hidden sm:block">
            <Suspense><SortDropdown /></Suspense>
          </div>
          
          {/* Mobile Filter Button */}
          <div className="sm:hidden">
            <button 
              onClick={() => setIsFilterSheetOpen(true)} 
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-sage-100 text-sage-800 rounded-xl font-medium hover:bg-sage-200 transition-colors border border-sage-200"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z" />
              </svg>
              Filter & Sort
            </button>
          </div>
        </div>
      </div>

      {/* --- Product Grid --- */}
      {products.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6 lg:gap-8">
          {products.filter(Boolean).map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No products found</h3>
          <p className="text-gray-600 mb-6">Try adjusting your filters or search terms</p>
          <button 
            onClick={() => window.location.href = '/products'}
            className="px-6 py-3 bg-amber-100 text-amber-800 rounded-xl font-medium hover:bg-amber-200 transition-colors border border-amber-200"
          >
            View All Products
          </button>
        </div>
      )}
      
      {/* --- Mobile Filter Sheet --- */}
      <MobileFilterSheet 
        isOpen={isFilterSheetOpen}
        onClose={() => setIsFilterSheetOpen(false)}
        categories={categories}
      />
    </main>
  );
}