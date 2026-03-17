// components/home/BrandsSection.tsx
'use client';
import { motion } from 'framer-motion';

const BRANDS = ['FIFA', 'BWF', 'ICC', 'ITF', 'FIBA', 'FIVB', 'IBA', 'World Athletics'];

export default function BrandsSection() {
  return (
    <section className="py-12 bg-white border-t border-gray-100">
      <div className="container-custom">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center text-gray-400 text-sm font-medium uppercase tracking-widest mb-8"
        >
          Certified & Approved By
        </motion.p>
        <div className="flex flex-wrap items-center justify-center gap-8">
          {BRANDS.map((brand, i) => (
            <motion.div
              key={brand}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="px-6 py-3 bg-gray-50 rounded-2xl border border-gray-100 font-display font-bold text-xl text-gray-300 hover:text-blue-400 hover:border-blue-200 transition-colors cursor-default"
            >
              {brand}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
