// app/page.tsx

import { Button } from '@/components/common/Button';
import { ProductCard, Product } from '@/components/products/ProductCard';
import { getProducts } from '@/lib/api'; // ✅ IMPORT our API function

// This is also a Server Component. We can fetch data here as well.
export default async function HomePage() {
  
  // ✅ FETCH LIVE DATA: Call the API to get a few products for the homepage.
  // We can add a 'limit' parameter to our API later for optimization.
  const allProducts: Product[] = await getProducts();
  const featuredProducts = allProducts.slice(0, 3); // For now, just take the first 3 products.

  return (
    <>
      {/* Hero Section (No changes needed here) */}
      <section className="h-[calc(100vh-5rem)] flex flex-col justify-center items-center text-center px-6">
        <div className="container mx-auto">
          <h1 className="text-5xl md:text-7xl font-serif font-bold text-heading-color leading-tight mb-4">
            Art That Speaks
          </h1>
          <p className="text-lg md:text-xl text-text-color max-w-2xl mx-auto mb-8">
            Discover unique, handcrafted pieces that transform spaces and inspire conversations. Curated for the modern connoisseur.
          </p>
          <Button href="/products" size="lg">
            Explore The Collection
          </Button>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-20 md:py-28 bg-primary-bg">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-heading-color text-center mb-16">
            Featured Creations
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
            {/* ✅ MAP OVER LIVE DATA instead of static data */}
            {featuredProducts.map(product => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}