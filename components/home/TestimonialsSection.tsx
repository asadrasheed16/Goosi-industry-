// components/home/TestimonialsSection.tsx
'use client';
import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';

const TESTIMONIALS = [
  {
    name: 'Ahmed Al-Rasheed',
    role: 'Sports Retailer, Dubai',
    avatar: 'A',
    color: 'from-blue-500 to-blue-700',
    text: 'Goosi Industry has been our go-to supplier for 5 years. The quality of cricket equipment is unmatched. Our customers love the bats!',
    rating: 5,
  },
  {
    name: 'James Mitchell',
    role: 'Football Club Manager, UK',
    avatar: 'J',
    color: 'from-green-500 to-emerald-700',
    text: 'Excellent quality footballs and training gear. The bulk pricing is very competitive and delivery was faster than expected.',
    rating: 5,
  },
  {
    name: 'Priya Sharma',
    role: 'Sports Academy Owner, India',
    avatar: 'P',
    color: 'from-purple-500 to-purple-700',
    text: 'We switched to Goosi Industry for all our badminton equipment. Students love the quality. Highly recommend for bulk orders!',
    rating: 5,
  },
  {
    name: 'Carlos Mendez',
    role: 'Boxing Coach, USA',
    avatar: 'C',
    color: 'from-orange-500 to-red-600',
    text: 'The boxing gloves are professional grade. We\'ve outfitted our entire gym with Goosi equipment. Outstanding durability.',
    rating: 5,
  },
];

export default function TestimonialsSection() {
  return (
    <section className="section-padding bg-gray-50">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <p className="text-purple-600 font-semibold text-sm uppercase tracking-wider mb-2">What Clients Say</p>
          <h2 className="font-display font-extrabold text-4xl lg:text-5xl text-gray-900">
            Trusted by <span className="gradient-text">Champions</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {TESTIMONIALS.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-shadow"
            >
              <Quote className="w-8 h-8 text-blue-100 mb-4" />
              <p className="text-gray-600 text-sm leading-relaxed mb-6">"{t.text}"</p>
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${t.color} flex items-center justify-center text-white font-bold text-sm`}>
                  {t.avatar}
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">{t.name}</p>
                  <p className="text-gray-500 text-xs">{t.role}</p>
                </div>
              </div>
              <div className="flex gap-0.5 mt-3">
                {[...Array(t.rating)].map((_, j) => (
                  <Star key={j} className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
