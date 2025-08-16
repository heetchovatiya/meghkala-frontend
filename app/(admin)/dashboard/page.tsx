// app/(admin)/dashboard/page.tsx
"use client";

import { useAuth } from '@/hooks/useAuth';
import { useEffect, useState } from 'react';
import * as api from '@/lib/api';

// A simple card component for displaying stats
function StatCard({ title, value, icon }: { title: string, value: string | number, icon: React.ReactNode }) {
  return (
    <div className="bg-primary-bg p-6 rounded-lg shadow-md flex items-center gap-4">
      <div className="bg-accent/20 text-accent p-3 rounded-full">{icon}</div>
      <div>
        <p className="text-sm text-text-color">{title}</p>
        <p className="text-2xl font-bold text-heading-color">{value}</p>
      </div>
    </div>
  );
}

export default function AdminDashboardPage() {
  const { token } = useAuth();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      api.adminGetDashboardStats(token)
        .then(data => setStats(data))
        .catch(err => console.error("Failed to fetch stats:", err))
        .finally(() => setLoading(false));
    }
  }, [token]);

  if (loading) {
    return <div>Loading dashboard...</div>;
  }

  return (
    <div>
      <h1 className="text-3xl font-serif text-heading-color mb-8">Dashboard</h1>
      {stats ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard title="Total Revenue" value={`$${stats.totalRevenue.toFixed(2)}`} icon={'💰'} />
          <StatCard title="Total Orders" value={stats.totalOrders} icon={'🛒'} />
          <StatCard title="Total Products" value={stats.totalProducts} icon={'📦'} />
          <StatCard title="Total Users" value={stats.totalUsers} icon={'👥'} />
        </div>
      ) : (
        <p>Could not load dashboard statistics.</p>
      )}
      {/* We can add charts and recent orders here later */}
    </div>
  );
}