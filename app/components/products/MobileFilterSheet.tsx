// components/products/MobileFilterSheet.tsx
"use client";

import { SearchBar } from './SearchBar';
import { ProductFilters } from './ProductFilters';
import { SortDropdown } from './SortDropdown';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';

interface MobileFilterSheetProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileFilterSheet({ isOpen, onClose }: MobileFilterSheetProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleClearFilters = () => {
    // Navigate to the base products page, clearing all filters
    router.push(pathname);
    onClose(); // Close the sheet after clearing
  };
  
  // Animation for the modal sliding up from the bottom
  const modalVariants = {
    hidden: { y: "100%", opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.3, ease: "easeOut" } },
    exit: { y: "100%", opacity: 0, transition: { duration: 0.2, ease: "easeIn" } },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 z-40 lg:hidden"
          />
          {/* Full-Screen Modal */}
          <motion.div
            variants={modalVariants} initial="hidden" animate="visible" exit="exit"
            className="fixed inset-0 z-50 lg:hidden flex flex-col"
          >
            <div className="flex-grow"></div> {/* This pushes the content to the bottom */}
            <div className="bg-primary-bg rounded-t-2xl shadow-2xl flex flex-col">
              {/* Header with Drag Handle and Close Button */}
              <div className="flex items-center justify-center p-4 relative">
                  <div className="w-8 h-1 bg-secondary-bg rounded-full"></div>
                  <button onClick={onClose} className="absolute top-4 right-4 text-text-color"><X size={24} /></button>
              </div>

              {/* Filter & Sort Content */}
              <div className="p-6 pt-2 space-y-8 overflow-y-auto max-h-[60vh]">
                <div className="space-y-2">
                    <h3 className="text-lg font-semibold text-heading-color">Search</h3>
                    <SearchBar />
                </div>
                <div className="space-y-2">
                    <h3 className="text-lg font-semibold text-heading-color">Category</h3>
                    <ProductFilters />
                </div>
                <div className="space-y-2">
                    <h3 className="text-lg font-semibold text-heading-color">Sort by</h3>
                    <SortDropdown />
                </div>
              </div>
              
              {/* Action Buttons Footer */}
              <div className="p-4 grid grid-cols-2 gap-4 border-t border-secondary-bg">
                <button 
                  onClick={handleClearFilters}
                  className="w-full bg-primary-bg text-heading-color font-semibold py-3 px-4 rounded-md shadow-sm border border-secondary-bg"
                >
                  Clear All
                </button>
                <button 
                  onClick={onClose}
                  className="w-full bg-accent text-white font-semibold py-3 px-4 rounded-md shadow-sm hover:bg-accent-hover"
                >
                  Show Results
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}