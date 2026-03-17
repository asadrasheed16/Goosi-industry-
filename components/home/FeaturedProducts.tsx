// components/home/FeaturedProducts.tsx
'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import ProductCard from '@/components/products/ProductCard';
import { Product } from '@/types';

export default function FeaturedProducts({ products }: { products: Product[] }) {
  return (
    <section className="section-padding bg-white">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex items-end justify-between mb-10"
        >
          <div>
            <p className="text-green-600 font-semibold text-sm uppercase tracking-wider mb-2">Handpicked for You</p>
            <h2 className="font-display font-extrabold text-4xl lg:text-5xl text-gray-900">
              Featured <span className="gradient-text-green">Products</span>
            </h2>
          </div>
          <Link href="/products" className="hidden md:flex items-center gap-2 text-blue-600 font-semibold hover:gap-3 transition-all">
            View All <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.slice(0, 8).map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} />
          ))}
        </div>

        <div className="text-center mt-10">
          <Link href="/products" className="btn-primary inline-flex items-center gap-2 rounded-2xl px-8 py-3.5">
            Browse All Products <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
