# 🚀 Quick Setup Guide — Goosi Industry

## Prerequisites
- Node.js 18+ installed
- A free Supabase account (supabase.com)

---

## Step 1 — Install dependencies
```bash
npm install
```

## Step 2 — Supabase Setup (5 minutes)

1. Go to [supabase.com](https://supabase.com) → Create new project
2. Open **SQL Editor** → paste and run the entire `supabase-schema.sql` file
3. Go to **Settings → API** → copy your keys

## Step 3 — Create `.env.local`

Create a file called `.env.local` in the root folder:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
NEXT_PUBLIC_UNSPLASH_ACCESS_KEY=your_unsplash_key_optional
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Step 4 — Create Admin User

1. Visit `http://localhost:3000/auth/register`
2. Register with `admin@goosi.com`
3. In Supabase → SQL Editor, run:
```sql
UPDATE profiles SET role = 'admin' WHERE email = 'admin@goosi.com';
```

## Step 5 — Run the dev server
```bash
npm run dev
```

Open **http://localhost:3000** 🎉

---

## Troubleshooting

**`Module not found` errors** → Run `npm install` again

**Supabase auth errors** → Check your `.env.local` keys, make sure there are no spaces

**Images not loading** → The app uses Unsplash CDN URLs — they work without an API key

**Admin panel 404** → Make sure you ran the SQL schema and set your user role to 'admin'

---

## VS Code Extensions (Recommended)
- ES7+ React/Redux/React-Native snippets
- Tailwind CSS IntelliSense
- Prettier - Code formatter
- GitLens
