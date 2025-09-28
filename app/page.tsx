// app/page.tsx

import { Button } from '@/components/common/Button';
import { ProductCard, Product } from '@/components/products/ProductCard';
import { HeroSection } from '@/components/common/HeroSection';
import { getFeaturedProducts, getCategories } from '@/lib/api';
import Link from 'next/link';
import { ArrowRight, Truck, Shield, Heart } from 'lucide-react';

// This is also a Server Component. We can fetch data here as well.
export default async function HomePage() {
  
  // Fetch featured products and categories
  const [featuredProducts, categories] = await Promise.all([
    getFeaturedProducts(4), // Reduced from 6 to 4 for better mobile UX
    getCategories(true) // Get only parent categories
  ]);

  return (
    <>
      {/* Hero Section */}
      <HeroSection />

      {/* Categories Section */}
      <section className="py-20 bg-earth-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-heading-color mb-4">
              Shop by Category
            </h2>
            <p className="text-lg text-text-color max-w-2xl mx-auto">
              Discover our carefully curated collections, each telling a unique story of craftsmanship
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {categories.slice(0, 4).map((category: any) => (
              <Link
                key={category._id}
                href={`/products?category=${category._id}`}
                className="group relative overflow-hidden rounded-2xl aspect-square transition-all duration-500 shadow-lg hover:shadow-2xl hover:-translate-y-2"
                style={category.image ? { backgroundImage: `url(${category.image})` } : {}}
              >
                {/* Background Image or Fallback Gradient */}
                {category.image ? (
                  <div className="absolute inset-0 bg-cover bg-center bg-no-repeat"></div>
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-earth-100 to-earth-200 hover:from-terracotta-100 hover:to-terracotta-200"></div>
                )}
                
                {/* Dark Overlay for Text Readability */}
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-all duration-500"></div>
                
                {/* Content */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <h3 className="text-xl font-semibold text-white group-hover:scale-110 transition-transform duration-300 mb-2 drop-shadow-lg">
                      {category.name}
                    </h3>
                    <div className="w-8 h-0.5 bg-white mx-auto group-hover:w-12 transition-all duration-300"></div>
                  </div>
                </div>
                
                {/* Decorative Elements - only show on gradient backgrounds */}
                {!category.image && (
                  <>
                    <div className="absolute top-4 left-4 w-2 h-2 bg-terracotta-400 rounded-full opacity-60 group-hover:scale-150 transition-transform duration-300"></div>
                    <div className="absolute bottom-4 right-4 w-1.5 h-1.5 bg-sage-400 rounded-full opacity-60 group-hover:scale-150 transition-transform duration-300"></div>
                  </>
                )}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Section - Only show if there are featured products */}
      {featuredProducts.length > 0 && (
        <section className="py-16 md:py-20 bg-gray-50">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="text-center mb-12 md:mb-16">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-heading-color mb-4">
                Featured Products
              </h2>
              <p className="text-base sm:text-lg text-text-color max-w-2xl mx-auto">
                Handpicked pieces that showcase the finest in contemporary art and design
              </p>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
              {featuredProducts.map((product: Product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
            
            <div className="text-center mt-8 md:mt-12">
              <Button href="/products?featured=true" variant="outline" size="lg" className="inline-flex items-center justify-center gap-2 whitespace-nowrap">
                View All Products
                <ArrowRight size={20} />
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* Trust & Quality Section */}
      <section className="py-20 bg-earth-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-heading-color mb-6">
              Why Choose Meghkala
            </h2>
            <p className="text-lg text-text-color max-w-3xl mx-auto">
              We're committed to delivering exceptional quality, security, and craftsmanship in every interaction
            </p>
          </div>
          
          {/* Horizontal Three-Column Layout */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            {/* Free Shipping */}
            <div className="text-center group">
              <div className="mb-6">
                <div className="w-16 h-16 bg-terracotta-100 rounded-xl flex items-center justify-center mx-auto shadow-sm group-hover:shadow-lg transition-all duration-300 group-hover:-translate-y-1">
                  <Truck className="text-terracotta-600" size={28} />
                </div>
              </div>
              <h3 className="text-xl font-serif font-bold text-heading-color mb-3">Free Shipping</h3>
              <p className="text-text-color leading-relaxed text-sm">Free shipping on orders over Rs. 2,000. Fast, reliable delivery to your doorstep.</p>
            </div>
            
            {/* Secure Payment */}
            <div className="text-center group">
              <div className="mb-6">
                <div className="w-16 h-16 bg-terracotta-100 rounded-xl flex items-center justify-center mx-auto shadow-sm group-hover:shadow-lg transition-all duration-300 group-hover:-translate-y-1">
                  <Shield className="text-terracotta-600" size={28} />
                </div>
              </div>
              <h3 className="text-xl font-serif font-bold text-heading-color mb-3">Secure Payment</h3>
              <p className="text-text-color leading-relaxed text-sm">Your payment information is protected with bank-level security and encryption.</p>
            </div>
            
            {/* Handcrafted */}
            <div className="text-center group">
              <div className="mb-6">
                <div className="w-16 h-16 bg-terracotta-100 rounded-xl flex items-center justify-center mx-auto shadow-sm group-hover:shadow-lg transition-all duration-300 group-hover:-translate-y-1">
                  <Heart className="text-terracotta-600" size={28} />
                </div>
              </div>
              <h3 className="text-xl font-serif font-bold text-heading-color mb-3">Handcrafted</h3>
              <p className="text-text-color leading-relaxed text-sm">Each piece is carefully crafted by skilled artisans with love and attention to detail.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 bg-heading-color text-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-serif font-bold mb-4">Stay in the Loop</h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto">
            Get updates on new arrivals, exclusive offers, and behind-the-scenes content
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-md text-gray-900"
            />
            <Button size="lg" className="whitespace-nowrap">
              Subscribe
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}