// app/cart/page.tsx
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, ArrowLeft, Tag } from 'lucide-react';
import { useCartStore } from '@/store';
import { formatPrice } from '@/lib/utils';

export default function CartPage() {
  const { items, removeItem, updateQuantity, clearCart, totalPrice, totalItems } = useCartStore();
  const total = totalPrice();
  const count = totalItems();
  const shipping = total >= 5000 ? 0 : 250;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="container-custom py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <ShoppingBag className="w-6 h-6 text-blue-600" />
              <h1 className="font-display font-extrabold text-3xl text-gray-900">Shopping Cart</h1>
              {count > 0 && (
                <span className="bg-blue-100 text-blue-700 text-sm font-bold px-3 py-1 rounded-full">
                  {count} items
                </span>
              )}
            </div>
            {items.length > 0 && (
              <button onClick={clearCart} className="text-sm text-red-500 hover:text-red-700 font-medium flex items-center gap-1.5 hover:bg-red-50 px-3 py-2 rounded-xl transition-colors">
                <Trash2 className="w-4 h-4" /> Clear Cart
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="container-custom py-8">
        {items.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-24"
          >
            <div className="w-28 h-28 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingBag className="w-14 h-14 text-gray-300" />
            </div>
            <h2 className="font-display font-extrabold text-3xl text-gray-900 mb-3">Your cart is empty</h2>
            <p className="text-gray-500 mb-8 max-w-sm mx-auto">
              Looks like you haven't added any products to your cart yet.
            </p>
            <Link href="/products" className="btn-primary inline-flex items-center gap-2 rounded-2xl px-8 py-3.5">
              <ArrowLeft className="w-4 h-4" /> Start Shopping
            </Link>
          </motion.div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Items */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                <AnimatePresence mode="popLayout">
                  {items.map((item, i) => (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className={i > 0 ? 'border-t border-gray-50' : ''}
                    >
                      <div className="flex gap-5 p-5">
                        {/* Image */}
                        <Link href={`/products/${item.product_id}`}>
                          <div className="relative w-24 h-24 rounded-2xl overflow-hidden bg-gray-50 shrink-0">
                            <Image
                              src={item.products?.images?.[0] || ''}
                              alt={item.products?.name || ''}
                              fill className="object-cover"
                              sizes="96px"
                            />
                          </div>
                        </Link>

                        {/* Details */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <p className="text-xs font-semibold text-blue-600 uppercase tracking-wider mb-1 capitalize">
                                {item.products?.category}
                              </p>
                              <Link href={`/products/${item.product_id}`}>
                                <h3 className="font-display font-bold text-gray-900 hover:text-blue-600 transition-colors line-clamp-2">
                                  {item.products?.name}
                                </h3>
                              </Link>
                              {item.products?.compare_price && (
                                <p className="text-sm text-gray-400 line-through mt-0.5">
                                  {formatPrice(item.products.compare_price)}
                                </p>
                              )}
                            </div>
                            <button
                              onClick={() => removeItem(item.product_id)}
                              className="p-2 rounded-xl hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors shrink-0"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>

                          <div className="flex items-center justify-between mt-4">
                            {/* Quantity */}
                            <div className="flex items-center gap-3 bg-gray-50 rounded-2xl p-1">
                              <button
                                onClick={() => updateQuantity(item.product_id, item.quantity - 1)}
                                className="w-8 h-8 rounded-xl bg-white border border-gray-200 flex items-center justify-center hover:border-blue-400 transition-colors shadow-sm"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="w-8 text-center font-bold text-gray-900">{item.quantity}</span>
                              <button
                                onClick={() => updateQuantity(item.product_id, item.quantity + 1)}
                                className="w-8 h-8 rounded-xl bg-white border border-gray-200 flex items-center justify-center hover:border-blue-400 transition-colors shadow-sm"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>

                            <div className="text-right">
                              <p className="font-bold text-xl text-gray-900">
                                {formatPrice((item.products?.price || 0) * item.quantity)}
                              </p>
                              <p className="text-xs text-gray-400">
                                {formatPrice(item.products?.price || 0)} each
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              <Link href="/products" className="flex items-center gap-2 text-blue-600 font-semibold text-sm mt-4 hover:gap-3 transition-all">
                <ArrowLeft className="w-4 h-4" /> Continue Shopping
              </Link>
            </div>

            {/* Summary */}
            <div>
              <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 sticky top-20 space-y-5">
                <h2 className="font-display font-bold text-xl text-gray-900">Order Summary</h2>

                {/* Promo */}
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Promo code"
                      className="input-field pl-9 text-sm py-2.5"
                    />
                  </div>
                  <button className="px-4 py-2.5 bg-gray-900 text-white text-sm font-bold rounded-xl hover:bg-gray-800 transition-colors">
                    Apply
                  </button>
                </div>

                {/* Price breakdown */}
                <div className="space-y-3 pt-4 border-t border-gray-100">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Subtotal ({count} items)</span>
                    <span className="font-medium">{formatPrice(total)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Shipping</span>
                    <span className={shipping === 0 ? 'text-green-600 font-semibold' : 'font-medium'}>
                      {shipping === 0 ? '🎉 Free' : formatPrice(shipping)}
                    </span>
                  </div>
                  {shipping > 0 && (
                    <p className="text-xs text-blue-600 bg-blue-50 rounded-xl p-2.5">
                      Add {formatPrice(5000 - total)} more for free shipping!
                    </p>
                  )}
                  <div className="flex justify-between font-bold text-lg text-gray-900 pt-3 border-t border-gray-100">
                    <span>Total</span>
                    <span>{formatPrice(total + shipping)}</span>
                  </div>
                </div>

                <Link
                  href="/checkout"
                  className="flex items-center justify-center gap-2 w-full py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold rounded-2xl hover:from-blue-700 hover:to-blue-800 transition-all shadow-xl shadow-blue-500/30"
                >
                  Proceed to Checkout <ArrowRight className="w-5 h-5" />
                </Link>

                <div className="flex items-center justify-center gap-4 text-xs text-gray-400 pt-2">
                  {['Visa', 'Mastercard', 'JazzCash', 'COD'].map(m => (
                    <span key={m} className="bg-gray-50 px-2 py-1 rounded-lg border border-gray-100">{m}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
