// components/home/HeroSection.tsx
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Play, Star, Truck, Shield, RotateCcw } from 'lucide-react';

const HERO_IMAGES = [
  { src: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=800&q=80', label: 'Cricket' },
  { src: 'https://images.unsplash.com/photo-1575361204480-aadea25e6e68?w=800&q=80', label: 'Football' },
  { src: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=800&q=80', label: 'Boxing' },
  { src: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80', label: 'Fitness' },
];

const TRUST_BADGES = [
  { icon: Truck, label: 'Free Shipping', sub: 'Orders over PKR 5K' },
  { icon: Shield, label: 'Authentic Gear', sub: '100% Guaranteed' },
  { icon: RotateCcw, label: 'Easy Returns', sub: '30-day policy' },
];

export default function HeroSection() {
  return (
    <section className="relative min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 overflow-hidden flex items-center">
      {/* Animated background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ scale: [1, 1.2, 1], x: [0, 30, 0], y: [0, -20, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-20 left-20 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ scale: [1.2, 1, 1.2], x: [0, -30, 0], y: [0, 20, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
          className="absolute bottom-20 right-20 w-80 h-80 bg-purple-600/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ scale: [1, 1.3, 1], y: [0, 30, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 4 }}
          className="absolute top-1/2 left-1/2 w-64 h-64 bg-green-500/10 rounded-full blur-3xl"
        />
        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-5"
          style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '40px 40px' }}
        />
      </div>

      <div className="container-custom relative z-10 py-20">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <div>
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-8"
            >
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                ))}
              </div>
              <span className="text-white/90 text-sm font-medium">Trusted by 50,000+ athletes worldwide</span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="font-display text-5xl sm:text-6xl lg:text-7xl font-extrabold text-white leading-[0.95] mb-6"
            >
              Champion
              <br />
              <span className="gradient-text">Sports</span>
              <br />
              Equipment
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-white/70 text-lg leading-relaxed mb-10 max-w-lg"
            >
              Pakistan's leading sports manufacturer. From cricket fields to boxing rings, we craft gear that champions trust — now exporting to 30+ countries.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex flex-wrap gap-4 mb-12"
            >
              <Link
                href="/products"
                className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold rounded-2xl hover:from-blue-600 hover:to-blue-700 transition-all shadow-2xl shadow-blue-500/40 hover:shadow-blue-500/60 hover:-translate-y-0.5"
              >
                Shop Now <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/bulk"
                className="flex items-center gap-2 px-8 py-4 bg-white/10 backdrop-blur-sm border border-white/30 text-white font-bold rounded-2xl hover:bg-white/20 transition-all"
              >
                <Play className="w-5 h-5" /> Bulk Orders
              </Link>
            </motion.div>

            {/* Trust badges */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="flex flex-wrap gap-6"
            >
              {TRUST_BADGES.map(({ icon: Icon, label, sub }) => (
                <div key={label} className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                    <Icon className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-white text-sm font-semibold">{label}</p>
                    <p className="text-white/50 text-xs">{sub}</p>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right: Image Grid */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="relative hidden lg:block"
          >
            <div className="grid grid-cols-2 gap-4">
              {HERO_IMAGES.map((img, i) => (
                <motion.div
                  key={img.label}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                  whileHover={{ scale: 1.03, zIndex: 10 }}
                  className={`relative rounded-3xl overflow-hidden ${i === 0 ? 'aspect-[3/4]' : i === 1 ? 'aspect-square mt-8' : i === 2 ? 'aspect-square -mt-8' : 'aspect-[3/4]'}`}
                >
                  <Image
                    src={img.src}
                    alt={img.label}
                    fill
                    className="object-cover"
                    sizes="250px"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-3 left-3">
                    <span className="text-white text-sm font-bold">{img.label}</span>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Floating card */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute -bottom-6 -left-10 glass rounded-2xl p-4 shadow-2xl"
            >
              <p className="text-xs text-gray-500 mb-1">This month</p>
              <p className="font-display font-bold text-2xl text-gray-900">2,840+</p>
              <p className="text-xs text-gray-600">Orders shipped</p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
