-- ============================================================
-- GOOSI INDUSTRY — SUPABASE COMPLETE SCHEMA + RLS POLICIES
-- Run this in Supabase SQL Editor
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- STEP 1: PROFILES TABLE
-- ============================================================
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL DEFAULT '',
  email TEXT NOT NULL DEFAULT '',
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  avatar_url TEXT,
  phone TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, name, email, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'role', 'user')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ============================================================
-- STEP 2: PRODUCTS TABLE
-- ============================================================
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  price DECIMAL(10,2) NOT NULL CHECK (price >= 0),
  compare_price DECIMAL(10,2),
  category TEXT NOT NULL CHECK (category IN (
    'cricket','football','boxing','badminton','tennis',
    'fitness','swimming','running','basketball','volleyball'
  )),
  subcategory TEXT,
  images TEXT[] DEFAULT '{}',
  stock INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
  sku TEXT UNIQUE,
  weight DECIMAL(8,2),
  tags TEXT[] DEFAULT '{}',
  featured BOOLEAN DEFAULT false,
  rating DECIMAL(3,2) DEFAULT 0 CHECK (rating >= 0 AND rating <= 5),
  reviews_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Full-text search index
CREATE INDEX products_search_idx ON products
  USING GIN (to_tsvector('english', name || ' ' || description || ' ' || category));
CREATE INDEX products_category_idx ON products(category);
CREATE INDEX products_featured_idx ON products(featured);
CREATE INDEX products_price_idx ON products(price);

-- ============================================================
-- STEP 3: ORDERS TABLE
-- ============================================================
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  total_price DECIMAL(10,2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN (
    'pending','confirmed','processing','shipped','delivered','cancelled','refunded'
  )),
  shipping_address JSONB,
  payment_method TEXT DEFAULT 'cod',
  payment_status TEXT DEFAULT 'unpaid' CHECK (payment_status IN ('unpaid','paid','refunded')),
  notes TEXT,
  tracking_number TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX orders_user_idx ON orders(user_id);
CREATE INDEX orders_status_idx ON orders(status);
CREATE INDEX orders_created_idx ON orders(created_at DESC);

-- ============================================================
-- STEP 4: ORDER ITEMS TABLE
-- ============================================================
CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id),
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  price DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX order_items_order_idx ON order_items(order_id);
CREATE INDEX order_items_product_idx ON order_items(product_id);

-- ============================================================
-- STEP 5: CART ITEMS TABLE
-- ============================================================
CREATE TABLE cart_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);

CREATE INDEX cart_items_user_idx ON cart_items(user_id);

-- ============================================================
-- STEP 6: BULK INQUIRIES TABLE
-- ============================================================
CREATE TABLE bulk_inquiries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  company TEXT,
  phone TEXT,
  country TEXT,
  product_type TEXT NOT NULL,
  quantity INTEGER NOT NULL,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'new' CHECK (status IN ('new','contacted','quoted','closed')),
  file_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX bulk_inquiries_status_idx ON bulk_inquiries(status);
CREATE INDEX bulk_inquiries_created_idx ON bulk_inquiries(created_at DESC);

-- ============================================================
-- STEP 7: PRODUCT REVIEWS TABLE
-- ============================================================
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  title TEXT,
  body TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(product_id, user_id)
);

CREATE INDEX reviews_product_idx ON reviews(product_id);

-- Auto-update product rating on review insert/update/delete
CREATE OR REPLACE FUNCTION update_product_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE products
  SET
    rating = (SELECT AVG(rating) FROM reviews WHERE product_id = COALESCE(NEW.product_id, OLD.product_id)),
    reviews_count = (SELECT COUNT(*) FROM reviews WHERE product_id = COALESCE(NEW.product_id, OLD.product_id))
  WHERE id = COALESCE(NEW.product_id, OLD.product_id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_rating_on_review
  AFTER INSERT OR UPDATE OR DELETE ON reviews
  FOR EACH ROW EXECUTE FUNCTION update_product_rating();

-- ============================================================
-- STEP 8: UPDATED_AT TRIGGER
-- ============================================================
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER set_products_updated_at BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER set_orders_updated_at BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ============================================================
-- STEP 9: ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE bulk_inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- PROFILES RLS
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Admins can view all profiles" ON profiles
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- PRODUCTS RLS (public read, admin write)
CREATE POLICY "Anyone can view products" ON products
  FOR SELECT USING (true);
CREATE POLICY "Admins can insert products" ON products
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );
CREATE POLICY "Admins can update products" ON products
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );
CREATE POLICY "Admins can delete products" ON products
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- ORDERS RLS
CREATE POLICY "Users can view own orders" ON orders
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own orders" ON orders
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins can view all orders" ON orders
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );
CREATE POLICY "Admins can update all orders" ON orders
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- ORDER ITEMS RLS
CREATE POLICY "Users can view own order items" ON order_items
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM orders WHERE id = order_id AND user_id = auth.uid())
  );
CREATE POLICY "Users can create order items" ON order_items
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM orders WHERE id = order_id AND user_id = auth.uid())
  );
CREATE POLICY "Admins can view all order items" ON order_items
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- CART ITEMS RLS
CREATE POLICY "Users can manage own cart" ON cart_items
  FOR ALL USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- BULK INQUIRIES RLS (public insert, admin read)
