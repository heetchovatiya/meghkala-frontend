// components/layout/Navbar.tsx
"use client";

import { useState, useEffect } from "react";
import { ShoppingBag, User, Menu, X, LogOut } from "lucide-react"; // Added LogOut icon
import { Logo } from "@/components/common/Logo";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from '@/hooks/useCart';
import { useAuth } from '@/hooks/useAuth'; // Import useAuth to check login status
import { MobileFilterSheetController } from "../products/MobileFilterSheetController";
import { MobileMenu } from './MobileMenu'; // ✅ Import the new MobileMenu component

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { itemCount } = useCart();
  const { isAuthenticated, logout } = useAuth(); // Get auth status and logout function

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);

    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.body.style.overflow = "auto";
    };
  }, [isMenuOpen]);

  const navLinks = [
    { href: "/products", label: "Collection" },
    { href: "/categories", label: "Categories" },
    { href: "/our-story", label: "Our Story" },
  ];

  // Modified menu animation to slide from the left
  const menuVariants = {
    hidden: { x: "-100%" },
    visible: { x: 0, transition: { duration: 0.4, ease: "easeInOut" } },
    exit: { x: "-100%", transition: { duration: 0.3, ease: "easeInOut" } },
  };

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.4 } },
    exit: { opacity: 0, transition: { duration: 0.3 } },
  };

  return (
    <header
      className={`fixed top-0 left-0 w-full z-[100] transition-all duration-300 ${
        isScrolled ? "bg-primary-bg/90 backdrop-blur-sm shadow-sm" : "bg-transparent"
      }`}
    >
<nav 
        className={`container mx-auto px-4 sm:px-6 h-20 flex justify-between items-center transition-all duration-300 ${
          isMenuOpen ? 'opacity-20 blur-sm pointer-events-none' : 'opacity-100'
        }`}
      >        {/* Hamburger menu on the left (mobile only) */}
        <div className="lg:hidden">
          <button onClick={() => setIsMenuOpen(true)} className="text-heading-color z-50 relative" aria-label="Open menu">
            <Menu size={28} />
          </button>
        </div>
        
        {/* Logo (centered on mobile, left on desktop) */}
        <div className="absolute left-1/2 -translate-x-1/2 lg:static lg:left-0 lg:translate-x-0">
          <Logo />
        </div>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-8 font-sans">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className="text-text-color hover:text-heading-color transition-colors">
              {link.label}
            </Link>
          ))}
        </div>

        {/* Right-side Icons */}
        <div className="flex items-center gap-4 sm:gap-6">
          {/* Cart Icon (always visible) */}
          <Link href="/cart" className="relative text-text-color hover:text-heading-color">
            <ShoppingBag size={24} />
            {itemCount > 0 && (
              <span className="absolute -top-2 -right-2 w-5 h-5 bg-accent text-white text-xs rounded-full flex items-center justify-center font-bold">
                {itemCount}
              </span>
            )}
          </Link>
          {/* Profile Icon (desktop only) */}
          <Link href="/my-profile" className="hidden lg:block text-text-color hover:text-heading-color">
            <User size={24} />
          </Link>
        </div>
      </nav>

      
      {/* --- Mobile Slide-Out Menu --- */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div variants={overlayVariants} initial="hidden" animate="visible" exit="exit" onClick={() => setIsMenuOpen(false)} className="fixed inset-0 bg-black/50 z-[98] lg:hidden" />
            <motion.div
              variants={menuVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="fixed top-0 left-0 h-full w-4/5 max-w-sm bg-primary-bg shadow-2xl z-[99] lg:hidden"
            >
              <div className="flex flex-col h-full p-6 sm:p-8">
                <div className="flex justify-between items-center mb-12">
                  <Logo />
                  <button onClick={() => setIsMenuOpen(false)} aria-label="Close menu">
                    <X size={32} className="text-heading-color" />
                  </button>
                </div>
                
                {/* Main Navigation Links */}
                <nav className="flex flex-col items-start gap-y-8">
                  {navLinks.map((link) => (
                    <Link key={link.href} href={link.href} onClick={() => setIsMenuOpen(false)} className="text-3xl font-serif text-heading-color hover:text-accent transition-colors">
                      {link.label}
                    </Link>
                  ))}
                </nav>
                
                {/* Profile/Login/Logout Section at the bottom */}
                <div className="mt-auto border-t border-secondary-bg pt-6 space-y-4">
                  {isAuthenticated ? (
                    <>
                      <Link href="/my-profile" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-4 p-3 rounded-md text-xl text-heading-color hover:bg-secondary-bg transition-colors">
                        <User size={24} />
                        <span>My Profile</span>
                      </Link>
                      <button onClick={() => { logout(); setIsMenuOpen(false); }} className="w-full flex items-center gap-4 p-3 rounded-md text-xl text-red-500 hover:bg-red-100 transition-colors">
                        <LogOut size={24} />
                        <span>Logout</span>
                      </button>
                    </>
                  ) : (
                    <Link href="/login" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-4 p-3 rounded-md text-xl text-heading-color hover:bg-secondary-bg transition-colors">
                      <User size={24} />
                      <span>Login / Sign Up</span>
                    </Link>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
            <MobileMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />

    </header>
  );
}