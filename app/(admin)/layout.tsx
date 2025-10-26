// app/(admin)/layout.tsx
"use client";

import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { LayoutDashboard, ShoppingCart, Tag, Package, LogOut, Percent, Gift, Bell, ChevronDown, ChevronUp } from 'lucide-react';
import { Logo } from '@/components/common/Logo';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated, loading, logout } = useAuth();
  const router = useRouter();
  const [navbarOpen, setNavbarOpen] = useState(false);

  useEffect(() => {
    if (loading) return; // Wait until authentication check is complete

    // If not authenticated or the user is not an admin, redirect away.
    if (!isAuthenticated || user?.role !== 'admin') {
      router.push('/'); // Redirect to homepage for non-admins
    }
  }, [isAuthenticated, user, loading, router]);

  // While loading or if the user is not an admin, show a loading/access denied state
  if (loading || user?.role !== 'admin') {
    return (
      <div className="flex justify-center items-center h-screen bg-primary-bg">
        <p>Accessing secure area...</p> 
      </div>
    );
  }

  // If authenticated as an admin, render the admin panel layout
  return (
    <div className="min-h-screen bg-secondary-bg/40">
      {/* Top Header */}
      <header className="bg-primary-bg shadow-sm border-b border-secondary-bg">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center">
              <Logo />
              <span className="ml-2 text-xs text-accent">Admin Panel</span>
            </div>

            {/* Mobile Navbar Toggle */}
            <button
              onClick={() => setNavbarOpen(!navbarOpen)}
              className="lg:hidden flex items-center gap-2 px-3 py-2 text-sm font-medium text-heading-color hover:text-accent transition-colors"
            >
              <span>Menu</span>
              {navbarOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>

            {/* Desktop Logout Button */}
            <button 
              onClick={logout} 
              className="hidden lg:flex items-center gap-2 px-3 py-2 text-sm font-medium text-red-500 hover:bg-red-100 rounded-md transition-colors"
            >
              <LogOut size={16} />
              <span>Logout</span>
            </button>
          </div>
        </div>

        {/* Mobile Sliding Navbar */}
        <div className={`lg:hidden transition-all duration-300 ease-in-out overflow-hidden ${
          navbarOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}>
          <nav className="px-4 py-4 space-y-2 bg-primary-bg border-t border-secondary-bg">
            <Link 
              href="/dashboard" 
              className="flex items-center gap-3 p-3 rounded-md hover:bg-secondary-bg transition-colors"
              onClick={() => setNavbarOpen(false)}
            >
              <LayoutDashboard size={20} />
              <span>Dashboard</span>
            </Link>
            <Link 
              href="/admin/orders" 
              className="flex items-center gap-3 p-3 rounded-md hover:bg-secondary-bg transition-colors"
              onClick={() => setNavbarOpen(false)}
            >
              <ShoppingCart size={20} />
              <span>Orders</span>
            </Link>
            <Link 
              href="/admin/products" 
              className="flex items-center gap-3 p-3 rounded-md hover:bg-secondary-bg transition-colors"
              onClick={() => setNavbarOpen(false)}
            >
              <Package size={20} />
              <span>Products</span>
            </Link>
            <Link 
              href="/admin/categories" 
              className="flex items-center gap-3 p-3 rounded-md hover:bg-secondary-bg transition-colors"
              onClick={() => setNavbarOpen(false)}
            >
              <Tag size={20} />
              <span>Categories</span>
            </Link>
            <Link 
              href="/admin/coupons" 
              className="flex items-center gap-3 p-3 rounded-md hover:bg-secondary-bg transition-colors"
              onClick={() => setNavbarOpen(false)}
            >
              <Gift size={20} />
              <span>Coupons</span>
            </Link>
            <Link 
              href="/admin/discounts" 
              className="flex items-center gap-3 p-3 rounded-md hover:bg-secondary-bg transition-colors"
              onClick={() => setNavbarOpen(false)}
            >
              <Percent size={20} />
              <span>Discounts</span>
            </Link>
            <Link 
              href="/admin/notifications" 
              className="flex items-center gap-3 p-3 rounded-md hover:bg-secondary-bg transition-colors"
              onClick={() => setNavbarOpen(false)}
            >
              <Bell size={20} />
              <span>Notifications</span>
            </Link>
            
            {/* Mobile Logout Button */}
            <button 
              onClick={() => {
                logout();
                setNavbarOpen(false);
              }} 
              className="w-full flex items-center gap-3 p-3 rounded-md text-red-500 hover:bg-red-100 transition-colors"
            >
              <LogOut size={20} />
              <span>Logout</span>
            </button>
          </nav>
        </div>
      </header>

      {/* Desktop Sidebar */}
      <div className="hidden lg:flex">
        <aside className="w-64 bg-primary-bg shadow-md flex flex-col h-[calc(100vh-4rem)]">
          <nav className="flex-1 p-4 space-y-2">
            <Link 
              href="/dashboard" 
              className="flex items-center gap-3 p-3 rounded-md hover:bg-secondary-bg transition-colors"
            >
              <LayoutDashboard size={20} />
              <span>Dashboard</span>
            </Link>
            <Link 
              href="/admin/orders" 
              className="flex items-center gap-3 p-3 rounded-md hover:bg-secondary-bg transition-colors"
            >
              <ShoppingCart size={20} />
              <span>Orders</span>
            </Link>
            <Link 
              href="/admin/products" 
              className="flex items-center gap-3 p-3 rounded-md hover:bg-secondary-bg transition-colors"
            >
              <Package size={20} />
              <span>Products</span>
            </Link>
            <Link 
              href="/admin/categories" 
              className="flex items-center gap-3 p-3 rounded-md hover:bg-secondary-bg transition-colors"
            >
              <Tag size={20} />
              <span>Categories</span>
            </Link>
            <Link 
              href="/admin/coupons" 
              className="flex items-center gap-3 p-3 rounded-md hover:bg-secondary-bg transition-colors"
            >
              <Gift size={20} />
              <span>Coupons</span>
            </Link>
            <Link 
              href="/admin/discounts" 
              className="flex items-center gap-3 p-3 rounded-md hover:bg-secondary-bg transition-colors"
            >
              <Percent size={20} />
              <span>Discounts</span>
            </Link>
            <Link 
              href="/admin/notifications" 
              className="flex items-center gap-3 p-3 rounded-md hover:bg-secondary-bg transition-colors"
            >
              <Bell size={20} />
              <span>Notifications</span>
            </Link>
          </nav>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 p-8 overflow-y-auto">
          {children}
        </main>
      </div>

      {/* Mobile Main Content Area */}
      <main className="lg:hidden p-4">
        {children}
      </main>
    </div>
  );
}