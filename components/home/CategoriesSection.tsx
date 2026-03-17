// components/home/CategoriesSection.tsx
'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { CATEGORIES } from '@/lib/utils';

const CATEGORY_IMAGES: Record<string, string> = {
  cricket: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=400&q=80',
  football: 'https://images.unsplash.com/photo-1575361204480-aadea25e6e68?w=400&q=80',
  boxing: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=400&q=80',
  badminton: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=400&q=80',
  tennis: 'https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?w=400&q=80',
  fitness: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&q=80',
  swimming: 'https://images.unsplash.com/photo-1530549387789-4c1017266635?w=400&q=80',
  running: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80',
  basketball: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=400&q=80',
  volleyball: 'https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?w=400&q=80',
};

export default function CategoriesSection() {
  return (
    <section className="section-padding bg-gray-50">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex items-end justify-between mb-10"
        >
          <div>
            <p className="text-blue-600 font-semibold text-sm uppercase tracking-wider mb-2">Browse By Sport</p>
            <h2 className="font-display font-extrabold text-4xl lg:text-5xl text-gray-900">
              Shop <span className="gradient-text">Categories</span>
            </h2>
          </div>
          <Link href="/products" className="hidden md:flex items-center gap-2 text-blue-600 font-semibold hover:gap-3 transition-all">
            All Products <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {CATEGORIES.map((cat, i) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
            >
              <Link href={`/products?category=${cat.id}`}>
                <div className="group relative rounded-3xl overflow-hidden aspect-[4/5] bg-gray-200 cursor-pointer">
                  <img
                    src={CATEGORY_IMAGES[cat.id]}
                    alt={cat.label}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-t ${cat.color} opacity-60 group-hover:opacity-70 transition-opacity`} />
                  <div className="absolute inset-0 flex flex-col items-center justify-end p-4">
                    <span className="text-3xl mb-1">{cat.icon}</span>
                    <p className="text-white font-display font-bold text-lg leading-tight text-center">{cat.label}</p>
                  </div>
                  <div className="absolute top-3 right-3 w-7 h-7 bg-white/20 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all group-hover:-translate-x-0.5">
                    <ArrowRight className="w-3.5 h-3.5 text-white" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
