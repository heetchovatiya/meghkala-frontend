// components/products/ProductFilters.tsx
"use client";

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronDown, X } from 'lucide-react';
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
  const currentCategories = searchParams.get('categories')?.split(',').filter(Boolean) || [];
  const currentSubcategories = searchParams.get('subcategories')?.split(',').filter(Boolean) || [];
  
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const [subcategories, setSubcategories] = useState<Record<string, Category[]>>({});

  const handleCategoryToggle = (categoryId: string) => {
    const params = new URLSearchParams(searchParams.toString());
    let newCategories = [...currentCategories];
    
    if (newCategories.includes(categoryId)) {
      // Remove category
      newCategories = newCategories.filter(id => id !== categoryId);
    } else {
      // Add category
      newCategories.push(categoryId);
    }
    
    if (newCategories.length > 0) {
      params.set('categories', newCategories.join(','));
    } else {
      params.delete('categories');
    }
    
    // Clear subcategories when changing categories
    params.delete('subcategories');
    
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
    
    if (onFilterChange) {
      onFilterChange();
    }
  };

  const handleSubcategoryToggle = (subcategoryId: string) => {
    const params = new URLSearchParams(searchParams.toString());
    let newSubcategories = [...currentSubcategories];
    
    if (newSubcategories.includes(subcategoryId)) {
      // Remove subcategory
      newSubcategories = newSubcategories.filter(id => id !== subcategoryId);
    } else {
      // Add subcategory
      newSubcategories.push(subcategoryId);
    }
    
    if (newSubcategories.length > 0) {
      params.set('subcategories', newSubcategories.join(','));
    } else {
      params.delete('subcategories');
    }
    
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
    
    if (onFilterChange) {
      onFilterChange();
    }
  };

  const handleClearAll = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete('categories');
    params.delete('subcategories');
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

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-heading-color">
          Categories
        </h3>
        {(currentCategories.length > 0 || currentSubcategories.length > 0) && (
          <button
            onClick={handleClearAll}
            className="text-sm text-accent hover:text-accent-hover font-medium"
          >
            Clear All
          </button>
        )}
      </div>
      
      {/* Categories with checkboxes */}
      <div className="space-y-2">
        {categories.map(category => {
          const isSelected = currentCategories.includes(category._id);
          const hasSubcategories = subcategories[category._id]?.length > 0;
          const isExpanded = expandedCategories.has(category._id);

          return (
            <div key={category._id} className="space-y-1">
              {/* Main Category */}
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id={`category-${category._id}`}
                  checked={isSelected}
                  onChange={() => handleCategoryToggle(category._id)}
                  className="w-4 h-4 text-accent bg-gray-100 border-gray-300 rounded focus:ring-accent focus:ring-2"
                />
                <label
                  htmlFor={`category-${category._id}`}
                  className="flex-1 text-sm font-medium text-gray-900 cursor-pointer hover:text-accent transition-colors"
                >
                  {category.name}
                </label>
                {hasSubcategories && (
                  <button
                    onClick={() => toggleCategory(category._id)}
                    className="p-1 hover:bg-gray-100 rounded transition-colors"
                  >
                    {isExpanded ? (
                      <ChevronDown size={16} className="text-gray-500" />
                    ) : (
                      <ChevronRight size={16} className="text-gray-500" />
                    )}
                  </button>
                )}
              </div>

              {/* Subcategories */}
              <AnimatePresence>
                {isExpanded && hasSubcategories && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="ml-7 space-y-1"
                  >
                    {subcategories[category._id]?.map(subcategory => {
                      const isSubSelected = currentSubcategories.includes(subcategory._id);
                      return (
                        <div key={subcategory._id} className="flex items-center space-x-3">
                          <input
                            type="checkbox"
                            id={`subcategory-${subcategory._id}`}
                            checked={isSubSelected}
                            onChange={() => handleSubcategoryToggle(subcategory._id)}
                            className="w-4 h-4 text-accent bg-gray-100 border-gray-300 rounded focus:ring-accent focus:ring-2"
                          />
                          <label
                            htmlFor={`subcategory-${subcategory._id}`}
                            className="flex-1 text-sm text-gray-700 cursor-pointer hover:text-accent transition-colors"
                          >
                            {subcategory.name}
                          </label>
                        </div>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      {/* Selected Categories Summary */}
      {(currentCategories.length > 0 || currentSubcategories.length > 0) && (
        <div className="mt-4 p-3 bg-accent/10 rounded-lg">
          <p className="text-sm font-medium text-accent mb-2">Selected Filters:</p>
          <div className="flex flex-wrap gap-2">
            {currentCategories.map(categoryId => {
              const category = categories.find(c => c._id === categoryId);
              return (
                <span
                  key={categoryId}
                  className="inline-flex items-center gap-1 px-2 py-1 bg-accent text-white text-xs rounded-full"
                >
                  {category?.name}
                  <button
                    onClick={() => handleCategoryToggle(categoryId)}
                    className="hover:bg-accent-hover rounded-full p-0.5"
                  >
                    <X size={12} />
                  </button>
                </span>
              );
            })}
            {currentSubcategories.map(subcategoryId => {
              const subcategory = Object.values(subcategories)
                .flat()
                .find(s => s._id === subcategoryId);
              return (
                <span
                  key={subcategoryId}
                  className="inline-flex items-center gap-1 px-2 py-1 bg-accent/80 text-white text-xs rounded-full"
                >
                  {subcategory?.name}
                  <button
                    onClick={() => handleSubcategoryToggle(subcategoryId)}
                    className="hover:bg-accent-hover rounded-full p-0.5"
                  >
                    <X size={12} />
                  </button>
                </span>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}