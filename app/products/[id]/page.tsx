// app/products/[id]/page.tsx

import { getProductById } from '@/lib/api';
import { AddToCartButton } from '@/components/products/AddToCartButton';
import { ProductReviews } from '@/components/products/ProductReviews';
import { ProductImageGallery } from '@/components/products/ProductImageGallery';
import { Product } from '@/components/products/ProductCard'; // Import our updated Product type
import { NotifyMeButton } from '@/components/products/NotifyMeButton';
import Link from 'next/link';
import { ArrowLeft, Star, Truck, Shield, RotateCcw } from 'lucide-react';

interface PageProps {
  params: { id: string };
}

export default async function ProductDetailPage({ params }: PageProps) {
  try {
    const product: any = await getProductById(params.id);

    return (
      <div className="container mx-auto px-4 sm:px-6 py-8 md:py-16">
        <div className="mb-8">
          <Link href="/products" className="inline-flex items-center gap-2 text-text-color hover:text-heading-color transition-colors">
            <ArrowLeft size={18} />
            <span>Back to Collection</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12 items-start">
          {/* Image Gallery */}
          <ProductImageGallery 
            images={product.images || []} 
            title={product.title} 
          />

          {/* Product Info */}
          <div className="lg:sticky lg:top-28">
            {/* Breadcrumbs */}
            <div className="text-sm text-gray-500 mb-4">
              <Link href="/" className="hover:text-gray-700">HOME</Link>
              <span className="mx-2">/</span>
              <Link href="/products" className="hover:text-gray-700">ALL PRODUCTS</Link>
              {product.category && (
                <>
                  <span className="mx-2">/</span>
                  <span className="text-gray-500 hover:text-gray-700">{product.category.name.toUpperCase()}</span>
                </>
              )}
            </div>

            {/* Artist Name */}
            {product.artist && (
              <p className="text-sm text-gray-600 mb-2">{product.artist}</p>
            )}

            {/* Product Title */}
            <h1 className="text-3xl lg:text-5xl font-serif font-bold text-heading-color mb-4">
              {product.title}
            </h1>

            {/* Price */}
            <div className="mb-6">
              {product.originalPrice && product.originalPrice > product.price ? (
                <div className="flex items-center gap-4">
                  <span className="text-2xl lg:text-3xl font-sans text-accent font-bold">
                    ₹{product.price.toLocaleString()}
                  </span>
                  <span className="text-lg text-gray-500 line-through">
                    ₹{product.originalPrice.toLocaleString()}
                  </span>
                  {product.discountPercentage && (
                    <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-sm font-semibold">
                      {product.discountPercentage}% OFF
                    </span>
                  )}
                </div>
              ) : (
                <p className="text-2xl lg:text-3xl font-sans text-accent font-bold">
                  ₹{product.price.toLocaleString()}
                </p>
              )}
            </div>

            {/* Rating */}
            {/* FIX: Changed condition to prevent rendering '0' for products with no reviews */}
            {product.totalReviews > 0 && (
              <div className="flex items-center space-x-2 mb-6">
                <div className="flex items-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      size={20}
                      className={`${
                        star <= Math.round(product.averageRating)
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-600">
                  {product.averageRating.toFixed(1)} ({product.totalReviews} reviews)
                </span>
              </div>
            )}

            {/* Shipping Info */}
            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <div className="space-y-2">
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Free shipping:</span> On orders above ₹699
                </p>
                <p className="text-xs text-gray-500 mt-2">
                  Delivery within 3-5 business days
                </p>
              </div>
            </div>

            {/* Add to Cart or Notify Me */}
            <div className="mb-8">
              {product.quantity > 0 ? (
                <>
                  <AddToCartButton product={product} />
                  <p className="text-center text-sm text-text-color mt-4">
                    Availability: <span className="font-semibold text-green-600">In Stock</span>
                  </p>
                </>
              ) : (
                <div className="text-center">
                  <div className="bg-gray-100 p-6 rounded-lg mb-4">
                    <p className="text-gray-600 mb-4">This product is currently out of stock</p>
                    <NotifyMeButton product={product} />
                  </div>
                  <p className="text-center text-sm text-text-color">
                    Availability: <span className="font-semibold text-red-600">Out of Stock</span>
                  </p>
                </div>
              )}
            </div>

            {/* Product Details */}
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-heading-color mb-3">Description</h3>
                <p className="text-text-color leading-relaxed">{product.description}</p>
              </div>

              {/* Product Specifications */}
              <div>
                <h3 className="text-lg font-semibold text-heading-color mb-3">Product Specifications</h3>
                <div className="space-y-2">
                  {product.weight && (
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Weight</span>
                      <span className="text-sm text-gray-900">{product.weight}g</span>
                    </div>
                  )}
                  {product.dimensions && (
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Dimensions</span>
                      <span className="text-sm text-gray-900">
                        {product.dimensions.length} × {product.dimensions.width} × {product.dimensions.height} cm
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Features */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Truck size={16} />
                  <span>Free shipping over ₹699</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Shield size={16} />
                  <span>Secure payment</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <RotateCcw size={16} />
                  <span>30-day returns</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <ProductReviews
          productId={product._id}
          averageRating={product.averageRating || 0}
          totalReviews={product.totalReviews || 0}
        />
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