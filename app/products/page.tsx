// app/products/page.tsx

import { ProductCard, Product } from '@/components/products/ProductCard';
import { getProducts, getCategories } from '@/lib/api';
import { ProductFilters } from '@/components/products/ProductFilters';
import { SearchBar } from '@/components/products/SearchBar';
import { SortDropdown } from '@/components/products/SortDropdown';
import { Suspense } from 'react';
// ✅ Import the controller for our mobile slide-out panel
import { MobileFilterSheetController } from '@/components/products/MobileFilterSheetController';

function FiltersSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="h-12 bg-secondary-bg rounded-md w-full"></div>
    </div>
  );
}

interface ProductsPageProps {
  searchParams: { [key: string]: string | undefined };
}
export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  // ... (Data fetching logic remains the same) ...
  const { category, keyword, sort } = searchParams;
  let products: Product[] = [];
  let error: string | null = null;
  let pageTitle = "All Products";

  try {
    const [fetchedProducts, allCategories] = await Promise.all([
      getProducts({ category, keyword, sort }),
      getCategories()
    ]);
    products = fetchedProducts;
    if (category) {
      const currentCategory = allCategories.find((cat: any) => cat._id === category);
      if (currentCategory) { pageTitle = currentCategory.name; }
    }
    if (keyword) {
      pageTitle = `Searching for "${keyword}"`;
    }
  } catch (err: any) {
    console.error("Error fetching data for products page:", err);
    error = "Could not load products at this time. Please try again later.";
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 py-12">
      <div className="text-center mb-12 sm:mb-16">
        <h1 className="text-4xl md:text-5xl font-serif font-bold text-heading-color">
          The Collection
        </h1>
        <p className="mt-4 text-lg text-text-color max-w-2xl mx-auto">
          Browse our curated selection of unique, handcrafted art pieces.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-x-8 gap-y-12">
        
        {/* --- DESKTOP SIDEBAR --- */}
        {/* ✅ This is now completely hidden on mobile (`hidden lg:block`) */}
        <aside className="hidden lg:block lg:col-span-1">
          <div className="sticky top-28 space-y-8">
            <SearchBar />
            <div className="p-6 bg-secondary-bg/60 rounded-lg shadow-sm">
              <ProductFilters />
            </div>
          </div>
        </aside>

        {/* --- MAIN CONTENT & PRODUCT GRID --- */}
        <main className="col-span-1 lg:col-span-3">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
            <div>
              <h2 className="text-2xl font-serif text-heading-color">{pageTitle}</h2>
              <span className="text-sm text-text-color">{products.length} Items</span>
            </div>
            
            {/* ✅ Desktop Sort Dropdown - Hidden on mobile */}
            <div className="hidden sm:block">
              <Suspense>
                <SortDropdown />
              </Suspense>
            </div>
          </div>

          
          
          {/* ... (Product Grid, Error, and Empty State JSX) ... */}
          {error ? (
            <div className="..."> {/* Error message */} </div>
          ) : products && products.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-2 xl:grid-cols-3 gap-x-4 sm:gap-x-6 gap-y-10 sm:gap-y-12">
              {products.filter(Boolean).map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          ) : (
            <div className="..."> {/* Empty state message */} </div>
          )}
        </main>
      </div>
    </div>
  );
}