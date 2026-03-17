// app/bulk/page.tsx
'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Package, Globe, CheckCircle, Loader2, Upload, ArrowRight, Phone, Mail, Building2 } from 'lucide-react';
import { submitBulkInquiry } from '@/lib/actions';
import { CATEGORIES } from '@/lib/utils';
import toast from 'react-hot-toast';

export default function BulkOrdersPage() {
  const [form, setForm] = useState({
    name: '', email: '', company: '', phone: '', country: '',
    product_type: '', quantity: '', message: '',
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await submitBulkInquiry({
        ...form,
        quantity: parseInt(form.quantity),
      });
      setSubmitted(true);
      toast.success('Inquiry submitted! We\'ll contact you within 24 hours.');
    } catch (err: any) {
      toast.error(err.message || 'Submission failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const set = (key: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm(f => ({ ...f, [key]: e.target.value }));

  const BENEFITS = [
    { icon: '📦', title: 'Low MOQ', desc: 'Starting from just 50 units per product' },
    { icon: '💰', title: 'Bulk Discounts', desc: 'Up to 40% off retail price for large orders' },
    { icon: '🎨', title: 'Custom Branding', desc: 'Your logo on all products, custom packaging' },
    { icon: '🌍', title: 'Global Shipping', desc: 'Reliable shipping to 30+ countries' },
    { icon: '✅', title: 'Quality Certified', desc: 'ISO 9001:2015 certified manufacturing' },
    { icon: '🤝', title: 'Dedicated Support', desc: 'Personal export manager for your account' },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <div className="relative bg-gradient-to-br from-blue-950 to-indigo-900 py-24 overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
          backgroundSize: '40px 40px',
        }} />
        <div className="container-custom relative z-10 text-center text-white">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
            <div className="inline-flex items-center gap-2 bg-blue-500/20 border border-blue-400/30 rounded-full px-4 py-2 mb-6">
              <Globe className="w-4 h-4 text-blue-300" />
              <span className="text-blue-200 text-sm font-medium">B2B Export Program</span>
            </div>
            <h1 className="font-display font-extrabold text-5xl lg:text-6xl mb-6">
              Bulk Order <span className="text-blue-300">Inquiry</span>
            </h1>
            <p className="text-blue-200 text-xl max-w-2xl mx-auto">
              Partner with Pakistan's leading sports equipment manufacturer. Get premium gear at wholesale prices with custom branding options.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Benefits */}
      <div className="py-16 bg-gray-50">
        <div className="container-custom">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {BENEFITS.map((b, i) => (
              <motion.div
                key={b.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <div className="text-4xl mb-3">{b.icon}</div>
                <h3 className="font-bold text-gray-900 text-sm mb-1">{b.title}</h3>
                <p className="text-gray-500 text-xs">{b.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Form + Image */}
      <div className="py-16">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            {/* Form */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="font-display font-extrabold text-3xl text-gray-900 mb-2">Send Your Inquiry</h2>
              <p className="text-gray-500 mb-8">Fill the form and our export team will respond within 24 hours.</p>

              {submitted ? (
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-center py-16"
                >
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="w-10 h-10 text-green-600" />
                  </div>
                  <h3 className="font-display font-bold text-2xl text-gray-900 mb-3">Inquiry Submitted!</h3>
                  <p className="text-gray-500 max-w-sm mx-auto">
                    Our export team will review your requirements and contact you within 24 hours with a custom quote.
                  </p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name *</label>
                      <input type="text" required value={form.name} onChange={set('name')} placeholder="Ahmed Khan" className="input-field" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Email *</label>
                      <input type="email" required value={form.email} onChange={set('email')} placeholder="ahmed@company.com" className="input-field" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Company</label>
                      <input type="text" value={form.company} onChange={set('company')} placeholder="Company name" className="input-field" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Phone</label>
                      <input type="tel" value={form.phone} onChange={set('phone')} placeholder="+1 234 567 8900" className="input-field" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Country *</label>
                      <input type="text" required value={form.country} onChange={set('country')} placeholder="United Kingdom" className="input-field" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Quantity *</label>
                      <input type="number" required min={50} value={form.quantity} onChange={set('quantity')} placeholder="Min 50 units" className="input-field" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Product Category *</label>
                    <select required value={form.product_type} onChange={set('product_type')} className="input-field">
                      <option value="">Select a sport category</option>
                      {CATEGORIES.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.icon} {cat.label}</option>
                      ))}
                      <option value="mixed">Mixed / Multiple Categories</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Message / Requirements *</label>
                    <textarea
                      required
                      rows={5}
                      value={form.message}
                      onChange={set('message')}
                      placeholder="Describe your requirements: specific products, customization needs, quality standards, delivery timeline..."
                      className="input-field resize-none"
                    />
                  </div>

                  <button type="submit" disabled={loading}
                    className="w-full flex items-center justify-center gap-2 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold rounded-2xl hover:from-blue-700 hover:to-blue-800 transition-all shadow-xl shadow-blue-500/30 disabled:opacity-50"
                  >
                    {loading ? <><Loader2 className="w-5 h-5 animate-spin" /> Submitting...</> : <>Submit Inquiry <ArrowRight className="w-5 h-5" /></>}
                  </button>
                </form>
              )}
            </motion.div>

            {/* Right side info */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <div className="relative rounded-3xl overflow-hidden aspect-video">
                <Image src="https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=800&q=80" alt="Factory" fill className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-4 left-4 text-white">
                  <p className="font-display font-bold text-xl">Manufacturing Since 2008</p>
                  <p className="text-white/80 text-sm">Sialkot, Pakistan — Sports Capital</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: Building2, label: 'Our Office', value: 'Sialkot, Punjab, Pakistan' },
                  { icon: Phone, label: 'Export Line', value: '+92 300 1234567' },
                  { icon: Mail, label: 'Export Email', value: 'export@goosi-industry.com' },
                  { icon: Globe, label: 'Markets', value: '30+ Countries Worldwide' },
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} className="bg-gray-50 rounded-2xl p-4">
                    <div className="flex items-center gap-2 mb-1">
                      <Icon className="w-4 h-4 text-blue-600" />
                      <span className="text-xs font-semibold text-gray-500">{label}</span>
                    </div>
                    <p className="text-sm font-semibold text-gray-900">{value}</p>
                  </div>
                ))}
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-3xl p-6 border border-blue-100">
                <h4 className="font-display font-bold text-lg text-gray-900 mb-4">Price Tiers</h4>
                <div className="space-y-3">
                  {[
                    { range: '50-99 units', discount: '10% off', color: 'text-blue-600' },
                    { range: '100-499 units', discount: '20% off', color: 'text-purple-600' },
                    { range: '500-999 units', discount: '30% off', color: 'text-green-600' },
                    { range: '1000+ units', discount: '40% off', color: 'text-orange-600' },
                  ].map(({ range, discount, color }) => (
                    <div key={range} className="flex items-center justify-between py-2 border-b border-white/60">
                      <span className="text-sm text-gray-700">{range}</span>
                      <span className={`text-sm font-bold ${color}`}>{discount}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
