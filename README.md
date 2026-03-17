# 🏆 Goosi Industry — Full Stack Sports eCommerce Platform

> Production-ready sports eCommerce + B2B export platform built with Next.js 14, Supabase, Framer Motion, and AI image auto-fetch.

---

## 📁 Project Structure

```
goosi-industry/
├── app/
│   ├── page.tsx                    # Home page
│   ├── layout.tsx                  # Root layout + metadata + SEO
│   ├── globals.css                 # Global styles + Tailwind
│   ├── products/
│   │   ├── page.tsx                # Products listing with filters
│   │   ├── ProductsClient.tsx      # Client-side filter/sort UI
│   │   └── [id]/
│   │       ├── page.tsx            # Product detail page (SSR)
│   │       └── ProductDetailClient.tsx
│   ├── bulk/
│   │   └── page.tsx                # B2B bulk order inquiry
│   ├── cart/
│   │   └── page.tsx                # Full cart page
│   ├── checkout/
│   │   └── page.tsx                # Checkout + order placement
│   ├── dashboard/
│   │   └── page.tsx                # User dashboard (orders, wishlist, profile)
│   ├── admin/
│   │   ├── layout.tsx              # Admin sidebar layout
│   │   ├── page.tsx                # Admin dashboard with charts
│   │   ├── products/page.tsx       # Product CRUD + AI image fetch
│   │   ├── orders/page.tsx         # Order management + status updates
│   │   └── inquiries/page.tsx      # Bulk inquiry management
│   └── auth/
│       ├── login/page.tsx          # Login page
│       └── register/page.tsx       # Registration page
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx              # Sticky navbar + search modal + cart
│   │   ├── Footer.tsx              # Footer with links
│   │   └── CartDrawer.tsx          # Sliding cart drawer
│   ├── home/
│   │   ├── HeroSection.tsx         # Animated hero with blob effects
│   │   ├── StatsSection.tsx        # Key metrics strip
│   │   ├── CategoriesSection.tsx   # Sports categories grid
│   │   ├── FeaturedProducts.tsx    # Featured products grid
│   │   ├── ExportCTA.tsx           # B2B export call-to-action
│   │   ├── TestimonialsSection.tsx # Customer testimonials
│   │   ├── BrandsSection.tsx       # Brand certifications
│   │   └── NewsletterSection.tsx   # Email subscription
│   ├── products/
│   │   └── ProductCard.tsx         # Reusable product card + skeleton
│   └── shared/
│       └── AuthProvider.tsx        # Supabase auth session provider
├── lib/
│   ├── supabase/
│   │   ├── client.ts               # Browser Supabase client
│   │   └── server.ts               # Server + Admin Supabase clients
│   ├── actions.ts                  # All Server Actions (CRUD)
│   └── utils/
│       ├── index.ts                # formatPrice, formatDate, CATEGORIES
│       └── unsplash.ts             # AI image auto-fetch system
├── store/
│   └── index.ts                    # Zustand: cart + auth + UI stores
├── types/
│   └── index.ts                    # TypeScript types for everything
├── middleware.ts                   # Auth protection + role-based routing
├── supabase-schema.sql             # Full DB schema + RLS + sample data
├── tailwind.config.js
├── next.config.js
├── tsconfig.json
└── .env.example
```

---

## ⚡ Quick Start

### Step 1 — Clone and install
```bash
git clone <your-repo>
cd goosi-industry
npm install
```

### Step 2 — Set up Supabase

1. Go to [supabase.com](https://supabase.com) → Create new project
2. Go to **SQL Editor** → Paste and run `supabase-schema.sql`
3. Go to **Settings → API** → Copy your keys

### Step 3 — Set up Unsplash API (for AI image fetch)

1. Go to [unsplash.com/oauth/applications](https://unsplash.com/oauth/applications)
2. Create a new application → Copy Access Key

### Step 4 — Environment Variables

Create `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx...
SUPABASE_SERVICE_ROLE_KEY=eyJxxx...
NEXT_PUBLIC_UNSPLASH_ACCESS_KEY=your_unsplash_key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Step 5 — Create Admin User

After running the schema, go to Supabase SQL Editor and run:
```sql
-- First register via /auth/register with admin@goosi.com
-- Then promote to admin:
UPDATE profiles SET role = 'admin' WHERE email = 'admin@goosi.com';
```

### Step 6 — Run development server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 🔐 Auth & Roles

| Role  | Access |
|-------|--------|
| Guest | Browse products, submit bulk inquiries |
| User  | Everything + cart, orders, dashboard |
| Admin | Everything + /admin panel, product CRUD, order management |

---

## 🧠 AI Image System

When an admin creates a product:
1. Product name + category is sent to Unsplash API
2. 4 relevant sports images are fetched
3. URLs are stored in `products.images[]` array in Supabase
4. Displayed via Next.js `<Image>` with optimization

**Fallback:** If no Unsplash API key, curated hand-picked images load per category.

---

## 📊 Database Tables

| Table | Description |
|-------|-------------|
| `profiles` | User profiles with role (user/admin) |
| `products` | Products with images array, stock, categories |
| `orders` | Customer orders with status tracking |
| `order_items` | Line items per order |
| `cart_items` | Persistent cart storage |
| `bulk_inquiries` | B2B export inquiries |
| `reviews` | Product reviews with auto-rating update |

---

## 🌐 Pages & Routes

| Route | Description |
|-------|-------------|
| `/` | Home — hero, categories, featured products, export CTA |
| `/products` | All products with filters, sort, search |
| `/products/[id]` | Product detail with gallery, add to cart |
| `/bulk` | B2B bulk order inquiry form |
| `/cart` | Shopping cart |
| `/checkout` | Checkout with address + payment |
| `/dashboard` | User orders, wishlist, profile |
| `/auth/login` | Sign in |
| `/auth/register` | Create account |
| `/admin` | Admin dashboard with charts |
| `/admin/products` | Product CRUD + AI image fetch |
| `/admin/orders` | Order management |
| `/admin/inquiries` | Bulk inquiry management |

---

## 🚀 Deployment (Vercel)

```bash
npm run build      # Test build locally
vercel deploy      # Deploy to Vercel
```

**Environment variables to add in Vercel dashboard:**
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `NEXT_PUBLIC_UNSPLASH_ACCESS_KEY`
- `NEXT_PUBLIC_APP_URL` (set to your Vercel domain)

**In Supabase → Authentication → URL Configuration:**
- Site URL: `https://your-vercel-app.vercel.app`
- Redirect URLs: `https://your-vercel-app.vercel.app/**`

---

## 🎨 Design System

| Token | Value |
|-------|-------|
| Primary Blue | `#1D4ED8` |
| Secondary Purple | `#7C3AED` |
| Accent Green | `#16A34A` |
| Accent Orange | `#EA580C` |
| Font Display | Syne (bold, headers) |
| Font Body | Inter (readable, body) |
| Border Radius | 12–24px (rounded feel) |
| Shadows | Colored shadows matching brand |

---

## 📦 Tech Stack Summary

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Animations | Framer Motion |
| Database | Supabase (PostgreSQL) |
| Auth | Supabase Auth |
| Storage | Supabase Storage |
| State | Zustand (cart, auth, UI) |
| Charts | Recharts |
| Images | Unsplash API + Next.js Image |
| Forms | React Hook Form + Zod |
| Notifications | React Hot Toast |
| Deployment | Vercel |

---

## 🧪 Sample Data

The SQL schema includes 12 sample products across all 10 categories with real Unsplash images, ratings, and realistic pricing.

---

Built with ❤️ for Goosi Industry — Sialkot, Pakistan
