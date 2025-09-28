// components/products/ProductFilters.tsx
"use client";

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronDown } from 'lucide-react';
import { getSubcategories } from '@/lib/api';

interface Category {
  _id: string;
  name: string;
  parentCategory?: string;
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
  const currentSubcategory = searchParams.get('subcategory');
  
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const [subcategories, setSubcategories] = useState<Record<string, Category[]>>({});

  const handleFilterChange = (categoryId: string, subcategoryId?: string) => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (categoryId) {
      params.set('category', categoryId);
    } else {
      params.delete('category');
    }
    
    if (subcategoryId) {
      params.set('subcategory', subcategoryId);
    } else {
      params.delete('subcategory');
    }
    
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
    
    if (onFilterChange) {
      onFilterChange();
    }
  };

  const toggleCategory = async (categoryId: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
      
      // Load subcategories if not already loaded
      if (!subcategories[categoryId]) {
        try {
          const subs = await getSubcategories(categoryId);
          setSubcategories(prev => ({ ...prev, [categoryId]: subs }));
        } catch (error) {
          console.error('Failed to load subcategories:', error);
        }
      }
    }
    setExpandedCategories(newExpanded);
  };

  // Create a combined list with "All" at the beginning
  const allFilterOptions = [{ _id: '', name: 'All Products' }, ...categories];

  return (
    <div>
      <h3 className="text-xl font-serif text-heading-color mb-6">
        Categories
      </h3>
      
      {/* A clean, vertical list of filter options */}
      <ul className="space-y-1">
        {allFilterOptions.map(category => {
          const isActive = (!currentCategory && category._id === '') || currentCategory === category._id;
          const hasSubcategories = category._id && subcategories[category._id]?.length > 0;
          const isExpanded = expandedCategories.has(category._id);

          return (
            <li key={category._id || 'all'}>
              <div>
                <button
                  onClick={() => category._id ? toggleCategory(category._id) : handleFilterChange('')}
                  className={`relative w-full text-left px-4 py-2 rounded-md
                              transition-colors duration-200 ease-in-out
                              flex items-center justify-between
                              ${isActive 
                                ? 'text-heading-color' 
                                : 'text-text-color hover:bg-secondary-bg/60'
                              }`}
                >
                  <div className="flex items-center">
                    {/* The animated dot/pill background */}
                    {isActive && (
                      <motion.div 
                        className="absolute left-0 top-0 bottom-0 w-1 bg-accent rounded-r-full" 
                        layoutId="active-category-indicator"
                        transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                      />
                    )}
                    {/* The text is bold when active */}
                    <span className={`relative z-10 ${isActive ? 'font-bold' : 'font-normal'}`}>
                      {category.name}
                    </span>
                  </div>
                  
                  {hasSubcategories && (
                    <div className="ml-2">
                      {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                    </div>
                  )}
                </button>

                {/* Subcategories */}
                <AnimatePresence>
                  {isExpanded && hasSubcategories && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <ul className="ml-4 mt-1 space-y-1">
                        {subcategories[category._id]?.map(subcategory => {
                          const isSubActive = currentSubcategory === subcategory._id;
                          return (
                            <li key={subcategory._id}>
                              <button
                                onClick={() => handleFilterChange(category._id, subcategory._id)}
                                className={`w-full text-left px-4 py-2 rounded-md text-sm
                                            transition-colors duration-200 ease-in-out
                                            ${isSubActive 
                                              ? 'text-heading-color font-medium' 
                                              : 'text-text-color hover:bg-secondary-bg/60'
                                            }`}
                              >
                                {subcategory.name}
                              </button>
                            </li>
                          );
                        })}
                      </ul>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}