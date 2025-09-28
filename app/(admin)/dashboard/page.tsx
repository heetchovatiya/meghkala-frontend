// app/(admin)/dashboard/page.tsx
"use client";

import AnalyticsDashboard from '@/components/dashboard/AnalyticsDashboard';

export default function AdminDashboardPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-serif text-heading-color mb-2">Analytics Dashboard</h1>
        <p className="text-gray-600">Comprehensive insights into your business performance</p>
      </div>
      
      <AnalyticsDashboard />
    </div>
  );
}