CREATE POLICY "Anyone can submit inquiry" ON bulk_inquiries
  FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can view all inquiries" ON bulk_inquiries
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );
CREATE POLICY "Admins can update inquiries" ON bulk_inquiries
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- REVIEWS RLS
CREATE POLICY "Anyone can view reviews" ON reviews FOR SELECT USING (true);
CREATE POLICY "Authenticated users can write reviews" ON reviews
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own reviews" ON reviews
  FOR UPDATE USING (auth.uid() = user_id);

-- ============================================================
-- STEP 10: SUPABASE STORAGE BUCKETS
-- ============================================================
INSERT INTO storage.buckets (id, name, public)
VALUES ('products', 'products', true)
ON CONFLICT DO NOTHING;

INSERT INTO storage.buckets (id, name, public)
VALUES ('bulk-uploads', 'bulk-uploads', false)
ON CONFLICT DO NOTHING;

INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT DO NOTHING;

-- Storage policies
CREATE POLICY "Public can view product images" ON storage.objects
  FOR SELECT USING (bucket_id = 'products');
CREATE POLICY "Admins can upload product images" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'products' AND
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );
CREATE POLICY "Users can upload bulk files" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'bulk-uploads' AND auth.role() = 'authenticated');
CREATE POLICY "Users can view own avatars" ON storage.objects
  FOR SELECT USING (bucket_id = 'avatars');
CREATE POLICY "Users can upload avatars" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

-- ============================================================
-- STEP 11: SAMPLE DATA
-- ============================================================
INSERT INTO products (name, description, price, compare_price, category, images, stock, featured, tags, rating, reviews_count) VALUES
('Professional Cricket Bat - Kashmir Willow', 'Premium Kashmir Willow cricket bat with extra cover and anti-scuff sheet. Ideal for professional players. Perfect balance and powerful stroke play.', 4500, 5500, 'cricket', ARRAY['https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=800', 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=800'], 50, true, ARRAY['bat','cricket','kashmir willow'], 4.8, 156),
('cricket Batting Pads - Pro Series', 'Lightweight high-density foam pads with adjustable straps. Superior protection for professional-level play.', 2800, 3500, 'cricket', ARRAY['https://images.unsplash.com/photo-1578763363228-6e8428de69b2?w=800'], 35, true, ARRAY['pads','protection','cricket'], 4.6, 89),
('Football Match Ball - FIFA Approved', 'Premium match ball with thermal bonding technology. Perfect flight and durability for all weather conditions. Used in official matches.', 3200, 4000, 'football', ARRAY['https://images.unsplash.com/photo-1575361204480-aadea25e6e68?w=800'], 120, true, ARRAY['football','match ball','FIFA'], 4.9, 234),
('Boxing Gloves - Pro Fight', 'Full-grain leather boxing gloves with multi-layer foam padding. Wrist strap closure for secure fit. Professional competition grade.', 3800, 5000, 'boxing', ARRAY['https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=800'], 45, true, ARRAY['boxing','gloves','pro'], 4.7, 123),
('Badminton Racket - Carbon Ultra', 'Lightweight carbon fiber frame with isometric head shape. High tension string for maximum power and control.', 2200, 3000, 'badminton', ARRAY['https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=800'], 60, false, ARRAY['badminton','racket','carbon'], 4.5, 78),
('Tennis Racket - Graphite Pro', 'Professional graphite tennis racket with open string pattern for maximum spin. Vibration dampening technology.', 5500, 7000, 'tennis', ARRAY['https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?w=800'], 30, true, ARRAY['tennis','graphite','pro'], 4.8, 167),
('Adjustable Dumbbell Set - 5-50kg', 'Premium adjustable dumbbells with quick-change mechanism. Cast iron plates with chrome handles. Ideal for home and gym use.', 12000, 15000, 'fitness', ARRAY['https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800'], 25, false, ARRAY['dumbbells','fitness','weights'], 4.6, 112),
('Running Shoes - Air Boost Pro', 'Lightweight running shoes with air cushion sole. Breathable mesh upper. Ideal for marathon and trail running.', 6500, 8500, 'running', ARRAY['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800'], 80, true, ARRAY['running','shoes','air cushion'], 4.9, 445),
('Basketball - Official Size 7', 'Official size basketball with composite leather cover. Deep channel design for better grip and control.', 2500, 3200, 'basketball', ARRAY['https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800'], 90, false, ARRAY['basketball','official','composite'], 4.4, 67),
('Swimming Goggles - Ultra Clear', 'Anti-fog UV-protected swimming goggles with adjustable strap. Wide peripheral vision for competitive swimming.', 800, 1200, 'swimming', ARRAY['https://images.unsplash.com/photo-1530549387789-4c1017266635?w=800'], 150, false, ARRAY['swimming','goggles','anti-fog'], 4.3, 89),
('Cricket Helmet - Carbon Shell', 'Carbon fiber cricket helmet with adjustable neck guard. Meets international safety standards. Lightweight and ventilated.', 5500, 7000, 'cricket', ARRAY['https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=800'], 40, false, ARRAY['helmet','safety','cricket'], 4.7, 134),
('Volleyball - FIVB Approved', 'FIVB approved indoor volleyball with 18-panel design. Machine-stitched with official specifications.', 1800, 2400, 'volleyball', ARRAY['https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?w=800'], 70, false, ARRAY['volleyball','FIVB','official'], 4.5, 56);
