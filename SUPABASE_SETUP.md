# Supabase Migration Setup Guide

## Quick Start (3 steps)

### Step 1: Create Supabase Project
1. Go to https://supabase.com
2. Click "Sign Up"
3. Create account with email or GitHub
4. Create a new project (free tier is fine)
5. Wait for project to be ready (~1 minute)

### Step 2: Get API Credentials
1. Go to **Settings** → **API**
2. Copy your:
   - **Project URL** (looks like: https://xxxx.supabase.co)
   - **anon key** (public key)
3. Save these somewhere safe

### Step 3: Create .env.local
In your project root (`C:\Jeevanreport2.0`), create a file named `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project-url.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

Replace with your actual credentials from Step 2.

## Automated Setup (Run These Commands)

### 1. Install Supabase CLI
```bash
bun install -g supabase
```

### 2. Create Table in Supabase
In your Supabase dashboard:
1. Go to **SQL Editor**
2. Click **New Query**
3. Paste this SQL:

```sql
CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY,
  barcode TEXT UNIQUE,
  name TEXT,
  brand TEXT,
  category TEXT,
  trust_score INTEGER,
  trust_level TEXT,
  data JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_products_barcode ON products(barcode);
CREATE INDEX idx_products_name ON products(name);
CREATE INDEX idx_products_brand ON products(brand);
CREATE INDEX idx_products_category ON products(category);
```

4. Click **Run**

### 3. Migrate Your 820k Products
From command line:

```bash
cd C:\Jeevanreport2.0
python migrate_to_supabase.py "https://your-project.supabase.co" "your-anon-key"
```

This will take ~10-15 minutes to migrate all products.

### 4. Enable Row Level Security (Optional but Recommended)
In Supabase SQL Editor, run:

```sql
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Products are publicly readable" ON products
  FOR SELECT USING (true);
```

## Verify Migration

In your Supabase dashboard:
1. Go to **Table Editor**
2. Click **products** table
3. Should show 820,030 rows

## Deploy Updated Code

After migration completes:

```bash
cd C:\Jeevanreport2.0
git add .
git commit -m "Add Supabase database integration with 820k products"
git push origin main
```

Netlify will auto-deploy in 2-3 minutes!

## Testing

Once deployed, test at:
https://cheery-macaron-afeefa.netlify.app/

- Try searching for products
- Test barcode scanning
- Should now show 820,030 products available

## Troubleshooting

**Products not showing?**
- Check `.env.local` has correct credentials
- Verify table was created in Supabase
- Check migration completed successfully

**Slow queries?**
- Make sure indexes were created (step 3)
- Supabase free tier has some query limits

**Getting 401 errors?**
- Double-check anon key in `.env.local`
- Make sure Row Level Security allows SELECT

## Support

For help with Supabase:
- https://supabase.com/docs
- https://supabase.com/docs/guides/realtime-databases

For help with the migration:
- Check migration script output for errors
- Review browser console for API errors
