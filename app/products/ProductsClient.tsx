// app/products/ProductsClient.tsx
'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { SlidersHorizontal, X, ChevronDown, Search, LayoutGrid, List } from 'lucide-react';
import ProductCard, { ProductCardSkeleton } from '@/components/products/ProductCard';
import { Product } from '@/types';
import { CATEGORIES } from '@/lib/utils';

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Highest Rated' },
  { value: 'popular', label: 'Most Popular' },
];

export default function ProductsClient({
  initialProducts,
  searchParams,
}: {
  initialProducts: Product[];
  searchParams: any;
}) {
  const router = useRouter();
  const sp = useSearchParams();

  const [products] = useState(initialProducts);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(searchParams.category || 'all');
  const [sortBy, setSortBy] = useState(searchParams.sort || 'newest');
  const [priceRange, setPriceRange] = useState([0, 20000]);
  const [searchVal, setSearchVal] = useState(searchParams.search || '');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [view, setView] = useState<'grid' | 'list'>('grid');

  const applyFilters = useCallback(() => {
    const params = new URLSearchParams();
    if (selectedCategory && selectedCategory !== 'all') params.set('category', selectedCategory);
    if (sortBy !== 'newest') params.set('sort', sortBy);
    if (searchVal) params.set('search', searchVal);
    if (priceRange[0] > 0) params.set('minPrice', String(priceRange[0]));
    if (priceRange[1] < 20000) params.set('maxPrice', String(priceRange[1]));
    router.push(`/products?${params.toString()}`);
  }, [selectedCategory, sortBy, searchVal, priceRange, router]);

  const clearFilters = () => {
    setSelectedCategory('all');
    setSortBy('newest');
    setPriceRange([0, 20000]);
    setSearchVal('');
    setInStockOnly(false);
    router.push('/products');
  };

  const filteredProducts = inStockOnly ? products.filter(p => p.stock > 0) : products;
  const activeFilters = [
    selectedCategory !== 'all' && selectedCategory,
    searchVal,
    priceRange[0] > 0 && `PKR ${priceRange[0]}+`,
    priceRange[1] < 20000 && `≤ PKR ${priceRange[1]}`,
    inStockOnly && 'In Stock',
  ].filter(Boolean);

  return (
    <div className="bg-white min-h-screen">
      {/* Hero bar */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 py-12">
        <div className="container-custom text-center text-white">
          <h1 className="font-display font-extrabold text-4xl lg:text-5xl mb-3">
            All Products
          </h1>
          <p className="text-blue-200 text-lg">
            {filteredProducts.length} premium sports items available
          </p>
        </div>
      </div>

      <div className="container-custom py-8">
        {/* Top Controls */}
        <div className="flex flex-wrap items-center gap-4 mb-6">
          {/* Search */}
          <div className="relative flex-1 min-w-64">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchVal}
              onChange={e => setSearchVal(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && applyFilters()}
              placeholder="Search products..."
              className="w-full pl-10 pr-4 py-3 rounded-2xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Sort */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={e => { setSortBy(e.target.value); applyFilters(); }}
              className="appearance-none pl-4 pr-10 py-3 rounded-2xl border border-gray-200 bg-gray-50 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
            >
              {SORT_OPTIONS.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>

          {/* Filters toggle */}
          <button
            onClick={() => setFiltersOpen(!filtersOpen)}
            className="flex items-center gap-2 px-4 py-3 rounded-2xl border border-gray-200 bg-gray-50 text-sm font-medium hover:border-blue-400 hover:text-blue-600 transition-colors"
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filters
            {activeFilters.length > 0 && (
              <span className="w-5 h-5 bg-blue-600 text-white text-xs rounded-full flex items-center justify-center">
                {activeFilters.length}
              </span>
            )}
          </button>

          {/* View toggle */}
          <div className="flex border border-gray-200 rounded-2xl overflow-hidden">
            <button
              onClick={() => setView('grid')}
              className={`p-3 ${view === 'grid' ? 'bg-blue-600 text-white' : 'bg-gray-50 text-gray-500 hover:bg-gray-100'} transition-colors`}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setView('list')}
              className={`p-3 ${view === 'list' ? 'bg-blue-600 text-white' : 'bg-gray-50 text-gray-500 hover:bg-gray-100'} transition-colors`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Active filter chips */}
        {activeFilters.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {activeFilters.map(f => (
              <span key={String(f)} className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 text-sm rounded-full border border-blue-200 font-medium">
                {String(f)}
                <button onClick={clearFilters}><X className="w-3 h-3" /></button>
              </span>
            ))}
            <button onClick={clearFilters} className="text-sm text-gray-500 hover:text-gray-700 underline">
              Clear all
            </button>
          </div>
        )}

        {/* Filters Panel */}
        <AnimatePresence>
          {filtersOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden mb-6"
            >
              <div className="bg-gray-50 rounded-3xl p-6 border border-gray-100">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Categories */}
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Category</h4>
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => setSelectedCategory('all')}
                        className={`px-3 py-1.5 rounded-xl text-sm font-medium transition-colors ${
                          selectedCategory === 'all'
                            ? 'bg-blue-600 text-white'
                            : 'bg-white border border-gray-200 text-gray-600 hover:border-blue-400'
                        }`}
                      >
                        All
                      </button>
                      {CATEGORIES.map(cat => (
                        <button
                          key={cat.id}
                          onClick={() => setSelectedCategory(cat.id)}
                          className={`px-3 py-1.5 rounded-xl text-sm font-medium transition-colors flex items-center gap-1 ${
                            selectedCategory === cat.id
                              ? 'bg-blue-600 text-white'
                              : 'bg-white border border-gray-200 text-gray-600 hover:border-blue-400'
                          }`}
                        >
                          {cat.icon} {cat.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Price Range */}
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">
                      Price Range: PKR {priceRange[0].toLocaleString()} - {priceRange[1].toLocaleString()}
                    </h4>
                    <input
                      type="range"
                      min={0}
                      max={20000}
                      step={500}
                      value={priceRange[1]}
                      onChange={e => setPriceRange([priceRange[0], Number(e.target.value)])}
                      className="w-full accent-blue-600"
                    />
                    <div className="flex gap-3 mt-2">
                      {[2000, 5000, 10000, 15000].map(price => (
                        <button
                          key={price}
                          onClick={() => setPriceRange([0, price])}
                          className="text-xs px-2 py-1 bg-white border border-gray-200 rounded-lg hover:border-blue-400 text-gray-600"
                        >
                          ≤{(price / 1000).toFixed(0)}K
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Other */}
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Availability</h4>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={inStockOnly}
                        onChange={e => setInStockOnly(e.target.checked)}
                        className="w-4 h-4 accent-blue-600 rounded"
                      />
                      <span className="text-sm text-gray-700">In Stock Only</span>
                    </label>
                    <div className="mt-4 flex gap-3">
                      <button
                        onClick={applyFilters}
                        className="btn-primary text-sm px-5 py-2 rounded-xl"
                      >
                        Apply Filters
                      </button>
                      <button
                        onClick={clearFilters}
                        className="text-sm px-5 py-2 rounded-xl border border-gray-200 hover:bg-gray-100 text-gray-600"
                      >
                        Reset
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-6xl mb-4">🔍</p>
            <h3 className="font-display font-bold text-2xl text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-500 mb-6">Try adjusting your filters or search term</p>
            <button onClick={clearFilters} className="btn-primary px-6 py-3 rounded-2xl text-sm">
              Clear Filters
            </button>
          </div>
        ) : (
          <div className={`grid gap-6 ${
            view === 'grid'
              ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
              : 'grid-cols-1'
          }`}>
            {filteredProducts.map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
