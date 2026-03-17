// components/home/ExportCTA.tsx
'use client';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Globe, Package, CheckCircle2, ArrowRight, TrendingUp } from 'lucide-react';

const EXPORT_FEATURES = [
  'MOQ from 50 units per product',
  'Custom branding & logo printing',
  'Export to 30+ countries globally',
  'ISO 9001:2015 certified quality',
  'Dedicated export manager',
  'Competitive bulk pricing',
];

export default function ExportCTA() {
  return (
    <section className="section-padding bg-gradient-to-br from-blue-950 via-blue-900 to-indigo-900 relative overflow-hidden">
      <div className="absolute inset-0 opacity-10" style={{
        backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
        backgroundSize: '40px 40px',
      }} />

      <div className="container-custom relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-2 bg-blue-500/20 border border-blue-400/30 rounded-full px-4 py-2 mb-6">
              <Globe className="w-4 h-4 text-blue-300" />
              <span className="text-blue-200 text-sm font-medium">Global Export Program</span>
            </div>
            <h2 className="font-display font-extrabold text-4xl lg:text-5xl text-white mb-6 leading-tight">
              Grow Your Business<br />
              <span className="text-blue-300">With Bulk Orders</span>
            </h2>
            <p className="text-blue-200 text-lg leading-relaxed mb-8">
              Join 500+ global distributors and retailers who trust Goosi Industry for premium sports equipment. From Sialkot to the world.
            </p>

            <ul className="space-y-3 mb-10">
              {EXPORT_FEATURES.map(feat => (
                <li key={feat} className="flex items-center gap-3 text-blue-100">
                  <CheckCircle2 className="w-5 h-5 text-green-400 shrink-0" />
                  <span className="text-sm">{feat}</span>
                </li>
              ))}
            </ul>

            <div className="flex flex-wrap gap-4">
              <Link
                href="/bulk"
                className="flex items-center gap-2 px-8 py-4 bg-white text-blue-900 font-bold rounded-2xl hover:bg-blue-50 transition-colors shadow-2xl"
              >
                <Package className="w-5 h-5" /> Get Bulk Quote
              </Link>
              <Link
                href="/products"
                className="flex items-center gap-2 px-8 py-4 border-2 border-white/30 text-white font-bold rounded-2xl hover:bg-white/10 transition-colors"
              >
                View Catalog <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="relative rounded-3xl overflow-hidden aspect-[4/3]">
              <Image
                src="https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=800&q=80"
                alt="Export"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-br from-blue-900/40 to-transparent" />
            </div>

            {/* Stats cards */}
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="absolute -top-6 -right-6 bg-white rounded-2xl p-4 shadow-2xl"
            >
              <div className="flex items-center gap-2 mb-1">
                <TrendingUp className="w-4 h-4 text-green-600" />
                <span className="text-green-600 text-xs font-bold">+40% this year</span>
              </div>
              <p className="font-display font-bold text-2xl text-gray-900">$2.4M</p>
              <p className="text-gray-500 text-xs">Export Revenue</p>
            </motion.div>

            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 5, repeat: Infinity, delay: 1 }}
              className="absolute -bottom-6 -left-6 bg-white rounded-2xl p-4 shadow-2xl"
            >
              <p className="text-gray-500 text-xs mb-1">Active Partners</p>
              <p className="font-display font-bold text-2xl text-gray-900">500+</p>
              <p className="text-xs text-blue-600 font-semibold">Across 30 countries</p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
