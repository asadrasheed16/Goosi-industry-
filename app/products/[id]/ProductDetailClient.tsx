// app/products/[id]/ProductDetailClient.tsx
'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  ShoppingCart, Heart, Share2, Star, Truck, Shield,
  ChevronLeft, Plus, Minus, CheckCircle, Package, RotateCcw, Zap
} from 'lucide-react';
import { Product } from '@/types';
import { useCartStore, useUIStore } from '@/store';
import { formatPrice, cn } from '@/lib/utils';
import ProductCard from '@/components/products/ProductCard';
import toast from 'react-hot-toast';

export default function ProductDetailClient({
  product,
  relatedProducts,
}: {
  product: Product;
  relatedProducts: Product[];
}) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'description' | 'specs' | 'reviews'>('description');

  const { addItem } = useCartStore();
  const { toggleWishlist, isInWishlist } = useUIStore();
  const wishlisted = isInWishlist(product.id);
  const discount = product.compare_price
    ? Math.round(((product.compare_price - product.price) / product.compare_price) * 100)
    : 0;

  const handleAddToCart = () => {
    addItem(product, quantity);
    toast.success(`${quantity}x ${product.name} added to cart!`);
  };

  const images = product.images?.length ? product.images : [
    'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=800',
  ];

  return (
    <div className="bg-white min-h-screen">
      {/* Breadcrumb */}
      <div className="bg-gray-50 border-b border-gray-100">
        <div className="container-custom py-3">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Link href="/" className="hover:text-blue-600">Home</Link>
            <span>/</span>
            <Link href="/products" className="hover:text-blue-600">Products</Link>
            <span>/</span>
            <Link href={`/products?category=${product.category}`} className="hover:text-blue-600 capitalize">{product.category}</Link>
            <span>/</span>
            <span className="text-gray-900 font-medium truncate max-w-xs">{product.name}</span>
          </div>
        </div>
      </div>

      <div className="container-custom py-10">
        <div className="grid lg:grid-cols-2 gap-16">
          {/* Images */}
          <div>
            <motion.div
              key={selectedImage}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="relative aspect-square rounded-3xl overflow-hidden bg-gray-50 mb-4"
            >
              <Image
                src={images[selectedImage]}
                alt={product.name}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />
              {discount > 0 && (
                <div className="absolute top-4 left-4 bg-red-500 text-white text-sm font-bold px-3 py-1 rounded-full">
                  -{discount}%
                </div>
              )}
              {product.featured && (
                <div className="absolute top-4 right-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5">
                  <Zap className="w-3 h-3" /> Featured
                </div>
              )}
            </motion.div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={cn(
                      'relative w-20 h-20 rounded-2xl overflow-hidden shrink-0 border-2 transition-colors',
                      selectedImage === i ? 'border-blue-600' : 'border-transparent hover:border-gray-300'
                    )}
                  >
                    <Image src={img} alt="" fill className="object-cover" sizes="80px" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div>
            <Link href="/products" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-blue-600 mb-6 transition-colors">
              <ChevronLeft className="w-4 h-4" /> Back to Products
            </Link>

            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider bg-blue-50 px-3 py-1 rounded-full capitalize">
                {product.category}
              </span>
              {product.stock > 0 ? (
                <span className="text-xs font-semibold text-green-600 bg-green-50 px-3 py-1 rounded-full flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" /> In Stock ({product.stock})
                </span>
              ) : (
                <span className="text-xs font-semibold text-red-600 bg-red-50 px-3 py-1 rounded-full">
                  Out of Stock
                </span>
              )}
            </div>

            <h1 className="font-display font-extrabold text-3xl lg:text-4xl text-gray-900 mb-4 leading-tight">
              {product.name}
            </h1>

            {/* Rating */}
            {product.rating && product.rating > 0 && (
              <div className="flex items-center gap-3 mb-6">
                <div className="flex">
                  {[1,2,3,4,5].map(s => (
                    <Star key={s} className={cn('w-5 h-5', s <= Math.round(product.rating || 0) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200 fill-gray-200')} />
                  ))}
                </div>
                <span className="font-bold text-gray-900">{product.rating.toFixed(1)}</span>
                <span className="text-gray-500 text-sm">({product.reviews_count} reviews)</span>
              </div>
            )}

            {/* Price */}
            <div className="flex items-center gap-4 mb-8">
              <span className="font-display font-extrabold text-4xl text-gray-900">
                {formatPrice(product.price)}
              </span>
              {product.compare_price && (
                <span className="text-xl text-gray-400 line-through">{formatPrice(product.compare_price)}</span>
              )}
              {discount > 0 && (
                <span className="bg-red-100 text-red-600 font-bold text-sm px-3 py-1 rounded-full">
                  Save {discount}%
                </span>
              )}
            </div>

            {/* Quantity */}
            <div className="flex items-center gap-4 mb-6">
              <span className="font-semibold text-gray-700">Quantity:</span>
              <div className="flex items-center gap-3 bg-gray-50 rounded-2xl p-1">
                <button
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  className="w-10 h-10 rounded-xl bg-white border border-gray-200 flex items-center justify-center hover:border-blue-400 transition-colors shadow-sm"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-10 text-center font-bold text-lg text-gray-900">{quantity}</span>
                <button
                  onClick={() => setQuantity(q => Math.min(product.stock, q + 1))}
                  className="w-10 h-10 rounded-xl bg-white border border-gray-200 flex items-center justify-center hover:border-blue-400 transition-colors shadow-sm"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex gap-3 mb-8">
              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="flex-1 flex items-center justify-center gap-2 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold rounded-2xl hover:from-blue-700 hover:to-blue-800 transition-all shadow-xl shadow-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ShoppingCart className="w-5 h-5" />
                {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
              </button>
              <button
                onClick={() => { toggleWishlist(product.id); toast.success(wishlisted ? 'Removed from wishlist' : 'Added to wishlist!'); }}
                className={cn(
                  'w-14 h-14 rounded-2xl border-2 flex items-center justify-center transition-all',
                  wishlisted ? 'bg-red-50 border-red-300 text-red-500' : 'border-gray-200 text-gray-400 hover:border-red-300 hover:text-red-400'
                )}
              >
                <Heart className={cn('w-5 h-5', wishlisted && 'fill-current')} />
              </button>
              <button className="w-14 h-14 rounded-2xl border-2 border-gray-200 flex items-center justify-center text-gray-400 hover:border-blue-300 hover:text-blue-400 transition-colors">
                <Share2 className="w-5 h-5" />
              </button>
            </div>

            {/* Trust features */}
            <div className="grid grid-cols-3 gap-4 mb-8 p-4 bg-gray-50 rounded-2xl">
              {[
                { icon: Truck, label: 'Free Shipping', sub: 'Orders over 5K' },
                { icon: Shield, label: 'Genuine Product', sub: '100% authentic' },
                { icon: RotateCcw, label: 'Easy Returns', sub: '30 day policy' },
              ].map(({ icon: Icon, label, sub }) => (
                <div key={label} className="text-center">
                  <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center mx-auto mb-2">
                    <Icon className="w-5 h-5 text-blue-600" />
                  </div>
                  <p className="text-xs font-semibold text-gray-900">{label}</p>
                  <p className="text-xs text-gray-500">{sub}</p>
                </div>
              ))}
            </div>

            {/* SKU */}
            {product.sku && (
              <p className="text-xs text-gray-400">SKU: <span className="font-mono">{product.sku}</span></p>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-16">
          <div className="flex gap-2 border-b border-gray-100 mb-8">
            {(['description', 'specs', 'reviews'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  'px-6 py-3 font-semibold text-sm capitalize transition-colors border-b-2 -mb-px',
                  activeTab === tab
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                )}
              >
                {tab}
              </button>
            ))}
          </div>

          {activeTab === 'description' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-3xl">
              <p className="text-gray-700 leading-relaxed text-lg">{product.description}</p>
              {product.tags && product.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-6">
                  {product.tags.map(tag => (
                    <span key={tag} className="px-3 py-1 bg-blue-50 text-blue-700 text-sm rounded-full font-medium">#{tag}</span>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'specs' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-lg">
              <div className="space-y-3">
                {[
                  { label: 'Category', value: product.category },
                  { label: 'Stock', value: `${product.stock} units` },
                  { label: 'SKU', value: product.sku || 'N/A' },
                  { label: 'Rating', value: `${product.rating?.toFixed(1) || 'N/A'}/5` },
                  { label: 'Reviews', value: `${product.reviews_count || 0} verified reviews` },
                ].map(({ label, value }) => (
                  <div key={label} className="flex items-center justify-between py-3 border-b border-gray-100">
                    <span className="text-gray-500 text-sm">{label}</span>
                    <span className="font-semibold text-gray-900 text-sm capitalize">{value}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'reviews' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="flex items-center gap-8 mb-8 p-6 bg-gray-50 rounded-3xl max-w-lg">
                <div className="text-center">
                  <p className="font-display font-extrabold text-6xl text-gray-900">{product.rating?.toFixed(1) || '0.0'}</p>
                  <div className="flex justify-center mt-2">
                    {[1,2,3,4,5].map(s => (
                      <Star key={s} className={cn('w-4 h-4', s <= Math.round(product.rating || 0) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200 fill-gray-200')} />
                    ))}
                  </div>
                  <p className="text-gray-500 text-sm mt-1">{product.reviews_count} reviews</p>
                </div>
              </div>
              <p className="text-gray-500">Customer reviews are loaded from Supabase in production.</p>
            </motion.div>
          )}
        </div>

        {/* Related */}
        {relatedProducts.length > 0 && (
          <div className="mt-20">
            <h2 className="font-display font-extrabold text-3xl text-gray-900 mb-8">
              You Might Also Like
            </h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.filter(p => p.id !== product.id).slice(0, 4).map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
