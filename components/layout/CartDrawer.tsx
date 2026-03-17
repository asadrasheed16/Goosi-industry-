// components/layout/CartDrawer.tsx
'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCartStore } from '@/store';
import { formatPrice } from '@/lib/utils';

export default function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, totalPrice, totalItems } = useCartStore();
  const total = totalPrice();
  const count = totalItems();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 h-full z-50 w-full max-w-md bg-white shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <ShoppingBag className="w-5 h-5 text-blue-600" />
                <h2 className="font-display font-bold text-xl text-gray-900">Your Cart</h2>
                {count > 0 && (
                  <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2 py-0.5 rounded-full">
                    {count}
                  </span>
                )}
              </div>
              <button
                onClick={closeCart}
                className="p-2 rounded-xl hover:bg-gray-100 transition-colors text-gray-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              <AnimatePresence mode="popLayout">
                {items.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center justify-center h-full text-center py-20"
                  >
                    <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                      <ShoppingBag className="w-10 h-10 text-gray-400" />
                    </div>
                    <h3 className="font-display font-bold text-xl text-gray-900 mb-2">Cart is empty</h3>
                    <p className="text-gray-500 text-sm mb-6">Add some amazing sports gear!</p>
                    <button onClick={closeCart}>
                      <Link href="/products" className="btn-primary text-sm px-6 py-2.5 rounded-xl">
                        Browse Products
                      </Link>
                    </button>
                  </motion.div>
                ) : (
                  items.map(item => (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="flex gap-4 p-4 bg-gray-50 rounded-2xl"
                    >
                      {/* Image */}
                      <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-white shrink-0">
                        <Image
                          src={item.products?.images?.[0] || 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=200'}
                          alt={item.products?.name || ''}
                          fill
                          className="object-cover"
                        />
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-sm text-gray-900 truncate">
                          {item.products?.name}
                        </h4>
                        <p className="text-xs text-gray-500 capitalize mt-0.5">{item.products?.category}</p>
                        <p className="font-bold text-blue-600 mt-1">
                          {formatPrice(item.products?.price || 0)}
                        </p>

                        {/* Quantity Controls */}
                        <div className="flex items-center gap-2 mt-2">
                          <button
                            onClick={() => updateQuantity(item.product_id, item.quantity - 1)}
                            className="w-7 h-7 rounded-lg bg-white border border-gray-200 flex items-center justify-center hover:border-blue-400 transition-colors"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-sm font-semibold w-6 text-center">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.product_id, item.quantity + 1)}
                            className="w-7 h-7 rounded-lg bg-white border border-gray-200 flex items-center justify-center hover:border-blue-400 transition-colors"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => removeItem(item.product_id)}
                            className="ml-auto p-1.5 rounded-lg text-red-400 hover:bg-red-50 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="p-6 border-t border-gray-100 space-y-4 bg-white">
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span>Subtotal</span>
                  <span>{formatPrice(total)}</span>
                </div>
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span>Shipping</span>
                  <span className={total >= 5000 ? 'text-green-600 font-medium' : ''}>
                    {total >= 5000 ? 'Free' : formatPrice(250)}
                  </span>
                </div>
                <div className="flex items-center justify-between font-bold text-lg text-gray-900 pt-2 border-t border-gray-100">
                  <span>Total</span>
                  <span>{formatPrice(total >= 5000 ? total : total + 250)}</span>
                </div>
                {total < 5000 && (
                  <p className="text-xs text-center text-blue-600 bg-blue-50 rounded-xl p-2">
                    Add {formatPrice(5000 - total)} more for free shipping!
                  </p>
                )}
                <Link
                  href="/checkout"
                  onClick={closeCart}
                  className="flex items-center justify-center gap-2 w-full py-3.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg shadow-blue-500/30"
                >
                  Checkout <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/cart"
                  onClick={closeCart}
                  className="flex items-center justify-center w-full py-2.5 text-gray-600 text-sm hover:text-gray-900 transition-colors"
                >
                  View full cart
                </Link>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
