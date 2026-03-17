// types/index.ts

export type UserRole = 'user' | 'admin';

export interface Profile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar_url?: string;
  created_at: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  compare_price?: number;
  category: ProductCategory;
  subcategory?: string;
  images: string[];
  stock: number;
  sku?: string;
  weight?: number;
  tags?: string[];
  featured: boolean;
  rating?: number;
  reviews_count?: number;
  created_at: string;
  updated_at: string;
}

export type ProductCategory =
  | 'cricket'
  | 'football'
  | 'boxing'
  | 'badminton'
  | 'tennis'
  | 'fitness'
  | 'swimming'
  | 'running'
  | 'basketball'
  | 'volleyball';

export interface Order {
  id: string;
  user_id: string;
  total_price: number;
  status: OrderStatus;
  shipping_address?: ShippingAddress;
  payment_method?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  order_items?: OrderItem[];
  profiles?: Profile;
}

export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled'
  | 'refunded';

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  price: number;
  products?: Product;
}

export interface CartItem {
  id: string;
  user_id: string;
  product_id: string;
  quantity: number;
  products?: Product;
}

export interface BulkInquiry {
  id: string;
  name: string;
  email: string;
  company?: string;
  phone?: string;
  country?: string;
  product_type: string;
  quantity: number;
  message: string;
  status: 'new' | 'contacted' | 'quoted' | 'closed';
  file_url?: string;
  created_at: string;
}

export interface ShippingAddress {
  name: string;
  street: string;
  city: string;
  state: string;
  country: string;
  zip: string;
  phone: string;
}

export interface FilterOptions {
  category?: ProductCategory | 'all';
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  sortBy?: 'price_asc' | 'price_desc' | 'newest' | 'rating' | 'popular';
  search?: string;
}

export interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  totalProducts: number;
  totalUsers: number;
  revenueGrowth: number;
  ordersGrowth: number;
  pendingOrders: number;
  lowStockProducts: number;
}

export interface UnsplashImage {
  id: string;
  urls: {
    raw: string;
    full: string;
    regular: string;
    small: string;
    thumb: string;
  };
  alt_description: string;
  user: { name: string };
}
