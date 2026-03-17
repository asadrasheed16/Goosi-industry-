// components/layout/Navbar.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShoppingCart, Search, User, Menu, X, Heart, Package,
  ChevronDown, LogOut, LayoutDashboard, Settings, Globe,
  Trophy, Zap,
} from 'lucide-react';
import { useCartStore, useAuthStore, useUIStore } from '@/store';
import { createClient } from '@/lib/supabase/client';
import { CATEGORIES } from '@/lib/utils';
import toast from 'react-hot-toast';

const NAV_LINKS = [
  { href: '/products', label: 'Products' },
  { href: '/bulk', label: 'Bulk Orders' },
  { href: '/#about', label: 'About' },
  { href: '/#contact', label: 'Contact' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [showCategories, setShowCategories] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchVal, setSearchVal] = useState('');

  const pathname = usePathname();
  const router = useRouter();
  const { totalItems, toggleCart } = useCartStore();
  const { user, isAdmin } = useAuthStore();
  const { setSearchQuery } = useUIStore();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setMobileOpen(false); }, [pathname]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchVal.trim()) {
      setSearchQuery(searchVal);
      router.push(`/products?search=${encodeURIComponent(searchVal)}`);
      setSearchOpen(false);
    }
  };

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    toast.success('Signed out successfully');
    router.push('/');
    setShowUserMenu(false);
  };

  const itemCount = totalItems();

  return (
    <>
      {/* Announcement Bar */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white text-xs font-medium py-2 overflow-hidden">
        <div className="marquee-track flex gap-12 whitespace-nowrap">
          {[...Array(4)].map((_, i) => (
            <span key={i} className="flex items-center gap-8 shrink-0">
              <span className="flex items-center gap-2"><Trophy className="w-3 h-3" /> Free shipping on orders over PKR 5,000</span>
              <span className="flex items-center gap-2"><Globe className="w-3 h-3" /> Export to 30+ countries worldwide</span>
              <span className="flex items-center gap-2"><Zap className="w-3 h-3" /> Bulk discounts up to 40% off</span>
              <span className="flex items-center gap-2"><Package className="w-3 h-3" /> 100% authentic sports gear guaranteed</span>
            </span>
          ))}
        </div>
      </div>

      {/* Main Navbar */}
      <motion.nav
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-white/95 backdrop-blur-xl shadow-lg shadow-gray-200/50'
            : 'bg-white border-b border-gray-100'
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      >
        <div className="container-custom">
          <div className="flex items-center justify-between h-16 gap-4">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 shrink-0">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
                <span className="text-white font-bold text-sm font-display">G</span>
              </div>
              <span className="font-display font-bold text-xl text-gray-900 hidden sm:block">
                Goosi <span className="gradient-text">Industry</span>
              </span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden lg:flex items-center gap-1">
              {/* Products with dropdown */}
              <div
                className="relative"
                onMouseEnter={() => setShowCategories(true)}
                onMouseLeave={() => setShowCategories(false)}
              >
                <button className={`flex items-center gap-1 px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                  pathname === '/products' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}>
                  Products <ChevronDown className="w-3 h-3" />
                </button>
                <AnimatePresence>
                  {showCategories && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute top-full left-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-gray-100 p-3 grid grid-cols-2 gap-1"
                    >
                      {CATEGORIES.map(cat => (
                        <Link
                          key={cat.id}
                          href={`/products?category=${cat.id}`}
                          className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-gray-50 text-sm text-gray-600 hover:text-gray-900 transition-colors"
                        >
                          <span>{cat.icon}</span>
                          <span>{cat.label}</span>
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {NAV_LINKS.slice(1).map(link => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                    pathname === link.href
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  {link.label}
                </Link>
              ))}

              {isAdmin() && (
                <Link
                  href="/admin"
                  className="px-4 py-2 rounded-xl text-sm font-medium text-purple-600 bg-purple-50 hover:bg-purple-100 transition-colors"
                >
                  Admin
                </Link>
              )}
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-2">
              {/* Search */}
              <button
                onClick={() => setSearchOpen(true)}
                className="p-2 rounded-xl text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Wishlist */}
              <Link href="/dashboard" className="p-2 rounded-xl text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors hidden sm:flex">
                <Heart className="w-5 h-5" />
              </Link>

              {/* Cart */}
              <button
                onClick={toggleCart}
                className="relative p-2 rounded-xl text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
              >
                <ShoppingCart className="w-5 h-5" />
                {itemCount > 0 && (
                  <motion.span
                    key={itemCount}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 w-5 h-5 bg-blue-600 text-white text-xs rounded-full flex items-center justify-center font-bold"
                  >
                    {itemCount > 9 ? '9+' : itemCount}
                  </motion.span>
                )}
              </button>

              {/* User */}
              {user ? (
                <div className="relative hidden sm:block">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center gap-2 p-2 rounded-xl hover:bg-gray-100 transition-colors"
                  >
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                      <span className="text-white text-xs font-bold">
                        {user.name?.[0]?.toUpperCase() || 'U'}
                      </span>
                    </div>
                  </button>
                  <AnimatePresence>
                    {showUserMenu && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute right-0 top-full mt-2 w-52 bg-white rounded-2xl shadow-2xl border border-gray-100 p-2"
                      >
                        <div className="px-3 py-2 border-b border-gray-100 mb-1">
                          <p className="font-semibold text-sm text-gray-900">{user.name}</p>
                          <p className="text-xs text-gray-500 truncate">{user.email}</p>
                        </div>
                        {[
                          { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
                          { href: '/dashboard', icon: Package, label: 'My Orders' },
                          { href: '/dashboard', icon: Settings, label: 'Settings' },
                        ].map(item => (
                          <Link
                            key={item.label}
                            href={item.href}
                            onClick={() => setShowUserMenu(false)}
                            className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors"
                          >
                            <item.icon className="w-4 h-4" />
                            {item.label}
                          </Link>
                        ))}
                        <button
                          onClick={handleSignOut}
                          className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-red-600 hover:bg-red-50 transition-colors w-full mt-1 border-t border-gray-100 pt-2"
                        >
                          <LogOut className="w-4 h-4" /> Sign Out
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Link
                  href="/auth/login"
                  className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors"
                >
                  <User className="w-4 h-4" /> Sign In
                </Link>
              )}

              {/* Mobile Menu */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="lg:hidden p-2 rounded-xl text-gray-600 hover:bg-gray-100 transition-colors"
              >
                {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden border-t border-gray-100 bg-white overflow-hidden"
            >
              <div className="container-custom py-4 space-y-1">
                {NAV_LINKS.map(link => (
                  <Link key={link.href} href={link.href}
                    className="block px-4 py-3 rounded-xl text-gray-600 hover:text-gray-900 hover:bg-gray-50 font-medium transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
                <div className="pt-2 border-t border-gray-100">
                  <p className="px-4 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">Categories</p>
                  <div className="grid grid-cols-2 gap-1">
                    {CATEGORIES.map(cat => (
                      <Link key={cat.id} href={`/products?category=${cat.id}`}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm text-gray-600 hover:bg-gray-50"
                      >
                        {cat.icon} {cat.label}
                      </Link>
                    ))}
                  </div>
                </div>
                {!user && (
                  <div className="pt-2 border-t border-gray-100 flex gap-2">
                    <Link href="/auth/login" className="flex-1 btn-primary text-center text-sm py-2">Sign In</Link>
                    <Link href="/auth/register" className="flex-1 btn-secondary text-center text-sm py-2">Register</Link>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Search Modal */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-start justify-center pt-20 px-4"
            onClick={(e) => e.target === e.currentTarget && setSearchOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: -20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: -20 }}
              className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden"
            >
              <form onSubmit={handleSearch} className="flex items-center gap-3 p-4">
                <Search className="w-5 h-5 text-gray-400 shrink-0" />
                <input
                  autoFocus
                  type="text"
                  value={searchVal}
                  onChange={e => setSearchVal(e.target.value)}
                  placeholder="Search cricket bats, football, boxing gloves..."
                  className="flex-1 text-lg outline-none text-gray-900 placeholder:text-gray-400"
                />
                <button type="button" onClick={() => setSearchOpen(false)}>
                  <X className="w-5 h-5 text-gray-400 hover:text-gray-600" />
                </button>
              </form>
              <div className="border-t border-gray-100 p-4">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Popular Searches</p>
                <div className="flex flex-wrap gap-2">
                  {['Cricket Bat', 'Football', 'Boxing Gloves', 'Running Shoes', 'Dumbbells'].map(term => (
                    <button
                      key={term}
                      onClick={() => {
                        setSearchQuery(term);
                        router.push(`/products?search=${encodeURIComponent(term)}`);
                        setSearchOpen(false);
                      }}
                      className="px-3 py-1.5 bg-gray-100 hover:bg-blue-50 hover:text-blue-600 rounded-full text-sm text-gray-600 transition-colors"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
