// components/products/ProductCard.tsx
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Heart, ShoppingCart, Star, Eye, Zap } from 'lucide-react';
import { Product } from '@/types';
import { useCartStore, useUIStore } from '@/store';
import { formatPrice, cn } from '@/lib/utils';
import toast from 'react-hot-toast';

interface ProductCardProps {
  product: Product;
  index?: number;
}

export default function ProductCard({ product, index = 0 }: ProductCardProps) {
  const { addItem } = useCartStore();
  const { toggleWishlist, isInWishlist } = useUIStore();
  const wishlisted = isInWishlist(product.id);
  const discount = product.compare_price
    ? Math.round(((product.compare_price - product.price) / product.compare_price) * 100)
    : 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product);
    toast.success(`${product.name} added to cart!`);
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product.id);
    toast.success(wishlisted ? 'Removed from wishlist' : 'Added to wishlist!');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
    >
      <Link href={`/products/${product.id}`}>
        <div className="group bg-white rounded-3xl overflow-hidden border border-gray-100 hover:border-blue-200 hover:shadow-2xl hover:shadow-blue-100/50 transition-all duration-300 hover:-translate-y-1">
          {/* Image */}
          <div className="relative aspect-square bg-gray-50 overflow-hidden product-image-wrap">
            <Image
              src={product.images?.[0] || 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=500'}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            />

            {/* Badges */}
            <div className="absolute top-3 left-3 flex flex-col gap-1.5">
              {discount > 0 && (
                <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                  -{discount}%
                </span>
              )}
              {product.featured && (
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                  <Zap className="w-2.5 h-2.5" /> Featured
                </span>
              )}
              {product.stock < 10 && product.stock > 0 && (
                <span className="bg-orange-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                  Low Stock
                </span>
              )}
              {product.stock === 0 && (
                <span className="bg-gray-700 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                  Out of Stock
                </span>
              )}
            </div>

            {/* Hover Actions */}
            <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-200 translate-x-4 group-hover:translate-x-0">
              <button
                onClick={handleWishlist}
                className={cn(
                  'w-9 h-9 rounded-full shadow-lg flex items-center justify-center transition-colors',
                  wishlisted ? 'bg-red-500 text-white' : 'bg-white text-gray-600 hover:bg-red-50 hover:text-red-500'
                )}
              >
                <Heart className={cn('w-4 h-4', wishlisted && 'fill-current')} />
              </button>
              <Link
                href={`/products/${product.id}`}
                onClick={e => e.stopPropagation()}
                className="w-9 h-9 rounded-full bg-white shadow-lg flex items-center justify-center text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-colors"
              >
                <Eye className="w-4 h-4" />
              </Link>
            </div>

            {/* Quick Add overlay */}
            <div className="absolute bottom-0 left-0 right-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="w-full py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold text-sm flex items-center justify-center gap-2 hover:from-blue-700 hover:to-blue-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ShoppingCart className="w-4 h-4" />
                {product.stock === 0 ? 'Out of Stock' : 'Quick Add'}
              </button>
            </div>
          </div>

          {/* Info */}
          <div className="p-4">
            <p className="text-xs font-semibold text-blue-600 uppercase tracking-wider mb-1 capitalize">
              {product.category}
            </p>
            <h3 className="font-display font-bold text-gray-900 text-base leading-tight mb-2 line-clamp-2">
              {product.name}
            </h3>

            {/* Rating */}
            {product.rating && product.rating > 0 && (
              <div className="flex items-center gap-1.5 mb-3">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map(star => (
                    <Star
                      key={star}
                      className={cn(
                        'w-3 h-3',
                        star <= Math.round(product.rating || 0) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200 fill-gray-200'
                      )}
                    />
                  ))}
                </div>
                <span className="text-xs text-gray-500">({product.reviews_count || 0})</span>
              </div>
            )}

            {/* Price */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-bold text-xl text-gray-900">{formatPrice(product.price)}</span>
                {product.compare_price && (
                  <span className="text-sm text-gray-400 line-through">{formatPrice(product.compare_price)}</span>
                )}
              </div>
              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="w-9 h-9 rounded-xl bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center transition-colors shadow-lg shadow-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ShoppingCart className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

// Skeleton loader
export function ProductCardSkeleton() {
  return (
    <div className="bg-white rounded-3xl overflow-hidden border border-gray-100">
      <div className="aspect-square skeleton" />
      <div className="p-4 space-y-3">
        <div className="h-3 skeleton rounded-full w-1/4" />
        <div className="h-5 skeleton rounded-full w-3/4" />
        <div className="h-4 skeleton rounded-full w-1/2" />
        <div className="flex justify-between items-center">
          <div className="h-7 skeleton rounded-full w-1/3" />
          <div className="h-9 w-9 skeleton rounded-xl" />
        </div>
      </div>
    </div>
  );
}
