// components/products/ProductFilters.tsx
"use client";

import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { motion } from 'framer-motion';

interface Category {
  _id: string;
  name: string;
}

interface ProductFiltersProps {
  categories: Category[];
  onFilterChange?: () => void;
}

export function ProductFilters({ categories, onFilterChange }: ProductFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentCategory = searchParams.get('category');

  const handleFilterChange = (categoryId: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (categoryId) {
      params.set('category', categoryId);
    } else {
      params.delete('category');
    }
    // Use { scroll: false } for a smoother experience on desktop
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
    
    if (onFilterChange) {
      onFilterChange();
    }
  };

  // Create a combined list with "All" at the beginning
  const allFilterOptions = [{ _id: '', name: 'All Products' }, ...categories];

  return (
    <div>
      {/* <h3 className="text-xl font-serif text-heading-color mb-4">
        Categories
      </h3> */}
      
      {/* A clean, vertical list of filter options */}
      <ul className="space-y-1">
        {allFilterOptions.map(category => {
          const isActive = (!currentCategory && category._id === '') || currentCategory === category._id;

          return (
            <li key={category._id || 'all'}>
              <button
                onClick={() => handleFilterChange(category._id)}
                className={`relative w-full text-left px-4 py-2 rounded-md
                            transition-colors duration-200 ease-in-out
                            ${isActive 
                              ? 'text-heading-color' 
                              : 'text-text-color hover:bg-secondary-bg/60'
                            }`}
              >
                {/* The animated dot/pill background */}
                {isActive && (
                  <motion.div 
                    className="absolute left-0 top-0 bottom-0 w-1 bg-accent rounded-r-full" 
                    layoutId="active-category-indicator" // Shared layoutId for the animation
                    transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                  />
                )}
                {/* The text is bold when active */}
                <span className={`relative z-10 ${isActive ? 'font-bold' : 'font-normal'}`}>
                  {category.name}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}