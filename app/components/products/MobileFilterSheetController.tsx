// components/products/MobileFilterSheetController.tsx
"use client";

// ❌ No more useState
import { MobileFilterSheet } from './MobileFilterSheet';
import { SlidersHorizontal } from 'lucide-react';

interface Category { _id: string; name: string; }

// ✅ It now accepts props to control its behavior
interface ControllerProps {
    categories: Category[];
    isOpen: boolean;
    onOpen: () => void; // A function to tell the parent to open the sheet
}

export function MobileFilterSheetController({ categories, isOpen, onOpen }: ControllerProps) {
    return (
        <>
            <button 
                onClick={onOpen} // ✅ Call the onOpen function from the parent
                className="p-2 rounded-md border border-secondary-bg bg-primary-bg hover:bg-secondary-bg/60"
            >
                <SlidersHorizontal size={20} className="text-heading-color" />
            </button>
            {/* The sheet's state is now also controlled by the parent */}
            <MobileFilterSheet 
                isOpen={isOpen} 
                onClose={() => { /* The parent will handle closing */ }} 
                categories={categories} 
            />
        </>
    )
}