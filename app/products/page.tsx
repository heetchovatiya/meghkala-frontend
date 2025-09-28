// app/products/page.tsx

import { getProducts, getCategories } from '@/lib/api';
import { ProductFilters } from '@/components/products/ProductFilters';
import { SearchBar } from '@/components/products/SearchBar';
import { Suspense } from 'react';
import { ProductList } from '@/components/products/ProductList';

interface ProductsPageProps {
  searchParams: { [key: string]: string | undefined };
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const { category, keyword, sort } = searchParams;
  
  // ✅ Initialize all data variables with safe, empty defaults.
  let products: any[] = [];
  let allCategories: any[] = [];
  let error: string | null = null;
  let pageTitle = "All Products";

  try {
    // Fetch data concurrently for performance.
    const [fetchedProducts, fetchedCategories] = await Promise.all([
      getProducts({ category, keyword, sort }),
      getCategories(true) // Only get parent categories
    ]);
    
    // ✅ DEFENSIVE ASSIGNMENT: Handle both array and object responses
    if (Array.isArray(fetchedProducts)) {
      products = fetchedProducts;
    } else if (fetchedProducts && Array.isArray(fetchedProducts.products)) {
      products = fetchedProducts.products;
    } else {
      products = [];
    }
    
    allCategories = Array.isArray(fetchedCategories) ? fetchedCategories : [];
    
    // ✅ DEFENSIVE LOGIC: Only try to find the category name if we successfully fetched categories.
    if (category && allCategories.length > 0) {
      const currentCategory = allCategories.find((cat) => cat._id === category);
      if (currentCategory) { 
        pageTitle = currentCategory.name;
      }
    }
    
    if (keyword) {
      pageTitle = `Searching for "${keyword}"`;
    }

  } catch (err: any) {
    console.error("CRITICAL ERROR fetching data for products page:", err);
    error = "We're having trouble loading the collection. Please try again in a moment.";
    // Ensure data is empty on error to prevent passing `undefined` to child components.
    products = [];
    allCategories = [];
  }

  return (
<<<<<<< HEAD
    <div className="min-h-[calc(100vh-5rem)] bg-white">
      <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Header Section */}
        <div className="text-center mb-12 sm:mb-16">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 mb-6">The Collection</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">Browse our curated selection of unique, handcrafted art pieces that bring beauty and joy to your everyday life.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* DESKTOP SIDEBAR */}
          <aside className="hidden lg:block lg:col-span-1">
            <div className="sticky top-8 space-y-6">
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <SearchBar />
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <ProductFilters categories={allCategories} />
              </div>
            </div>
          </aside>
=======
    <div className="container mx-auto px-4 sm:px-6 py-12">
      <div className="text-center mb-12 sm:mb-16">
        <h1 className="text-4xl md:text-5xl font-serif font-bold text-heading-color">The Collection</h1>
        <p className="mt-4 text-lg text-text-color max-w-2xl mx-auto">Browse our curated selection of unique, handcrafted art pieces.</p>
       {/* <div className="grid justify-center items-center"><SearchBar /></div> */}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-x-12 gap-y-12">
        {/* DESKTOP SIDEBAR */}
        <aside className="hidden lg:block lg:col-span-1">
          <div className="sticky top-28 space-y-10">
            
            {/* The safely-handled `allCategories` array is passed down. */}
            <ProductFilters categories={allCategories} />
          </div>
        </aside>
>>>>>>> a3483edccba147da04df8727df923cd6a9f35628

          {/* MAIN CONTENT */}
          {error ? (
            <main className="lg:col-span-3 text-center bg-red-50 text-red-700 p-8 rounded-2xl border border-red-200">
              <h3 className="font-bold text-lg mb-2">An Error Occurred</h3>
              <p>{error}</p>
            </main>
          ) : (
            <ProductList 
              products={products}
              categories={allCategories}
              pageTitle={pageTitle}
            />
          )}
        </div>
      </div>
    </div>
  );
}