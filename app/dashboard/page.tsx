// app/dashboard/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Package, Heart, User, LogOut, ShoppingBag, TrendingUp,
  Edit2, CheckCircle, Clock, Truck, XCircle, ChevronRight
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useAuthStore, useUIStore } from '@/store';
import { formatPrice, formatDate, ORDER_STATUS_COLORS } from '@/lib/utils';
import { Order } from '@/types';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

const STATUS_ICONS: Record<string, any> = {
  pending: Clock,
  confirmed: CheckCircle,
  processing: TrendingUp,
  shipped: Truck,
  delivered: CheckCircle,
  cancelled: XCircle,
};

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<'orders' | 'wishlist' | 'profile'>('orders');
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuthStore();
  const { wishlist } = useUIStore();
  const router = useRouter();

  useEffect(() => {
    if (!user) { router.push('/auth/login'); return; }
    fetchOrders();
  }, [user]);

  const fetchOrders = async () => {
    try {
      const supabase = createClient();
      const { data } = await supabase
        .from('orders')
        .select('*, order_items(*, products(*))')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });
      setOrders(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    toast.success('Signed out!');
    router.push('/');
  };

  const totalSpent = orders.filter(o => o.status === 'delivered').reduce((sum, o) => sum + o.total_price, 0);

  if (!user) return null;

  const TABS = [
    { id: 'orders', label: 'My Orders', icon: Package, count: orders.length },
    { id: 'wishlist', label: 'Wishlist', icon: Heart, count: wishlist.length },
    { id: 'profile', label: 'Profile', icon: User },
  ] as const;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 pt-12 pb-24">
        <div className="container-custom">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center text-white font-bold text-2xl font-display">
                {user.name?.[0]?.toUpperCase()}
              </div>
              <div className="text-white">
                <h1 className="font-display font-extrabold text-2xl">{user.name}</h1>
                <p className="text-blue-200 text-sm">{user.email}</p>
              </div>
            </div>
            <button onClick={handleSignOut} className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-sm font-medium transition-colors">
              <LogOut className="w-4 h-4" /> Sign Out
            </button>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-4 mt-8">
            {[
              { label: 'Total Orders', value: orders.length },
              { label: 'Total Spent', value: formatPrice(totalSpent) },
              { label: 'Wishlist Items', value: wishlist.length },
            ].map(({ label, value }) => (
              <div key={label} className="bg-white/10 backdrop-blur rounded-2xl p-4 text-white text-center">
                <p className="font-display font-extrabold text-2xl">{value}</p>
                <p className="text-blue-200 text-xs mt-1">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container-custom -mt-12 pb-16">
        <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 overflow-hidden">
          {/* Tab nav */}
          <div className="flex border-b border-gray-100 overflow-x-auto">
            {TABS.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-4 font-semibold text-sm whitespace-nowrap border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-600 text-blue-600 bg-blue-50/50'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
                {'count' in tab && tab.count !== undefined && (
                  <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                    activeTab === tab.id ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-500'
                  }`}>{tab.count}</span>
                )}
              </button>
            ))}
          </div>

          <div className="p-6">
            {/* Orders Tab */}
            {activeTab === 'orders' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                {loading ? (
                  <div className="space-y-4">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="h-24 skeleton rounded-2xl" />
                    ))}
                  </div>
                ) : orders.length === 0 ? (
                  <div className="text-center py-16">
                    <ShoppingBag className="w-16 h-16 text-gray-200 mx-auto mb-4" />
                    <h3 className="font-display font-bold text-xl text-gray-900 mb-2">No orders yet</h3>
                    <p className="text-gray-500 mb-6">Start shopping to see your orders here</p>
                    <Link href="/products" className="btn-primary inline-flex rounded-2xl px-6 py-3 text-sm">Browse Products</Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map(order => {
                      const StatusIcon = STATUS_ICONS[order.status] || Clock;
                      return (
                        <motion.div
                          key={order.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="border border-gray-100 rounded-2xl p-5 hover:border-blue-200 transition-colors"
                        >
                          <div className="flex items-center justify-between mb-4">
                            <div>
                              <p className="font-semibold text-gray-900 text-sm">Order #{order.id.slice(0, 8).toUpperCase()}</p>
                              <p className="text-gray-500 text-xs mt-0.5">{formatDate(order.created_at)}</p>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold ${ORDER_STATUS_COLORS[order.status]}`}>
                                <StatusIcon className="w-3 h-3" />
                                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                              </span>
                              <span className="font-bold text-gray-900">{formatPrice(order.total_price)}</span>
                            </div>
                          </div>
                          {order.order_items && (
                            <div className="flex gap-2 overflow-x-auto">
                              {order.order_items.slice(0, 4).map((item: any) => (
                                <div key={item.id} className="relative w-14 h-14 rounded-xl overflow-hidden bg-gray-100 shrink-0">
                                  {item.products?.images?.[0] && (
                                    <Image src={item.products.images[0]} alt="" fill className="object-cover" sizes="56px" />
                                  )}
                                </div>
                              ))}
                              {order.order_items.length > 4 && (
                                <div className="w-14 h-14 rounded-xl bg-gray-100 flex items-center justify-center text-xs text-gray-500 font-bold shrink-0">
                                  +{order.order_items.length - 4}
                                </div>
                              )}
                            </div>
                          )}
                        </motion.div>
                      );
                    })}
                  </div>
                )}
              </motion.div>
            )}

            {/* Wishlist Tab */}
            {activeTab === 'wishlist' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                {wishlist.length === 0 ? (
                  <div className="text-center py-16">
                    <Heart className="w-16 h-16 text-gray-200 mx-auto mb-4" />
                    <h3 className="font-display font-bold text-xl text-gray-900 mb-2">No saved items</h3>
                    <p className="text-gray-500 mb-6">Heart products to save them here</p>
                    <Link href="/products" className="btn-primary inline-flex rounded-2xl px-6 py-3 text-sm">Browse Products</Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {wishlist.map(id => (
                      <Link key={id} href={`/products/${id}`}
                        className="border border-gray-100 rounded-2xl p-4 hover:border-blue-200 transition-colors text-center"
                      >
                        <div className="w-full aspect-square bg-gray-100 rounded-xl mb-3 flex items-center justify-center">
                          <Heart className="w-8 h-8 text-gray-300" />
                        </div>
                        <p className="text-xs text-gray-500 font-mono truncate">{id.slice(0, 8)}...</p>
                        <ChevronRight className="w-4 h-4 text-blue-400 mx-auto mt-2" />
                      </Link>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-lg">
                <div className="space-y-5">
                  {[
                    { label: 'Full Name', value: user.name },
                    { label: 'Email Address', value: user.email },
                    { label: 'Account Type', value: user.role },
                    { label: 'Member Since', value: user.created_at ? formatDate(user.created_at) : 'N/A' },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex items-center justify-between py-4 border-b border-gray-100">
                      <div>
                        <p className="text-xs text-gray-400 uppercase tracking-wider mb-0.5">{label}</p>
                        <p className="font-semibold text-gray-900 capitalize">{value}</p>
                      </div>
                      <button className="p-2 rounded-xl hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors">
                        <Edit2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
