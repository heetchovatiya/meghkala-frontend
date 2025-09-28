// components/layout/MobileMenu.tsx
"use client";

import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Logo } from "@/components/common/Logo";
import { X, User, LogOut } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { useState, useEffect } from "react";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const { isAuthenticated, logout } = useAuth();
  const navLinks = [
    { href: "/products", label: "Collection" },
    { href: "/categories", label: "Categories" },
    { href: "/our-story", label: "Our Story" },
  ];
  
  const menuVariants = {
    hidden: { x: "-100%", opacity: 0 },
    visible: { x: 0, opacity: 1 },
    exit: { x: "-100%", opacity: 0 }
  };
  
  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 }
  };

  // This useEffect prevents the component from running on the server
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);
  if (!isMounted) return null;


  // ✅ Use createPortal to render the menu at the end of the body
  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <>
          {/* The overlay is now guaranteed to be on top of everything */}
          <motion.div 
            variants={overlayVariants} 
            initial="hidden" 
            animate="visible" 
            exit="exit" 
            transition={{ type: "tween", duration: 0.3 }}
            onClick={onClose} 
            className="fixed inset-0 bg-black/60 z-[9998] lg:hidden"
            style={{ 
              position: 'fixed',
              zIndex: 9998
            }}
          />
          
          {/* The menu panel is now guaranteed to be on top of the overlay */}
          <motion.div
            variants={menuVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ type: "tween", duration: 0.3 }}
            className="fixed top-0 left-0 h-full w-4/5 max-w-sm bg-white shadow-2xl z-[9999] lg:hidden border-r border-earth-200"
            style={{ 
              position: 'fixed',
              zIndex: 9999,
              backgroundColor: '#ffffff'
            }}
          >
            <div className="flex flex-col h-full p-6 sm:p-8">
              <div className="flex justify-between items-center mb-12">
                <Logo />
                <button onClick={onClose} aria-label="Close menu">
                  <X size={32} className="text-heading-color" />
                </button>
              </div>
              
              <nav className="flex flex-col items-start gap-y-8">
                {navLinks.map((link) => (
                  <Link 
                    key={link.href} 
                    href={link.href} 
                    onClick={onClose} 
                    className="text-3xl font-serif font-semibold text-heading-color hover:text-terracotta-600 transition-colors duration-300"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
              
              <div className="mt-auto border-t border-earth-200 pt-6 space-y-4">
                {isAuthenticated ? (
                  <>
                    <Link 
                      href="/my-profile" 
                      onClick={onClose} 
                      className="flex items-center gap-3 text-lg font-medium text-heading-color hover:text-terracotta-600 transition-colors duration-300"
                    >
                      <User size={24} />
                      <span>My Profile</span>
                    </Link>
                    <button 
                      onClick={() => { logout(); onClose(); }} 
                      className="w-full flex items-center gap-3 text-lg font-medium text-red-600 hover:text-red-700 transition-colors duration-300"
                    >
                      <LogOut size={24} />
                      <span>Logout</span>
                    </button>
                  </>
                ) : (
                  <Link 
                    href="/login" 
                    onClick={onClose} 
                    className="flex items-center gap-3 text-lg font-medium text-heading-color hover:text-terracotta-600 transition-colors duration-300"
                  >
                    <User size={24} />
                    <span>Login / Sign Up</span>
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body // Teleport destination
  );
}