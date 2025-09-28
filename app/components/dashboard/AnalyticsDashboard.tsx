// components/dashboard/AnalyticsDashboard.tsx
"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import * as api from '@/lib/api';
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  ShoppingCart, 
  Package, 
  DollarSign,
  AlertTriangle,
  Star,
  Calendar,
  BarChart3,
  PieChart,
  Activity
} from 'lucide-react';

interface AnalyticsData {
  revenue: {
    total: number;
    monthly: number;
    growth: number;
    byMonth: Array<{ _id: { year: number; month: number }; revenue: number; orders: number }>;
  };
  orders: {
    total: number;
    monthly: number;
    growth: number;
    byStatus: Record<string, number>;
    byMonth: Array<{ _id: { year: number; month: number }; count: number }>;
  };
  users: {
    total: number;
    monthly: number;
    growth: number;
    byMonth: Array<{ _id: { year: number; month: number }; count: number }>;
  };
  products: {
    total: number;
    lowStock: number;
    lowStockDetails: Array<{ _id: string; title: string; quantity: number; reserved: number; images: string[]; category: { name: string } }>;
    topSelling: Array<{ _id: string; title: string; totalSold: number; price: number }>;
    categoryStats: Array<{ _id: string; totalSold: number; revenue: number }>;
  };
  recentActivity: {
    orders: Array<any>;
    users: Array<any>;
  };
  coupons: {
    total: number;
    active: number;
    usageStats: Array<{ code: string; usageCount: number; totalDiscount: number }>;
  };
}

