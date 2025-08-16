// app/(dashboard)/layout.tsx
"use client";

import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';
import { User, Package, LogOut, ShieldCheck } from 'lucide-react'; // <-- Import a new icon

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  // ✅ Get the 'user' object from the auth context
  const { user, isAuthenticated, loading, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, loading, router]);

  if (loading || !isAuthenticated) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Loading...</p> 
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-12">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Sidebar Navigation */}
        <aside className="md:col-span-1">
          <div className="p-6 bg-secondary-bg/60 rounded-lg shadow-sm sticky top-28">
            <div className="mb-4">
              <h2 className="font-bold text-lg text-heading-color">{user?.name}</h2>
              <p className="text-sm text-text-color">{user?.email}</p>
            </div>
            <nav className="space-y-2 border-t border-secondary-bg pt-4">
              <Link href="/my-profile" className="flex items-center gap-3 p-3 rounded-md hover:bg-secondary-bg transition-colors">
                <User size={20} />
                <span>My Profile</span>
              </Link>
              <Link href="/my-orders" className="flex items-center gap-3 p-3 rounded-md hover:bg-secondary-bg transition-colors">
                <Package size={20} />
                <span>My Orders</span>
              </Link>

              {/* ✅ --- START: Conditional Admin Button --- ✅ */}
              {user?.role === 'admin' && (
                <Link href="/dashboard" className="flex items-center gap-3 p-3 rounded-md bg-accent/10 text-accent hover:bg-accent/20 transition-colors font-semibold">
                  <ShieldCheck size={20} />
                  <span>Admin Panel</span>
                </Link>
              )}
              {/* ✅ --- END: Conditional Admin Button --- ✅ */}

              <button onClick={logout} className="w-full flex items-center gap-3 p-3 rounded-md text-red-500 hover:bg-red-100 transition-colors mt-4 border-t border-secondary-bg pt-4">
                <LogOut size={20} />
                <span>Logout</span>
              </button>
            </nav>
          </div>
        </aside>

        {/* Page Content */}
        <main className="md:col-span-3">
          {children}
        </main>
      </div>
    </div>
  );
}