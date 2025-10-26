// app/page.tsx

import { Button } from '@/components/common/Button';
import { ProductCard, Product } from '@/components/products/ProductCard';
import { HeroSection } from '@/components/common/HeroSection';
import { getFeaturedProducts, getCategories } from '@/lib/api';
import Link from 'next/link';
import { ArrowRight, Truck, Shield, Heart } from 'lucide-react';
import { Metadata } from 'next';
import { generateSEO, generateOrganizationStructuredData } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'Meghkala - Handcrafted Art & Home Decor | Premium Indian Handicrafts',
  description: 'Discover exquisite handcrafted art pieces, home decor, and traditional Indian handicrafts at Meghkala. Premium quality, authentic craftsmanship, and unique designs for your home.',
  keywords: [
    'handcrafted art',
    'Indian handicrafts',
    'home decor',
    'traditional art',
    'premium handicrafts',
    'art pieces',
    'decorative items',
    'handmade products',
    'Indian art',
    'cultural artifacts',
    'buy handicrafts online',
    'authentic Indian art',
    'premium home decor'
  ],
  openGraph: {
    title: 'Meghkala - Handcrafted Art & Home Decor | Premium Indian Handicrafts',
    description: 'Discover exquisite handcrafted art pieces, home decor, and traditional Indian handicrafts at Meghkala. Premium quality, authentic craftsmanship, and unique designs for your home.',
    images: ['/og-image.jpg'],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Meghkala - Handcrafted Art & Home Decor | Premium Indian Handicrafts',
    description: 'Discover exquisite handcrafted art pieces, home decor, and traditional Indian handicrafts at Meghkala. Premium quality, authentic craftsmanship, and unique designs for your home.',
    images: ['/og-image.jpg'],
  },
  alternates: {
    canonical: 'https://meghkala.com',
  },
};

// This is also a Server Component. We can fetch data here as well.
export default async function HomePage() {
  
  // Fetch featured products and categories
  const [featuredProducts, categories] = await Promise.all([
    getFeaturedProducts(4), // Reduced from 6 to 4 for better mobile UX
    getCategories(true) // Get only parent categories
  ]);

  // Generate structured data
  const organizationStructuredData = generateOrganizationStructuredData();
  const homepageStructuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Meghkala",
    "url": "https://meghkala.com",
    "description": "Premium handcrafted art pieces and home decor from authentic Indian artisans",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://meghkala.com/products?q={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  };

  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationStructuredData)
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(homepageStructuredData)
        }}
      />
      
      {/* Hero Section */}
      <HeroSection />

      {/* Collections Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-heading-color mb-4">
              Find the perfect piece by exploring our curated collections
            </h2>
            <p className="text-lg text-text-color max-w-2xl mx-auto">
              Discover our carefully curated collections, each telling a unique story of craftsmanship
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {categories.slice(0, 3).map((category: any) => (
              <Link
                key={category._id}
                href={`/products?category=${category._id}`}
                className="group relative overflow-hidden rounded-3xl aspect-[4/5] transition-all duration-500 shadow-xl hover:shadow-2xl hover:-translate-y-2"
              >
                {/* Full Background Image */}
                <div 
                  className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-700 group-hover:scale-105"
                  style={category.image ? { backgroundImage: `url(${category.image})` } : { backgroundImage: 'linear-gradient(135deg, #f5f5f5 0%, #e0e0e0 100%)' }}
                ></div>
                
                {/* Gradient Overlay for Better Text Readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent group-hover:from-black/70 group-hover:via-black/30 transition-all duration-500"></div>
                
                {/* Content */}
                <div className="absolute inset-0 flex items-end justify-center p-6 md:p-8">
                  <div className="text-center w-full px-4">
                    <h3 className="text-xl md:text-2xl lg:text-3xl font-serif font-bold text-white group-hover:scale-105 transition-transform duration-300 mb-3 drop-shadow-2xl leading-tight break-words">
                      {category.name}
                    </h3>
                    <div className="w-12 h-0.5 bg-white mx-auto group-hover:w-16 transition-all duration-300"></div>
                  </div>
                </div>
                
                {/* Hover Effect Overlay */}
                <div className="absolute inset-0 bg-white/0 group-hover:bg-white/5 transition-all duration-500"></div>
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
            <div className="text-center">
              <div className="mb-6">
                <div className="w-16 h-16 bg-terracotta-100 rounded-xl flex items-center justify-center mx-auto shadow-sm">
                  <Truck className="text-terracotta-600" size={28} />
                </div>
              </div>
              <h3 className="text-xl font-serif font-bold text-heading-color mb-3">Free Shipping</h3>
              <p className="text-text-color leading-relaxed text-sm">Free shipping on orders over Rs. 2,000. Fast, reliable delivery to your doorstep.</p>
            </div>
            
            {/* Secure Payment */}
            <div className="text-center">
              <div className="mb-6">
                <div className="w-16 h-16 bg-terracotta-100 rounded-xl flex items-center justify-center mx-auto shadow-sm">
                  <Shield className="text-terracotta-600" size={28} />
                </div>
              </div>
              <h3 className="text-xl font-serif font-bold text-heading-color mb-3">Secure Payment</h3>
              <p className="text-text-color leading-relaxed text-sm">Your payment information is protected with bank-level security and encryption.</p>
            </div>
            
            {/* Handcrafted */}
            <div className="text-center">
              <div className="mb-6">
                <div className="w-16 h-16 bg-terracotta-100 rounded-xl flex items-center justify-center mx-auto shadow-sm">
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