function StatCard({ 
  title, 
  value, 
  growth, 
  icon, 
  color = "blue",
  format = "number" 
}: { 
  title: string; 
  value: number; 
  growth?: number; 
  icon: React.ReactNode; 
  color?: string;
  format?: "number" | "currency" | "percentage";
}) {
  const formatValue = (val: number) => {
    switch (format) {
      case "currency":
        return `₹${val.toLocaleString()}`;
      case "percentage":
        return `${val.toFixed(1)}%`;
      default:
        return val.toLocaleString();
    }
  };

  const colorClasses = {
    blue: "bg-blue-500",
    green: "bg-green-500",
    orange: "bg-orange-500",
    red: "bg-red-500",
    purple: "bg-purple-500",
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{formatValue(value)}</p>
          {growth !== undefined && (
            <div className="flex items-center mt-2">
              {growth >= 0 ? (
                <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
              ) : (
                <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
              )}
              <span className={`text-sm ${growth >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {Math.abs(growth).toFixed(1)}%
              </span>
              <span className="text-xs text-gray-500 ml-1">vs last month</span>
            </div>
          )}
        </div>
        <div className={`${colorClasses[color as keyof typeof colorClasses]} text-white p-3 rounded-full`}>
          {icon}
        </div>
      </div>
    </div>
  );
}

function SimpleChart({ data, title, type = "line" }: { data: any[]; title: string; type?: "line" | "bar" }) {
  if (!data || data.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
        <div className="flex items-center justify-center h-48 text-gray-500">
          No data available
        </div>
      </div>
    );
  }

  const maxValue = Math.max(...data.map(d => d.revenue || d.count || d.orders || 0));
  
  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      <div className="h-48 flex items-end justify-between space-x-2">
        {data.slice(-6).map((item, index) => {
          const value = item.revenue || item.count || item.orders || 0;
          const height = (value / maxValue) * 100;
          const month = new Date(item._id.year, item._id.month - 1).toLocaleDateString('en-US', { month: 'short' });
          
          return (
            <div key={index} className="flex flex-col items-center flex-1">
              <div 
                className="bg-blue-500 rounded-t w-full transition-all duration-300 hover:bg-blue-600"
                style={{ height: `${height}%` }}
                title={`${month}: ${value.toLocaleString()}`}
              ></div>
              <span className="text-xs text-gray-600 mt-2">{month}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function TopSellingProducts({ products }: { products: Array<{ _id: string; title: string; totalSold: number; price: number }> }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Selling Products</h3>
      <div className="space-y-3">
        {products.slice(0, 5).map((product, index) => (
          <div key={product._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-semibold mr-3">
                {index + 1}
              </div>
              <div>
                <p className="font-medium text-gray-900">{product.title}</p>
                <p className="text-sm text-gray-600">₹{product.price.toLocaleString()}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-semibold text-gray-900">{product.totalSold}</p>
              <p className="text-sm text-gray-600">sold</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function RecentOrders({ orders }: { orders: Array<any> }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Orders</h3>
      <div className="space-y-3">
        {orders.slice(0, 5).map((order) => (
          <div key={order._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium text-gray-900">{order.user?.name || 'Unknown User'}</p>
              <p className="text-sm text-gray-600">{order.products?.length || 0} items</p>
            </div>
            <div className="text-right">
              <p className="font-semibold text-gray-900">₹{order.finalAmount?.toLocaleString()}</p>
              <p className="text-sm text-gray-600">{order.status}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function LowStockNotifications({ products }: { products: Array<{ _id: string; title: string; quantity: number; reserved: number; images: string[]; category: { name: string } }> }) {
  const availableStock = (product: any) => product.quantity - product.reserved;
  
  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
      <div className="flex items-center mb-4">
        <AlertTriangle className="w-5 h-5 text-red-500 mr-2" />
        <h3 className="text-lg font-semibold text-gray-900">Low Stock Alerts</h3>
      </div>
      
      {products.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <Package className="w-12 h-12 mx-auto mb-2 text-gray-300" />
          <p>No low stock products</p>
        </div>
      ) : (
        <div className="space-y-3">
          {products.map((product) => (
            <div key={product._id} className="flex items-center justify-between p-3 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center">
                {product.images && product.images.length > 0 ? (
                  <img 
                    src={product.images[0]} 
                    alt={product.title}
                    className="w-10 h-10 object-cover rounded mr-3"
                  />
                ) : (
                  <div className="w-10 h-10 bg-gray-200 rounded mr-3 flex items-center justify-center">
                    <Package className="w-5 h-5 text-gray-400" />
                  </div>
                )}
                <div>
                  <p className="font-medium text-gray-900">{product.title}</p>
                  <p className="text-sm text-gray-600">{product.category?.name}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold text-red-600">{availableStock(product)}</p>
                <p className="text-xs text-gray-500">available</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function OrderStatusChart({ statusData }: { statusData: Record<string, number> }) {
  const total = Object.values(statusData).reduce((sum, count) => sum + count, 0);
  const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];
  
  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Orders by Status</h3>
      <div className="space-y-3">
        {Object.entries(statusData).map(([status, count], index) => {
          const percentage = total > 0 ? (count / total) * 100 : 0;
          return (
            <div key={status} className="flex items-center">
              <div 
                className="w-4 h-4 rounded-full mr-3"
                style={{ backgroundColor: colors[index % colors.length] }}
              ></div>
              <div className="flex-1">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-700 capitalize">{status.replace(/_/g, ' ')}</span>
                  <span className="text-gray-900 font-medium">{count}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                  <div 
                    className="h-2 rounded-full transition-all duration-300"
                    style={{ 
                      width: `${percentage}%`,
                      backgroundColor: colors[index % colors.length]
                    }}
                  ></div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function AnalyticsDashboard() {
  const { token } = useAuth();
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (token) {
      console.log("Fetching dashboard stats with token:", token ? "present" : "missing");
      api.adminGetDashboardStats(token)
        .then(data => {
          console.log("Dashboard stats received:", data);
          setData(data);
          setError(null);
        })
        .catch(err => {
          console.error("Failed to fetch analytics:", err);
          setError(`Failed to load analytics data: ${err.message || err}`);
        })
        .finally(() => setLoading(false));
    }
  }, [token]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="text-center py-12">
        <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <p className="text-red-600">{error || "Failed to load analytics data"}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Revenue"
          value={data.revenue.total}
          growth={data.revenue.growth}
          icon={<DollarSign className="w-6 h-6" />}
          color="green"
          format="currency"
        />
        <StatCard
          title="Total Orders"
          value={data.orders.total}
          growth={data.orders.growth}
          icon={<ShoppingCart className="w-6 h-6" />}
          color="blue"
        />
        <StatCard
          title="Total Users"
          value={data.users.total}
          growth={data.users.growth}
          icon={<Users className="w-6 h-6" />}
          color="purple"
        />
        <StatCard
          title="Total Products"
          value={data.products.total}
          icon={<Package className="w-6 h-6" />}
          color="orange"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SimpleChart 
          data={data.revenue.byMonth} 
          title="Revenue Trend (Last 6 Months)" 
        />
        <SimpleChart 
          data={data.orders.byMonth} 
          title="Orders Trend (Last 6 Months)" 
        />
      </div>

      {/* Analytics Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <OrderStatusChart statusData={data.orders.byStatus} />
        <TopSellingProducts products={data.products.topSelling} />
        <RecentOrders orders={data.recentActivity.orders} />
      </div>

      {/* Low Stock Notifications */}
      {data.products.lowStock > 0 && (
        <div className="grid grid-cols-1 gap-6">
          <LowStockNotifications products={data.products.lowStockDetails} />
        </div>
      )}

      {/* Additional Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="relative">
          <StatCard
            title="Low Stock Products"
            value={data.products.lowStock}
            icon={<AlertTriangle className="w-6 h-6" />}
            color="red"
          />
          {data.products.lowStock > 0 && (
            <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold animate-pulse">
              !
            </div>
          )}
        </div>
        <StatCard
          title="Active Coupons"
          value={data.coupons.active}
          icon={<Star className="w-6 h-6" />}
          color="purple"
        />
        <StatCard
          title="Monthly Revenue"
          value={data.revenue.monthly}
          icon={<TrendingUp className="w-6 h-6" />}
          color="green"
          format="currency"
        />
      </div>
    </div>
  );
}
