// app/products/[id]/page.tsx

import { getProductById } from '@/lib/api';
import Image from 'next/image';
import { AddToCartButton } from '@/components/products/AddToCartButton';
import { Product } from '@/components/products/ProductCard'; // Import our updated Product type
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

interface PageProps {
  params: { id: string };
}

export default async function ProductDetailPage({ params }: PageProps) {
  try {
    const product: Product = await getProductById(params.id);
    const displayImage = product.images?.[0] || '/placeholder-product.jpg';

    return (
      // ✅ Added more vertical padding for mobile
      <div className="container mx-auto px-4 sm:px-6 py-8 md:py-16">
        <div className="mb-8">
          <Link href="/products" className="inline-flex items-center gap-2 text-text-color hover:text-heading-color ...">
            <ArrowLeft size={18} />
            <span>Back to Collection</span>
          </Link>
        </div>

        {/* ✅ Adjusted grid gap for better spacing */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-start">
          {/* Image Gallery */}
          <div className="relative aspect-[4/5] w-full bg-secondary-bg rounded-lg overflow-hidden shadow-md">
            <Image
              src={displayImage}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
              priority
            />
          </div>

          {/* Product Info */}
          {/* ✅ Removed sticky positioning on mobile to prevent layout issues */}
          <div className="md:sticky md:top-28">
            {/* ✅ Adjusted text sizes for better mobile hierarchy */}
            <h1 className="text-3xl lg:text-5xl font-serif font-bold text-heading-color">{product.name}</h1>
            <p className="text-2xl lg:text-3xl font-sans text-text-color mt-3">₹{product.price.toFixed(2)}</p>
            
            <div className="mt-6 border-t border-secondary-bg pt-6">
              <h2 className="text-xl font-serif text-heading-color font-semibold mb-3">Description</h2>
              <p className="text-text-color leading-relaxed">{product.description}</p>
            </div>
            
            <div className="mt-8">
              <AddToCartButton product={product} />
              <p className="text-center text-sm text-text-color mt-4">
                Availability: <span className="font-semibold">{product.availability.replace('_', ' ')}</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error("Failed to fetch product details:", error);
    // Render a user-friendly error state if the product is not found
    return (
      <div className="text-center py-20">
        <h1 className="text-3xl font-serif text-heading-color">Product Not Found</h1>
        <p className="text-text-color mt-2">We couldn't find the item you're looking for.</p>
        <div className="mt-8">
            <Link href="/products" className="bg-accent text-white font-semibold py-3 px-6 rounded-md">
                Explore The Collection
            </Link>
        </div>
      </div>
    );
  }
}