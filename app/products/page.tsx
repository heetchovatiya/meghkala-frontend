// app/products/page.tsx

import { getProducts, getCategories } from '@/lib/api';
import { ProductFilters } from '@/components/products/ProductFilters';
import { SearchBar } from '@/components/products/SearchBar';
import { Suspense } from 'react';
import { ProductList } from '@/components/products/ProductList'; // ✅ Import the new component

interface ProductsPageProps {
  searchParams: { [key: string]: string | undefined };
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const { category, keyword, sort } = searchParams;
  let products: any[] = [], allCategories: any[] = [], error: string | null = null, pageTitle = "All Products";

  try {
    const [fetchedProducts, fetchedCategories] = await Promise.all([
      getProducts({ category, keyword, sort }),
      getCategories()
    ]);
    products = fetchedProducts;
    allCategories = fetchedCategories;
    
    if (category) {
      const currentCategory = allCategories.find((cat) => cat._id === category);
      if (currentCategory) { pageTitle = currentCategory.name; }
    }
    if (keyword) {
      pageTitle = `Searching for "${keyword}"`;
    }
  } catch (err: any) {
    console.error("Error fetching data:", err);
    error = "Could not load products at this time.";
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 py-12">
      <div className="text-center mb-12 sm:mb-16">
        <h1 className="text-4xl md:text-5xl font-serif font-bold text-heading-color">The Collection</h1>
        <p className="mt-4 text-lg text-text-color max-w-2xl mx-auto">Browse our curated selection of unique, handcrafted art pieces.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-x-12 gap-y-12">
        {/* DESKTOP SIDEBAR (no changes needed) */}
        <aside className="hidden lg:block lg:col-span-1">
          <div className="sticky top-28 space-y-10">
            <SearchBar />
            <ProductFilters categories={allCategories} />
          </div>
        </aside>

        {/* ✅ MAIN CONTENT is now handled by our new Client Component */}
        {error ? (
          <main className="lg:col-span-3 text-center bg-red-100 text-red-700 p-6 rounded-lg">
            <h3 className="font-bold">An Error Occurred</h3>
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
  );
}