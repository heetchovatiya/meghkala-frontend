// components/products/MobileFilterSheetController.tsx
"use client";

import { useState } from 'react';
import { MobileFilterSheet } from './MobileFilterSheet';
import { SlidersHorizontal } from 'lucide-react';

export function MobileFilterSheetController() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <button 
                onClick={() => setIsOpen(true)}
                className="w-full flex items-center justify-center gap-2 bg-primary-bg text-heading-color font-semibold 
                           py-3 px-4 rounded-md shadow-sm border border-secondary-bg"
            >
                <SlidersHorizontal size={20} />
                Filter & Sort
            </button>
            <MobileFilterSheet isOpen={isOpen} onClose={() => setIsOpen(false)} />
        </>
    )
}