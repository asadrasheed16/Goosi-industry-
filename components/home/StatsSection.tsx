// components/home/StatsSection.tsx
'use client';
import { motion } from 'framer-motion';
import { Trophy, Globe, Users, Package } from 'lucide-react';

const STATS = [
  { icon: Trophy, value: '50K+', label: 'Happy Athletes', color: 'text-yellow-600', bg: 'bg-yellow-50' },
  { icon: Globe, value: '30+', label: 'Countries Exported', color: 'text-blue-600', bg: 'bg-blue-50' },
  { icon: Package, value: '500+', label: 'Products Available', color: 'text-green-600', bg: 'bg-green-50' },
  { icon: Users, value: '15+', label: 'Years Experience', color: 'text-purple-600', bg: 'bg-purple-50' },
];

export default function StatsSection() {
  return (
    <section className="py-12 bg-white border-b border-gray-100">
      <div className="container-custom">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {STATS.map(({ icon: Icon, value, label, color, bg }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="flex items-center gap-4"
            >
              <div className={`w-12 h-12 rounded-2xl ${bg} flex items-center justify-center shrink-0`}>
                <Icon className={`w-6 h-6 ${color}`} />
              </div>
              <div>
                <p className={`font-display font-extrabold text-2xl ${color}`}>{value}</p>
                <p className="text-gray-500 text-sm">{label}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
