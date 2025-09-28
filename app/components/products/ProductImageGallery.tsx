// components/products/ProductImageGallery.tsx
"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ProductImageGalleryProps {
  images: string[];
  title: string;
}

export function ProductImageGallery({ images, title }: ProductImageGalleryProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const goToImage = (index: number) => {
    setCurrentImageIndex(index);
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  // Touch handlers for mobile swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe && images.length > 1) {
      nextImage();
    }
    if (isRightSwipe && images.length > 1) {
      prevImage();
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (images.length <= 1) return;
      
      switch (event.key) {
        case 'ArrowLeft':
          event.preventDefault();
          prevImage();
          break;
        case 'ArrowRight':
          event.preventDefault();
          nextImage();
          break;
        case 'Escape':
          if (isFullscreen) {
            setIsFullscreen(false);
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [images.length, isFullscreen]);

  if (!images || images.length === 0) {
    return (
      <div className="space-y-4">
        <div className="relative aspect-[4/5] w-full bg-secondary-bg rounded-lg overflow-hidden shadow-md">
          <Image
            src="/placeholder-product.jpg"
            alt={title}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
            priority
          />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div 
        className="relative aspect-[4/5] w-full bg-secondary-bg rounded-lg overflow-hidden shadow-md group"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <Image
          src={images[currentImageIndex]}
          alt={`${title} ${currentImageIndex + 1}`}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          priority
        />
        
        {/* Navigation Arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-amber-100/90 hover:bg-amber-200 text-amber-800 p-2 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl opacity-0 group-hover:opacity-100 border border-amber-200"
              aria-label="Previous image"
            >
              <ChevronLeft size={20} />
            </button>
            
            <button
              onClick={nextImage}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-amber-100/90 hover:bg-amber-200 text-amber-800 p-2 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl opacity-0 group-hover:opacity-100 border border-amber-200"
              aria-label="Next image"
            >
              <ChevronRight size={20} />
            </button>
          </>
        )}

        {/* Image Counter */}
        {images.length > 1 && (
          <div className="absolute bottom-4 right-4 bg-amber-100/90 text-amber-800 px-3 py-1 rounded-full text-sm font-medium border border-amber-200">
            {currentImageIndex + 1} / {images.length}
          </div>
        )}

      </div>
      
      {/* Thumbnail Images */}
      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-2">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => goToImage(index)}
              className={`relative aspect-square bg-secondary-bg rounded-lg overflow-hidden transition-all duration-300 ${
                index === currentImageIndex
                  ? 'ring-2 ring-accent scale-105 shadow-lg'
                  : 'hover:scale-105 hover:shadow-md'
              }`}
              aria-label={`View image ${index + 1}`}
            >
              <Image
                src={image}
                alt={`${title} thumbnail ${index + 1}`}
                fill
                className="object-cover"
              />
              {index === currentImageIndex && (
                <div className="absolute inset-0 bg-accent/20"></div>
              )}
            </button>
          ))}
        </div>
      )}

      {/* Fullscreen Modal */}
      {isFullscreen && (
        <div 
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div className="relative max-w-4xl max-h-full">
            <button
              onClick={toggleFullscreen}
              className="absolute top-4 right-4 bg-amber-100/90 hover:bg-amber-200 text-amber-800 p-2 rounded-full transition-colors z-10 border border-amber-200"
              aria-label="Close fullscreen"
            >
              <ChevronRight size={24} className="rotate-45" />
            </button>
            
            <div className="relative aspect-[4/5] w-full max-w-2xl mx-auto">
              <Image
                src={images[currentImageIndex]}
                alt={`${title} fullscreen ${currentImageIndex + 1}`}
                fill
                className="object-contain"
                priority
              />
            </div>
            
            {/* Fullscreen Navigation */}
            {images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-amber-100/90 hover:bg-amber-200 text-amber-800 p-3 rounded-full transition-colors border border-amber-200"
                  aria-label="Previous image"
                >
                  <ChevronLeft size={24} />
                </button>
                
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-amber-100/90 hover:bg-amber-200 text-amber-800 p-3 rounded-full transition-colors border border-amber-200"
                  aria-label="Next image"
                >
                  <ChevronRight size={24} />
                </button>
                
                {/* Fullscreen Image Counter */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-amber-100/90 text-amber-800 px-4 py-2 rounded-full text-sm font-medium border border-amber-200">
                  {currentImageIndex + 1} / {images.length}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
