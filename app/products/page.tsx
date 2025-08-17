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
      getCategories()
    ]);
    
    // ✅ DEFENSIVE ASSIGNMENT: Only assign the data if the API returned a valid array.
    // This prevents crashes if the API returns an error object instead of an array.
    products = Array.isArray(fetchedProducts) ? fetchedProducts : [];
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
    <div className="container mx-auto px-4 sm:px-6 py-12">
      <div className="text-center mb-12 sm:mb-16">
        <h1 className="text-4xl md:text-5xl font-serif font-bold text-heading-color">The Collection</h1>
        <p className="mt-4 text-lg text-text-color max-w-2xl mx-auto">Browse our curated selection of unique, handcrafted art pieces.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-x-12 gap-y-12">
        {/* DESKTOP SIDEBAR */}
        <aside className="hidden lg:block lg:col-span-1">
          <div className="sticky top-28 space-y-10">
            <SearchBar />
            {/* The safely-handled `allCategories` array is passed down. */}
            <ProductFilters categories={allCategories} />
          </div>
        </aside>

        {/* MAIN CONTENT */}
        {error ? (
          <main className="lg:col-span-3 text-center bg-red-100 text-red-700 p-6 rounded-lg">
            <h3 className="font-bold">An Error Occurred</h3>
            <p>{error}</p>
          </main>
        ) : (
          // The safely-handled data is passed to the interactive client component.
          <ProductList 
            products={products}
            categories={allCategories}
            pageTitle={pageTitle}
          />
        )}
      </div>
    </div>
  );
}