// components/layout/Navbar.tsx
"use client";

import { useState, useEffect } from "react";
import { ShoppingBag, User, Menu, X, LogOut, Search } from "lucide-react";
import { Logo } from "@/components/common/Logo";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from '@/hooks/useCart';
import { useAuth } from '@/hooks/useAuth';
import { CartSidebar } from '../cart/CartSidebar';
import { useRouter } from 'next/navigation';

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { itemCount } = useCart();
  const { isAuthenticated, logout } = useAuth();
  const router = useRouter();

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

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/products?keyword=${encodeURIComponent(searchTerm.trim())}`);
      setIsSearchOpen(false);
      setSearchTerm('');
    }
  };

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
    <>
    <header
      className={`fixed top-0 left-0 w-full z-[100] transition-all duration-300 ${
        isScrolled || isMenuOpen ? "bg-white shadow-sm" : "bg-transparent"
      }`}
    >
      <nav 
        className="container mx-auto px-4 sm:px-6 h-20 flex justify-between items-center transition-all duration-300"
      >        {/* Hamburger menu on the left (mobile only) */}
        <div className={`lg:hidden transition-all duration-300 ${isMenuOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
          <button onClick={() => setIsMenuOpen(true)} className="text-heading-color z-50 relative" aria-label="Open menu">
            <Menu size={28} />
          </button>
        </div>
        
        {/* Logo (centered on mobile, left on desktop) */}
        <div className={`absolute left-1/2 -translate-x-1/2 lg:static lg:left-0 lg:translate-x-0 transition-all duration-300 ${isMenuOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
          <Logo />
        </div>

        {/* Desktop Navigation */}
        <div className={`hidden lg:flex items-center gap-8 font-sans transition-all duration-300 ${isMenuOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className="text-text-color hover:text-heading-color transition-colors">
              {link.label}
            </Link>
          ))}
        </div>

        {/* Right-side Icons */}
        <div className={`flex items-center gap-4 sm:gap-6 transition-all duration-300 ${isMenuOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
          {/* Search Icon (mobile) */}
          <button 
            onClick={() => setIsSearchOpen(true)}
            className="lg:hidden text-text-color hover:text-heading-color"
          >
            <Search size={24} />
          </button>
          
          {/* Cart Icon (always visible) */}
          <button 
            onClick={() => setIsCartOpen(true)}
            className="relative text-text-color hover:text-heading-color"
          >
            <ShoppingBag size={24} />
            {itemCount > 0 && (
              <span className="absolute -top-2 -right-2 w-5 h-5 bg-accent text-white text-xs rounded-full flex items-center justify-center font-bold">
                {itemCount}
              </span>
            )}
          </button>
          
          {/* Profile Icon (desktop only) */}
          <Link href="/my-profile" className="hidden lg:block text-text-color hover:text-heading-color">
            <User size={24} />
          </Link>
        </div>
      </nav>


      {/* --- Mobile Search Modal --- */}
      <AnimatePresence>
        {isSearchOpen && (
          <>
            <motion.div 
              variants={overlayVariants} 
              initial="hidden" 
              animate="visible" 
              exit="exit" 
              onClick={() => setIsSearchOpen(false)} 
              className="fixed inset-0 bg-black/50 z-[101] lg:hidden" 
            />
            <motion.div
              initial={{ y: -100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -100, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed top-0 left-0 right-0 bg-primary-bg shadow-2xl z-[102] lg:hidden p-4"
            >
              <div className="flex items-center gap-4">
                <form onSubmit={handleSearch} className="flex-1 relative">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search for art..."
                    className="w-full pl-10 pr-4 py-3 bg-white border border-secondary-bg rounded-full 
                             text-heading-color placeholder-text-color/60 
                             focus:ring-2 focus:ring-accent focus:border-accent 
                             outline-none transition-shadow"
                    autoFocus
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search size={20} className="text-text-color/50" />
                  </div>
                </form>
                <button 
                  onClick={() => setIsSearchOpen(false)} 
                  className="text-text-color hover:text-heading-color"
                >
                  <X size={24} />
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Cart Sidebar */}
      <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </header>
    
    {/* Mobile Menu - Outside header to cover entire viewport */}
    <AnimatePresence>
      {isMenuOpen && (
        <>
          <motion.div 
            variants={overlayVariants} 
            initial="hidden" 
            animate="visible" 
            exit="exit" 
            onClick={() => setIsMenuOpen(false)} 
            className="fixed inset-0 bg-black/70 z-[101] lg:hidden" 
          />
          <motion.div
            variants={menuVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed top-0 left-0 h-full w-4/5 max-w-sm bg-white shadow-2xl z-[102] lg:hidden"
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
    </>
  );
}