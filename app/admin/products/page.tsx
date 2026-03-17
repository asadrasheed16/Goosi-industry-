// app/admin/products/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus, Search, Edit2, Trash2, X, Save, Loader2,
  Package, AlertTriangle, Zap, RefreshCw, ImageIcon
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { fetchProductImages } from '@/lib/utils/unsplash';
import { Product } from '@/types';
import { formatPrice, CATEGORIES } from '@/lib/utils';
import toast from 'react-hot-toast';

const EMPTY_FORM = {
  name: '', description: '', price: '', compare_price: '',
  category: 'cricket', stock: '', featured: false, tags: '',
};

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [fetchingImages, setFetchingImages] = useState(false);
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [search, setSearch] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => { loadProducts(); }, []);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const supabase = createClient();
      const { data } = await supabase.from('products').select('*').order('created_at', { ascending: false });
      setProducts(data || []);
    } catch (err) { toast.error('Failed to load products'); }
    finally { setLoading(false); }
  };

  const openCreate = () => {
    setEditProduct(null);
    setForm(EMPTY_FORM);
    setPreviewImages([]);
    setModalOpen(true);
  };

  const openEdit = (product: Product) => {
    setEditProduct(product);
    setForm({
      name: product.name,
      description: product.description,
      price: String(product.price),
      compare_price: String(product.compare_price || ''),
      category: product.category,
      stock: String(product.stock),
      featured: product.featured,
      tags: product.tags?.join(', ') || '',
    });
    setPreviewImages(product.images || []);
    setModalOpen(true);
  };

  const handleFetchImages = async () => {
    if (!form.name || !form.category) {
      toast.error('Enter product name and category first');
      return;
    }
    setFetchingImages(true);
    try {
      const images = await fetchProductImages(form.name, form.category, 4);
      setPreviewImages(images);
      toast.success('Images fetched successfully!');
    } catch {
      toast.error('Failed to fetch images');
    } finally {
      setFetchingImages(false);
    }
  };

  const handleSave = async () => {
    if (!form.name || !form.price || !form.stock) {
      toast.error('Name, price, and stock are required');
      return;
    }
    setSaving(true);
    try {
      const supabase = createClient();
      const payload = {
        name: form.name,
        description: form.description,
        price: parseFloat(form.price),
        compare_price: form.compare_price ? parseFloat(form.compare_price) : null,
        category: form.category,
        stock: parseInt(form.stock),
        featured: form.featured,
        tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
        images: previewImages.length > 0 ? previewImages : await fetchProductImages(form.name, form.category, 4),
        sku: editProduct?.sku || `GI-${Date.now()}`,
      };

      if (editProduct) {
        const { error } = await supabase.from('products').update(payload).eq('id', editProduct.id);
        if (error) throw error;
        toast.success('Product updated!');
      } else {
        const { error } = await supabase.from('products').insert(payload);
        if (error) throw error;
        toast.success('Product created with AI images!');
      }
      setModalOpen(false);
      loadProducts();
    } catch (err: any) {
      toast.error(err.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const supabase = createClient();
      const { error } = await supabase.from('products').delete().eq('id', id);
      if (error) throw error;
      setProducts(p => p.filter(x => x.id !== id));
      toast.success('Product deleted');
      setDeleteId(null);
    } catch (err: any) {
      toast.error(err.message || 'Delete failed');
    }
  };

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display font-extrabold text-3xl text-gray-900">Products</h1>
          <p className="text-gray-500 mt-1">{products.length} products total</p>
        </div>
        <button onClick={openCreate} className="btn-primary flex items-center gap-2 rounded-2xl px-5 py-2.5 text-sm">
          <Plus className="w-4 h-4" /> Add Product
        </button>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search products..."
          className="input-field pl-11 text-sm"
        />
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                {['Product', 'Category', 'Price', 'Stock', 'Featured', 'Status', 'Actions'].map(h => (
                  <th key={h} className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                [...Array(6)].map((_, i) => (
                  <tr key={i}><td colSpan={7} className="px-6 py-4"><div className="h-12 skeleton rounded-xl" /></td></tr>
                ))
              ) : filtered.length === 0 ? (
                <tr><td colSpan={7} className="text-center py-16 text-gray-400">No products found</td></tr>
              ) : (
                filtered.map(product => (
                  <tr key={product.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-gray-100 shrink-0">
                          {product.images?.[0] ? (
                            <Image src={product.images[0]} alt={product.name} fill className="object-cover" sizes="48px" />
                          ) : (
                            <Package className="w-6 h-6 text-gray-300 m-auto mt-3" />
                          )}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 text-sm">{product.name}</p>
                          <p className="text-xs text-gray-400 font-mono">{product.sku}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-full capitalize">
                        {product.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-bold text-gray-900 text-sm">{formatPrice(product.price)}</p>
                        {product.compare_price && (
                          <p className="text-xs text-gray-400 line-through">{formatPrice(product.compare_price)}</p>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5">
                        {product.stock < 10 && <AlertTriangle className="w-3.5 h-3.5 text-orange-500" />}
                        <span className={`text-sm font-semibold ${product.stock < 10 ? 'text-orange-600' : 'text-gray-900'}`}>
                          {product.stock}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {product.featured && (
                        <span className="flex items-center gap-1 text-xs font-bold text-purple-700 bg-purple-50 px-2 py-1 rounded-full">
                          <Zap className="w-3 h-3" /> Yes
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                        product.stock === 0 ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'
                      }`}>
                        {product.stock === 0 ? 'Out of Stock' : 'Active'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openEdit(product)}
                          className="p-2 rounded-xl hover:bg-blue-50 text-gray-400 hover:text-blue-600 transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteId(product.id)}
                          className="p-2 rounded-xl hover:bg-red-50 text-gray-400 hover:text-red-600 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create/Edit Modal */}
      <AnimatePresence>
        {modalOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-50" onClick={() => setModalOpen(false)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
              onClick={e => e.stopPropagation()}
            >
              <div className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
                {/* Modal Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-100 sticky top-0 bg-white rounded-t-3xl">
                  <h2 className="font-display font-bold text-xl text-gray-900">
                    {editProduct ? 'Edit Product' : 'Create New Product'}
                  </h2>
                  <button onClick={() => setModalOpen(false)} className="p-2 rounded-xl hover:bg-gray-100 text-gray-400">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="p-6 space-y-6">
                  {/* Image Preview + AI Fetch */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <label className="text-sm font-semibold text-gray-700">Product Images</label>
                      <button
                        type="button"
                        onClick={handleFetchImages}
                        disabled={fetchingImages}
                        className="flex items-center gap-2 text-xs font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-xl transition-colors disabled:opacity-50"
                      >
                        {fetchingImages ? <Loader2 className="w-3 h-3 animate-spin" /> : <Zap className="w-3 h-3" />}
                        {fetchingImages ? 'Fetching...' : 'AI Auto-Fetch Images'}
                      </button>
                    </div>
                    <div className="grid grid-cols-4 gap-3">
                      {previewImages.length > 0 ? (
                        previewImages.map((img, i) => (
                          <div key={i} className="relative aspect-square rounded-2xl overflow-hidden bg-gray-100 group">
                            <Image src={img} alt="" fill className="object-cover" sizes="150px" />
                            <button
                              onClick={() => setPreviewImages(imgs => imgs.filter((_, j) => j !== i))}
                              className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                            >
                              <X className="w-3 h-3" />
                            </button>
                            {i === 0 && <span className="absolute bottom-1 left-1 text-xs bg-blue-600 text-white px-1.5 py-0.5 rounded-md font-bold">Main</span>}
                          </div>
                        ))
                      ) : (
                        <div className="col-span-4 aspect-[4/2] rounded-2xl bg-gray-50 border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-gray-400">
                          <ImageIcon className="w-8 h-8 mb-2" />
                          <p className="text-sm">Click "AI Auto-Fetch Images" to add product images</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Form Fields */}
                  <div className="grid grid-cols-2 gap-5">
                    <div className="col-span-2">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Product Name *</label>
                      <input
                        type="text"
                        value={form.name}
                        onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                        placeholder="e.g. Professional Cricket Bat - Kashmir Willow"
                        className="input-field"
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                      <textarea
                        rows={3}
                        value={form.description}
                        onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                        placeholder="Detailed product description..."
                        className="input-field resize-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Category *</label>
                      <select
                        value={form.category}
                        onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                        className="input-field"
                      >
                        {CATEGORIES.map(cat => (
                          <option key={cat.id} value={cat.id}>{cat.icon} {cat.label}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Stock Quantity *</label>
                      <input
                        type="number"
                        min="0"
                        value={form.stock}
                        onChange={e => setForm(f => ({ ...f, stock: e.target.value }))}
                        placeholder="0"
                        className="input-field"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Price (PKR) *</label>
                      <input
                        type="number"
                        min="0"
                        value={form.price}
                        onChange={e => setForm(f => ({ ...f, price: e.target.value }))}
                        placeholder="0.00"
                        className="input-field"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Compare Price (PKR)</label>
                      <input
                        type="number"
                        min="0"
                        value={form.compare_price}
                        onChange={e => setForm(f => ({ ...f, compare_price: e.target.value }))}
                        placeholder="Original price (for discount)"
                        className="input-field"
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Tags (comma separated)</label>
                      <input
                        type="text"
                        value={form.tags}
                        onChange={e => setForm(f => ({ ...f, tags: e.target.value }))}
                        placeholder="cricket, bat, professional, willow"
                        className="input-field"
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="flex items-center gap-3 cursor-pointer p-4 bg-purple-50 rounded-2xl border border-purple-100 hover:bg-purple-100 transition-colors">
                        <input
                          type="checkbox"
                          checked={form.featured}
                          onChange={e => setForm(f => ({ ...f, featured: e.target.checked }))}
                          className="w-4 h-4 accent-purple-600"
                        />
                        <div>
                          <p className="font-semibold text-purple-900 text-sm flex items-center gap-2">
                            <Zap className="w-4 h-4" /> Featured Product
                          </p>
                          <p className="text-purple-700 text-xs mt-0.5">Appears on homepage and is promoted in listings</p>
                        </div>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Modal Footer */}
                <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-100 sticky bottom-0 bg-white rounded-b-3xl">
                  <button onClick={() => setModalOpen(false)} className="px-5 py-2.5 rounded-2xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50">
                    Cancel
                  </button>
                  <button onClick={handleSave} disabled={saving}
                    className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold rounded-2xl hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg disabled:opacity-50 text-sm"
                  >
                    {saving ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</> : <><Save className="w-4 h-4" /> {editProduct ? 'Save Changes' : 'Create Product'}</>}
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Delete Confirm Modal */}
      <AnimatePresence>
        {deleteId && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
              onClick={() => setDeleteId(null)}
            >
              <motion.div
                initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
                onClick={e => e.stopPropagation()}
                className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl text-center"
              >
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Trash2 className="w-8 h-8 text-red-600" />
                </div>
                <h3 className="font-display font-bold text-xl text-gray-900 mb-2">Delete Product?</h3>
                <p className="text-gray-500 text-sm mb-6">This action cannot be undone. The product will be permanently removed.</p>
                <div className="flex gap-3">
                  <button onClick={() => setDeleteId(null)} className="flex-1 py-3 rounded-2xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50">
                    Cancel
                  </button>
                  <button onClick={() => handleDelete(deleteId)} className="flex-1 py-3 rounded-2xl bg-red-600 text-white font-bold text-sm hover:bg-red-700 transition-colors">
                    Delete
                  </button>
                </div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
