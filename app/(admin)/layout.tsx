// app/(admin)/layout.tsx
"use client";

import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';
import { LayoutDashboard, ShoppingCart, Tag, Package, LogOut } from 'lucide-react';
import { Logo } from '@/components/common/Logo';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated, loading, logout } = useAuth();
  const router = useRouter();

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
    <div className="flex h-screen bg-secondary-bg/40">
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-primary-bg shadow-md flex flex-col">
        <div className="p-6 border-b border-secondary-bg">
          <Logo />
          <span className="text-xs text-accent">Admin Panel</span>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <Link href="/dashboard" className="flex items-center gap-3 p-3 rounded-md hover:bg-secondary-bg transition-colors">
            <LayoutDashboard size={20} />
            <span>Dashboard</span>
          </Link>
          <Link href="/admin/orders" className="flex items-center gap-3 p-3 rounded-md hover:bg-secondary-bg transition-colors">
            <ShoppingCart size={20} />
            <span>Orders</span>
          </Link>
          <Link href="/admin/products" className="flex items-center gap-3 p-3 rounded-md hover:bg-secondary-bg transition-colors">
            <Package size={20} />
            <span>Products</span>
          </Link>
          <Link href="/admin/categories" className="flex items-center gap-3 p-3 ...">
          <Tag size={20} />
          <span>Categories</span>
        </Link>
        {/* ✅ NEW: Link to the Coupons Page */}
          <Link href="/admin/coupons" className="flex items-center gap-3 p-3 rounded-md hover:bg-secondary-bg transition-colors">
            <Tag size={20} /> {/* Can use the same icon or a different one */}
            <span>Coupons</span>
          </Link>
          {/* Add links for Coupons, Categories etc. later */}
        </nav>
        <div className="p-4 border-t border-secondary-bg">
          <button onClick={logout} className="w-full flex items-center gap-3 p-3 rounded-md text-red-500 hover:bg-red-100 transition-colors">
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-8 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}