// components/ui/Modal.tsx
"use client";

import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export function Modal({ isOpen, onClose, title, children }: ModalProps) {
  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('no-scroll');
    } else {
      document.body.classList.remove('no-scroll');
    }
    
    // Cleanup on unmount
    return () => {
      document.body.classList.remove('no-scroll');
    };
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: 20 }}
            className="relative bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[95vh] sm:max-h-[90vh] flex flex-col mx-2 sm:mx-0 container-stable"
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 flex-shrink-0">
              <h2 className="text-lg sm:text-2xl font-serif text-gray-900 truncate pr-4">{title}</h2>
              <button 
                onClick={onClose} 
                className="text-gray-500 hover:text-gray-700 flex-shrink-0 p-1 rounded-md hover:bg-gray-100 transition-colors"
                aria-label="Close modal"
              >
                <X size={24} />
              </button>
            </div>
            {/* Content */}
            <div className="p-4 sm:p-6 overflow-y-auto flex-1 smooth-scroll">
              {children}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}