// lib/actions.ts
'use server';

import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { fetchProductImages } from '@/lib/utils/unsplash';
import { Product, FilterOptions, BulkInquiry, ShippingAddress } from '@/types';
import { redirect } from 'next/navigation';

// ==================== PRODUCTS ====================

export async function getProducts(filters?: FilterOptions) {
  const supabase = createClient();
  let query = supabase.from('products').select('*');

  if (filters?.category && filters.category !== 'all') {
    query = query.eq('category', filters.category);
  }
  if (filters?.minPrice !== undefined) query = query.gte('price', filters.minPrice);
  if (filters?.maxPrice !== undefined) query = query.lte('price', filters.maxPrice);
  if (filters?.inStock) query = query.gt('stock', 0);
  if (filters?.search) {
    query = query.or(`name.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
  }

  switch (filters?.sortBy) {
    case 'price_asc': query = query.order('price', { ascending: true }); break;
    case 'price_desc': query = query.order('price', { ascending: false }); break;
    case 'rating': query = query.order('rating', { ascending: false }); break;
    case 'popular': query = query.order('reviews_count', { ascending: false }); break;
    default: query = query.order('created_at', { ascending: false });
  }

  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return data as Product[];
}

export async function getFeaturedProducts() {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('featured', true)
    .order('rating', { ascending: false })
    .limit(8);
  if (error) throw new Error(error.message);
  return data as Product[];
}

export async function getProductById(id: string) {
  const supabase = createClient();
  const { data, error } = await supabase.from('products').select('*').eq('id', id).single();
  if (error) return null;
  return data as Product;
}

export async function createProduct(formData: FormData) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Unauthorized');

  const name = formData.get('name') as string;
  const category = formData.get('category') as string;
  const price = parseFloat(formData.get('price') as string);
  const compare_price = parseFloat(formData.get('compare_price') as string) || null;
  const description = formData.get('description') as string;
  const stock = parseInt(formData.get('stock') as string);
  const featured = formData.get('featured') === 'true';

  // AI image auto-fetch
  const images = await fetchProductImages(name, category, 4);

  const { data, error } = await supabase.from('products').insert({
    name, description, price, compare_price, category, images,
    stock, featured, sku: `GI-${Date.now()}`,
  }).select().single();

  if (error) throw new Error(error.message);
  revalidatePath('/admin/products');
  revalidatePath('/products');
  return data;
}

export async function updateProduct(id: string, updates: Partial<Product>) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('products').update(updates).eq('id', id).select().single();
  if (error) throw new Error(error.message);
  revalidatePath('/admin/products');
  revalidatePath(`/products/${id}`);
  return data;
}

export async function deleteProduct(id: string) {
  const supabase = createClient();
  const { error } = await supabase.from('products').delete().eq('id', id);
  if (error) throw new Error(error.message);
  revalidatePath('/admin/products');
  revalidatePath('/products');
}

// ==================== ORDERS ====================

export async function getOrders(userId?: string) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Unauthorized');

  let query = supabase
    .from('orders')
    .select(`*, order_items(*, products(*)), profiles(name, email)`)
    .order('created_at', { ascending: false });

  if (userId) query = query.eq('user_id', userId);
  else query = query.eq('user_id', user.id);

  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return data;
}

export async function getAllOrders() {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('orders')
    .select(`*, order_items(*, products(*)), profiles(name, email)`)
    .order('created_at', { ascending: false });
  if (error) throw new Error(error.message);
  return data;
}

export async function createOrder(
  cartItems: { product_id: string; quantity: number; price: number }[],
  shippingAddress: ShippingAddress,
  paymentMethod = 'cod'
) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/auth/login');

  const totalPrice = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const { data: order, error: orderError } = await supabase
    .from('orders').insert({
      user_id: user.id, total_price: totalPrice,
      status: 'pending', shipping_address: shippingAddress, payment_method: paymentMethod,
    }).select().single();

  if (orderError) throw new Error(orderError.message);

  const { error: itemsError } = await supabase.from('order_items').insert(
    cartItems.map(item => ({ ...item, order_id: order.id }))
  );
  if (itemsError) throw new Error(itemsError.message);

  // Decrease stock
  for (const item of cartItems) {
    await supabase.rpc('decrease_stock', { product_id: item.product_id, qty: item.quantity });
  }

  revalidatePath('/dashboard');
  return order;
}

export async function updateOrderStatus(orderId: string, status: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('orders').update({ status }).eq('id', orderId).select().single();
  if (error) throw new Error(error.message);
  revalidatePath('/admin/orders');
  return data;
}

// ==================== CART ====================

export async function syncCartToSupabase(
  items: { product_id: string; quantity: number }[]
) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  await supabase.from('cart_items').delete().eq('user_id', user.id);
  if (items.length > 0) {
    await supabase.from('cart_items').insert(
      items.map(item => ({ ...item, user_id: user.id }))
    );
  }
}

// ==================== BULK INQUIRIES ====================

export async function submitBulkInquiry(data: Omit<BulkInquiry, 'id' | 'created_at' | 'status'>) {
  const supabase = createClient();
  const { error } = await supabase.from('bulk_inquiries').insert(data);
  if (error) throw new Error(error.message);
  revalidatePath('/admin/inquiries');
}

export async function getBulkInquiries() {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('bulk_inquiries').select('*').order('created_at', { ascending: false });
  if (error) throw new Error(error.message);
  return data as BulkInquiry[];
}

// ==================== AUTH ====================

export async function getUserProfile() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single();
  return data;
}

export async function updateProfile(updates: { name?: string; avatar_url?: string }) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Unauthorized');

  const { data, error } = await supabase
    .from('profiles').update(updates).eq('id', user.id).select().single();
  if (error) throw new Error(error.message);
  revalidatePath('/dashboard');
  return data;
}

// ==================== STATS ====================

export async function getDashboardStats() {
  const supabase = createClient();
  const [orders, products, profiles] = await Promise.all([
    supabase.from('orders').select('total_price, status, created_at'),
    supabase.from('products').select('stock, name'),
    supabase.from('profiles').select('id'),
  ]);

  const totalRevenue = orders.data
    ?.filter(o => o.status === 'delivered')
    .reduce((sum, o) => sum + o.total_price, 0) || 0;
  const totalOrders = orders.data?.length || 0;
  const pendingOrders = orders.data?.filter(o => o.status === 'pending').length || 0;
  const lowStockProducts = products.data?.filter(p => p.stock < 10).length || 0;

  return {
    totalRevenue,
    totalOrders,
    totalProducts: products.data?.length || 0,
    totalUsers: profiles.data?.length || 0,
    pendingOrders,
    lowStockProducts,
    revenueGrowth: 12.5,
    ordersGrowth: 8.2,
  };
}
