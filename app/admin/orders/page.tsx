// app/admin/orders/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, ChevronDown, Eye, RefreshCw } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { formatPrice, formatDate, ORDER_STATUS_COLORS } from '@/lib/utils';
import toast from 'react-hot-toast';

const ALL_STATUSES = ['all', 'pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => { loadOrders(); }, []);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const supabase = createClient();
      const { data } = await supabase
        .from('orders')
        .select('*, order_items(quantity, price, products(name, images)), profiles(name, email)')
        .order('created_at', { ascending: false });
      setOrders(data || []);
    } catch { toast.error('Failed to load orders'); }
    finally { setLoading(false); }
  };

  const updateStatus = async (orderId: string, status: string) => {
    setUpdatingId(orderId);
    try {
      const supabase = createClient();
      const { error } = await supabase.from('orders').update({ status }).eq('id', orderId);
      if (error) throw error;
      setOrders(o => o.map(order => order.id === orderId ? { ...order, status } : order));
      toast.success(`Order status updated to ${status}`);
    } catch { toast.error('Update failed'); }
    finally { setUpdatingId(null); }
  };

  const filtered = orders.filter(o => {
    const matchStatus = statusFilter === 'all' || o.status === statusFilter;
    const matchSearch = !search ||
      o.id.includes(search.toLowerCase()) ||
      (o.profiles?.name || '').toLowerCase().includes(search.toLowerCase()) ||
      (o.profiles?.email || '').toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  const statusCounts = ALL_STATUSES.reduce((acc, s) => ({
    ...acc,
    [s]: s === 'all' ? orders.length : orders.filter(o => o.status === s).length,
  }), {} as Record<string, number>);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display font-extrabold text-3xl text-gray-900">Orders</h1>
          <p className="text-gray-500 mt-1">{orders.length} total orders</p>
        </div>
        <button onClick={loadOrders} className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 px-4 py-2 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors">
          <RefreshCw className="w-4 h-4" /> Refresh
        </button>
      </div>

      {/* Status Tabs */}
      <div className="flex flex-wrap gap-2">
        {ALL_STATUSES.map(status => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-sm font-medium transition-colors capitalize ${
              statusFilter === status
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25'
                : 'bg-white border border-gray-200 text-gray-600 hover:border-blue-300'
            }`}
          >
            {status}
            <span className={`text-xs px-1.5 py-0.5 rounded-full font-bold ${
              statusFilter === status ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'
            }`}>
              {statusCounts[status] || 0}
            </span>
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search by order ID or customer..."
          className="input-field pl-11 text-sm"
        />
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                {['Order', 'Customer', 'Items', 'Amount', 'Status', 'Date', 'Update Status'].map(h => (
                  <th key={h} className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                [...Array(8)].map((_, i) => (
                  <tr key={i}>
                    {[...Array(7)].map((_, j) => (
                      <td key={j} className="px-6 py-4"><div className="h-4 skeleton rounded-full" /></td>
                    ))}
                  </tr>
                ))
              ) : filtered.length === 0 ? (
                <tr><td colSpan={7} className="text-center py-16 text-gray-400">No orders found</td></tr>
              ) : (
                filtered.map(order => (
                  <motion.tr
                    key={order.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-gray-50/50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <span className="font-mono text-sm font-bold text-gray-900">
                        #{order.id.slice(0, 8).toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{order.profiles?.name || '—'}</p>
                        <p className="text-xs text-gray-500 truncate max-w-[160px]">{order.profiles?.email}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-700 font-medium">
                        {order.order_items?.length || 0} item(s)
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-bold text-gray-900">{formatPrice(order.total_price)}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1.5 rounded-full text-xs font-bold capitalize ${ORDER_STATUS_COLORS[order.status]}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-500">{formatDate(order.created_at)}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="relative">
                        <select
                          value={order.status}
                          onChange={e => updateStatus(order.id, e.target.value)}
                          disabled={updatingId === order.id}
                          className="appearance-none pl-3 pr-8 py-2 text-xs font-semibold rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer disabled:opacity-50"
                        >
                          {ALL_STATUSES.slice(1).map(s => (
                            <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                          ))}
                        </select>
                        <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-400 pointer-events-none" />
                      </div>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
