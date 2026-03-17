// app/admin/inquiries/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Globe, Mail, Phone, Package, ChevronDown, RefreshCw } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { formatDate } from '@/lib/utils';
import { BulkInquiry } from '@/types';
import toast from 'react-hot-toast';

const STATUS_COLORS = {
  new: 'bg-blue-100 text-blue-800',
  contacted: 'bg-yellow-100 text-yellow-800',
  quoted: 'bg-purple-100 text-purple-800',
  closed: 'bg-green-100 text-green-800',
};

export default function AdminInquiriesPage() {
  const [inquiries, setInquiries] = useState<BulkInquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => { loadInquiries(); }, []);

  const loadInquiries = async () => {
    setLoading(true);
    try {
      const supabase = createClient();
      const { data } = await supabase.from('bulk_inquiries').select('*').order('created_at', { ascending: false });
      setInquiries(data || []);
    } catch { toast.error('Failed to load inquiries'); }
    finally { setLoading(false); }
  };

  const updateStatus = async (id: string, status: string) => {
    try {
      const supabase = createClient();
      await supabase.from('bulk_inquiries').update({ status }).eq('id', id);
      setInquiries(i => i.map(inq => inq.id === id ? { ...inq, status: status as any } : inq));
      toast.success('Status updated');
    } catch { toast.error('Update failed'); }
  };

  const filtered = filter === 'all' ? inquiries : inquiries.filter(i => i.status === filter);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display font-extrabold text-3xl text-gray-900">Bulk Inquiries</h1>
          <p className="text-gray-500 mt-1">{inquiries.length} total inquiries</p>
        </div>
        <button onClick={loadInquiries} className="flex items-center gap-2 text-sm font-medium text-gray-600 px-4 py-2 rounded-xl border border-gray-200 hover:bg-gray-50">
          <RefreshCw className="w-4 h-4" /> Refresh
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        {['new', 'contacted', 'quoted', 'closed'].map(s => (
          <button
            key={s}
            onClick={() => setFilter(filter === s ? 'all' : s)}
            className={`p-4 rounded-2xl border text-left transition-all ${
              filter === s ? 'border-blue-500 bg-blue-50' : 'border-gray-100 bg-white hover:border-gray-200'
            }`}
          >
            <p className="font-display font-bold text-2xl text-gray-900">
              {inquiries.filter(i => i.status === s).length}
            </p>
            <p className={`text-xs font-bold capitalize mt-1 ${STATUS_COLORS[s as keyof typeof STATUS_COLORS].split(' ')[1]}`}>
              {s}
            </p>
          </button>
        ))}
      </div>

      {/* Inquiries Cards */}
      <div className="space-y-4">
        {loading ? (
          [...Array(4)].map((_, i) => <div key={i} className="h-24 skeleton rounded-2xl" />)
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-gray-100">
            <MessageSquare className="w-12 h-12 text-gray-200 mx-auto mb-3" />
            <p className="text-gray-400">No inquiries found</p>
          </div>
        ) : (
          filtered.map(inq => (
            <motion.div
              key={inq.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden"
            >
              <div
                className="flex flex-wrap items-center gap-4 p-5 cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => setExpanded(expanded === inq.id ? null : inq.id)}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <p className="font-bold text-gray-900">{inq.name}</p>
                    {inq.company && <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">{inq.company}</span>}
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span className="flex items-center gap-1"><Mail className="w-3 h-3" />{inq.email}</span>
                    {inq.country && <span className="flex items-center gap-1"><Globe className="w-3 h-3" />{inq.country}</span>}
                    {inq.phone && <span className="flex items-center gap-1"><Phone className="w-3 h-3" />{inq.phone}</span>}
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <div className="text-center">
                    <p className="text-xs text-gray-400 mb-0.5">Product Type</p>
                    <span className="text-sm font-semibold text-gray-900 capitalize">{inq.product_type}</span>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-gray-400 mb-0.5">Quantity</p>
                    <span className="text-sm font-bold text-blue-600">{inq.quantity.toLocaleString()} units</span>
                  </div>
                  <span className={`px-3 py-1.5 rounded-full text-xs font-bold capitalize ${STATUS_COLORS[inq.status]}`}>
                    {inq.status}
                  </span>
                  <div className="relative">
                    <select
                      value={inq.status}
                      onChange={e => { e.stopPropagation(); updateStatus(inq.id, e.target.value); }}
                      onClick={e => e.stopPropagation()}
                      className="appearance-none pl-3 pr-7 py-1.5 text-xs font-medium rounded-xl border border-gray-200 bg-white focus:outline-none cursor-pointer"
                    >
                      {['new', 'contacted', 'quoted', 'closed'].map(s => (
                        <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-400 pointer-events-none" />
                  </div>
                  <p className="text-xs text-gray-400">{formatDate(inq.created_at)}</p>
                </div>
              </div>

              {/* Expanded Message */}
              {expanded === inq.id && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="border-t border-gray-100 p-5 bg-gray-50"
                >
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Message</p>
                  <p className="text-gray-700 leading-relaxed">{inq.message}</p>
                  <div className="mt-4 flex gap-3">
                    <a href={`mailto:${inq.email}`} className="btn-primary text-sm px-4 py-2 rounded-xl flex items-center gap-2">
                      <Mail className="w-4 h-4" /> Reply via Email
                    </a>
                    {inq.phone && (
                      <a href={`tel:${inq.phone}`} className="btn-secondary text-sm px-4 py-2 rounded-xl flex items-center gap-2">
                        <Phone className="w-4 h-4" /> Call
                      </a>
                    )}
                  </div>
                </motion.div>
              )}
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
