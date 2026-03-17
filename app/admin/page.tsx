// app/admin/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Package, ShoppingCart, Users, TrendingUp, DollarSign,
  ArrowUpRight, ArrowDownRight, Clock, AlertTriangle,
  BarChart3, Eye, ChevronRight
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { formatPrice, formatDate, ORDER_STATUS_COLORS } from '@/lib/utils';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, BarChart, Bar
} from 'recharts';

const REVENUE_DATA = [
  { month: 'Jan', revenue: 420000, orders: 34 },
  { month: 'Feb', revenue: 380000, orders: 28 },
  { month: 'Mar', revenue: 550000, orders: 45 },
  { month: 'Apr', revenue: 490000, orders: 38 },
  { month: 'May', revenue: 620000, orders: 52 },
  { month: 'Jun', revenue: 710000, orders: 61 },
  { month: 'Jul', revenue: 680000, orders: 57 },
];

const CATEGORY_DATA = [
  { name: 'Cricket', value: 38 },
  { name: 'Football', value: 24 },
  { name: 'Boxing', value: 16 },
  { name: 'Fitness', value: 12 },
  { name: 'Others', value: 10 },
];

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    totalRevenue: 0, totalOrders: 0, totalProducts: 0,
    totalUsers: 0, pendingOrders: 0, lowStock: 0,
  });
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const supabase = createClient();
      const [ordersRes, productsRes, usersRes] = await Promise.all([
        supabase.from('orders').select('total_price, status, created_at, profiles(name, email)').order('created_at', { ascending: false }),
        supabase.from('products').select('stock, name'),
        supabase.from('profiles').select('id'),
      ]);

      const orders = ordersRes.data || [];
      const products = productsRes.data || [];

      setStats({
        totalRevenue: orders.filter(o => o.status === 'delivered').reduce((s, o) => s + o.total_price, 0),
        totalOrders: orders.length,
        totalProducts: products.length,
        totalUsers: usersRes.data?.length || 0,
        pendingOrders: orders.filter(o => o.status === 'pending').length,
        lowStock: products.filter(p => p.stock < 10).length,
      });
      setRecentOrders(orders.slice(0, 8));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const STAT_CARDS = [
    {
      label: 'Total Revenue', value: formatPrice(stats.totalRevenue),
      icon: DollarSign, change: '+12.5%', up: true,
      gradient: 'from-blue-500 to-blue-700', light: 'bg-blue-50 text-blue-600',
    },
    {
      label: 'Total Orders', value: stats.totalOrders,
      icon: ShoppingCart, change: '+8.2%', up: true,
      gradient: 'from-purple-500 to-purple-700', light: 'bg-purple-50 text-purple-600',
    },
    {
      label: 'Products Listed', value: stats.totalProducts,
      icon: Package, change: '+3 this week', up: true,
      gradient: 'from-green-500 to-emerald-700', light: 'bg-green-50 text-green-600',
    },
    {
      label: 'Registered Users', value: stats.totalUsers,
      icon: Users, change: '+24 this month', up: true,
      gradient: 'from-orange-500 to-red-600', light: 'bg-orange-50 text-orange-600',
    },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display font-extrabold text-3xl text-gray-900">Dashboard</h1>
          <p className="text-gray-500 mt-1">Welcome back, Admin. Here's what's happening.</p>
        </div>
        <div className="flex gap-3">
          <Link href="/admin/products" className="btn-primary text-sm px-5 py-2.5 rounded-xl flex items-center gap-2">
            <Package className="w-4 h-4" /> Manage Products
          </Link>
        </div>
      </div>

      {/* Alert banners */}
      {(stats.pendingOrders > 0 || stats.lowStock > 0) && (
        <div className="flex flex-wrap gap-3">
          {stats.pendingOrders > 0 && (
            <div className="flex items-center gap-3 bg-yellow-50 border border-yellow-200 rounded-2xl px-4 py-3">
              <Clock className="w-5 h-5 text-yellow-600" />
              <span className="text-sm font-medium text-yellow-800">
                {stats.pendingOrders} pending orders awaiting confirmation
              </span>
              <Link href="/admin/orders" className="text-yellow-700 hover:text-yellow-900 text-sm font-bold flex items-center gap-1">
                Review <ChevronRight className="w-3 h-3" />
              </Link>
            </div>
          )}
          {stats.lowStock > 0 && (
            <div className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-2xl px-4 py-3">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              <span className="text-sm font-medium text-red-800">
                {stats.lowStock} products are running low on stock
              </span>
              <Link href="/admin/products" className="text-red-700 hover:text-red-900 text-sm font-bold flex items-center gap-1">
                View <ChevronRight className="w-3 h-3" />
              </Link>
            </div>
          )}
        </div>
      )}

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        {STAT_CARDS.map((card, i) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm hover:shadow-lg transition-shadow"
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`w-11 h-11 rounded-2xl ${card.light} flex items-center justify-center`}>
                <card.icon className="w-5 h-5" />
              </div>
              <span className={`flex items-center gap-1 text-xs font-bold ${card.up ? 'text-green-600' : 'text-red-500'}`}>
                {card.up ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                {card.change}
              </span>
            </div>
            <p className="font-display font-extrabold text-2xl text-gray-900">{loading ? '—' : card.value}</p>
            <p className="text-gray-500 text-sm mt-1">{card.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-display font-bold text-xl text-gray-900">Revenue Overview</h3>
              <p className="text-gray-500 text-sm">Last 7 months performance</p>
            </div>
            <div className="flex items-center gap-2 text-green-600 bg-green-50 px-3 py-1.5 rounded-xl text-sm font-bold">
              <TrendingUp className="w-4 h-4" /> +12.5%
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={REVENUE_DATA}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#1D4ED8" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#1D4ED8" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: '#9ca3af' }} axisLine={false} tickLine={false} tickFormatter={v => `${(v/1000).toFixed(0)}K`} />
              <Tooltip formatter={(v: any) => [formatPrice(v), 'Revenue']} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} />
              <Area type="monotone" dataKey="revenue" stroke="#1D4ED8" strokeWidth={2.5} fill="url(#colorRevenue)" dot={{ fill: '#1D4ED8', r: 4 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Category Chart */}
        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
          <div className="mb-6">
            <h3 className="font-display font-bold text-xl text-gray-900">Sales by Category</h3>
            <p className="text-gray-500 text-sm">Current month breakdown</p>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={CATEGORY_DATA} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} tickFormatter={v => `${v}%`} />
              <YAxis dataKey="name" type="category" tick={{ fontSize: 12, fill: '#6b7280' }} axisLine={false} tickLine={false} width={60} />
              <Tooltip formatter={(v: any) => [`${v}%`, 'Share']} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} />
              <Bar dataKey="value" fill="#1D4ED8" radius={[0, 6, 6, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-50">
          <h3 className="font-display font-bold text-xl text-gray-900">Recent Orders</h3>
          <Link href="/admin/orders" className="flex items-center gap-1 text-blue-600 text-sm font-semibold hover:gap-2 transition-all">
            View All <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                {['Order ID', 'Customer', 'Amount', 'Status', 'Date', 'Action'].map(h => (
                  <th key={h} className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i}>
                    {[...Array(6)].map((_, j) => (
                      <td key={j} className="px-6 py-4"><div className="h-4 skeleton rounded-full" /></td>
                    ))}
                  </tr>
                ))
              ) : recentOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <span className="font-mono text-sm font-bold text-gray-900">#{order.id.slice(0, 8).toUpperCase()}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{(order.profiles as any)?.name || 'Unknown'}</p>
                      <p className="text-xs text-gray-500">{(order.profiles as any)?.email}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-bold text-gray-900">{formatPrice(order.total_price)}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${ORDER_STATUS_COLORS[order.status]}`}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-500">{formatDate(order.created_at)}</span>
                  </td>
                  <td className="px-6 py-4">
                    <Link href="/admin/orders" className="p-2 rounded-xl hover:bg-blue-50 text-gray-400 hover:text-blue-600 transition-colors inline-flex">
                      <Eye className="w-4 h-4" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
