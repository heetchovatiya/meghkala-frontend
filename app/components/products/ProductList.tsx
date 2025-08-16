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
      {/* --- Unified Header --- */}
      <div className="flex justify-between items-center pb-4 mb-8 border-b border-secondary-bg">
        <div>
          <h2 className="text-2xl font-serif text-heading-color">{pageTitle}</h2>
          <span className="text-sm text-text-color">{products.length} Items Found</span>
        </div>
        {/* Desktop Sort */}
        <div className="hidden sm:block">
          <Suspense><SortDropdown /></Suspense>
        </div>
        {/* Mobile Filter Button */}
        <div className="lg:hidden">
          <button onClick={() => setIsFilterSheetOpen(true)} className="p-2 rounded-md border border-secondary-bg bg-primary-bg hover:bg-secondary-bg/60">
            {/* Your SlidersHorizontal icon can go here if you wish */}
            Filter & Sort
          </button>
        </div>
      </div>

      {/* --- Product Grid --- */}
      {products.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 sm:gap-x-8 gap-y-10 sm:gap-y-16">
          {products.filter(Boolean).map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center text-text-color py-16 border border-dashed border-secondary-bg rounded-lg">
          <p className="font-semibold text-lg text-heading-color">No products found.</p>
          <p className="text-sm mt-2">Try adjusting your filters or clearing your search.</p>
        </div>
      )}
      
      {/* --- The Mobile Sheet is now rendered here, controlled by this component's state --- */}
      <MobileFilterSheet 
        isOpen={isFilterSheetOpen}
        onClose={() => setIsFilterSheetOpen(false)}
        categories={categories}
      />
    </main>
  );
}