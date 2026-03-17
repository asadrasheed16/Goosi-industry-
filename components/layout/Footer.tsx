// components/layout/Footer.tsx
import Link from 'next/link';
import { Globe, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Youtube, Trophy } from 'lucide-react';
import { CATEGORIES } from '@/lib/utils';

export default function Footer() {
  return (
    <footer className="bg-gray-950 text-gray-400">
      {/* Main Footer */}
      <div className="container-custom py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
                <span className="text-white font-bold text-sm">G</span>
              </div>
              <span className="font-display font-bold text-xl text-white">Goosi Industry</span>
            </div>
            <p className="text-sm leading-relaxed mb-6">
              Pakistan's premier sports equipment manufacturer and global exporter. Trusted by athletes and teams in 30+ countries.
            </p>
            <div className="flex gap-3">
              {[Facebook, Twitter, Instagram, Youtube].map((Icon, i) => (
                <a key={i} href="#" className="w-9 h-9 bg-gray-800 hover:bg-blue-600 rounded-xl flex items-center justify-center transition-colors">
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Products */}
          <div>
            <h4 className="font-display font-bold text-white text-lg mb-4">Categories</h4>
            <ul className="space-y-2">
              {CATEGORIES.slice(0, 6).map(cat => (
                <li key={cat.id}>
                  <Link href={`/products?category=${cat.id}`} className="text-sm hover:text-white transition-colors flex items-center gap-2">
                    <span>{cat.icon}</span> {cat.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display font-bold text-white text-lg mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {[
                { label: 'About Us', href: '/#about' },
                { label: 'Bulk Orders', href: '/bulk' },
                { label: 'Export Inquiry', href: '/bulk' },
                { label: 'Track Order', href: '/dashboard' },
                { label: 'Privacy Policy', href: '#' },
                { label: 'Terms of Service', href: '#' },
              ].map(link => (
                <li key={link.label}>
                  <Link href={link.href} className="text-sm hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display font-bold text-white text-lg mb-4">Contact Us</h4>
            <ul className="space-y-3">
              {[
                { icon: MapPin, text: 'Sialkot, Punjab, Pakistan' },
                { icon: Phone, text: '+92 300 1234567' },
                { icon: Mail, text: 'info@goosi-industry.com' },
                { icon: Globe, text: 'www.goosi-industry.com' },
              ].map(({ icon: Icon, text }) => (
                <li key={text} className="flex items-start gap-3 text-sm">
                  <Icon className="w-4 h-4 mt-0.5 text-blue-400 shrink-0" />
                  {text}
                </li>
              ))}
            </ul>
            <div className="mt-6 p-4 bg-gray-900 rounded-2xl">
              <div className="flex items-center gap-2 mb-2">
                <Trophy className="w-4 h-4 text-yellow-400" />
                <span className="text-white text-sm font-semibold">Export Certifications</span>
              </div>
              <p className="text-xs">ISO 9001:2015 Certified · FIFA Approved Partner · World Athletics Supplier</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="container-custom py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs">© 2025 Goosi Industry. All rights reserved.</p>
          <div className="flex items-center gap-4 text-xs">
            {['Visa', 'Mastercard', 'JazzCash', 'EasyPaisa', 'COD'].map(method => (
              <span key={method} className="bg-gray-800 px-2 py-1 rounded">{method}</span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
