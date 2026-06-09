-- ============================================================
-- Katove — Complete Database Setup
-- Drop + recreate cleanly. Run once in Supabase SQL Editor.
-- ============================================================

DROP TABLE IF EXISTS public.hero_slides CASCADE;
DROP TABLE IF EXISTS public.settings CASCADE;
DROP TABLE IF EXISTS public.subscriptions CASCADE;
DROP TABLE IF EXISTS public.contact_messages CASCADE;
DROP TABLE IF EXISTS public.orders CASCADE;
DROP TABLE IF EXISTS public.addresses CASCADE;
DROP TABLE IF EXISTS public.products CASCADE;
DROP TABLE IF EXISTS public.categories CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user;

-- ═══ 1. CATEGORIES ═══
CREATE TABLE public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "categories_public_read" ON public.categories FOR SELECT USING (true);

INSERT INTO public.categories (name, slug, description) VALUES
  ('Rolex', 'rolex', 'Swiss precision timepieces'),
  ('Audemars Piguet', 'audemars-piguet', 'Haute horlogerie'),
  ('Cartier', 'cartier', 'French luxury'),
  ('Louis Vuitton', 'louis-vuitton', 'Maison française'),
  ('Dior', 'dior', 'Couture & accessories'),
  ('Goyard', 'goyard', 'Trunk-maker since 1792'),
  ('Frames', 'frames', 'Luxury eyewear');

-- ═══ 2. PRODUCTS ═══
CREATE TABLE public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  price DOUBLE PRECISION NOT NULL,
  image_url TEXT,
  category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  is_top_pick BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "products_public_read" ON public.products FOR SELECT USING (true);

INSERT INTO public.products (name, slug, description, price, image_url, category_id, is_top_pick) VALUES
  -- Non-top picks (Luxury Products)
  ('Rolex Daytona 116500LN', 'rolex-daytona', 'Ceramic bezel, white dial. The definitive chronograph.', 32500, 'https://i.ibb.co/x8KtRW7c/1773330843831-4ee70b0f.jpg', (SELECT id FROM public.categories WHERE slug = 'rolex'), false),
  ('Rolex Submariner Date', 'rolex-submariner', 'Ceramic bezel, black dial. The diver''s benchmark.', 18500, 'https://i.ibb.co/x8KtRW7c/1773330843831-4ee70b0f.jpg', (SELECT id FROM public.categories WHERE slug = 'rolex'), false),
  ('AP Royal Oak 15500ST', 'ap-royal-oak', 'Blue dial, steel bracelet. Iconic octagonal bezel.', 42500, 'https://i.ibb.co/x8KtRW7c/1773330843831-4ee70b0f.jpg', (SELECT id FROM public.categories WHERE slug = 'audemars-piguet'), false),
  ('Cartier Love Bracelet SM', 'cartier-love-sm', '18K yellow gold. The eternal symbol of love.', 7500, 'https://i.ibb.co/x8KtRW7c/1773330843831-4ee70b0f.jpg', (SELECT id FROM public.categories WHERE slug = 'cartier'), false),
  ('Cartier Panthere', 'cartier-panthere', 'Medium model, steel & gold. The feline icon.', 12400, 'https://i.ibb.co/x8KtRW7c/1773330843831-4ee70b0f.jpg', (SELECT id FROM public.categories WHERE slug = 'cartier'), false),
  ('Louis Vuitton Neverfull MM', 'lv-neverfull-mm', 'Damier Azur canvas. The iconic tote.', 2150, 'https://i.ibb.co/x8KtRW7c/1773330843831-4ee70b0f.jpg', (SELECT id FROM public.categories WHERE slug = 'louis-vuitton'), false),
  ('Dior Saddle Bag', 'dior-saddle', 'Blue Oblique canvas. A true collector''s piece.', 4200, 'https://i.ibb.co/x8KtRW7c/1773330843831-4ee70b0f.jpg', (SELECT id FROM public.categories WHERE slug = 'dior'), false),
  ('Goyard Belvedere PM', 'goyard-belvedere', 'Chevron canvas. Understated Parisian elegance.', 3200, 'https://i.ibb.co/qYZT52bt/1773330805293-6e5754d4.jpg', (SELECT id FROM public.categories WHERE slug = 'goyard'), false),
  
  -- Top 10 Products Of The Month
  ('louis vuitton Bag', 'lv-bag', 'Louis Vuitton luxury bag', 300, 'https://aprlqajbairipommvnra.supabase.co/storage/v1/object/public/product-images/products/1773330962788-20fb4c93.jpg', (SELECT id FROM public.categories WHERE slug = 'louis-vuitton'), true),
  ('louis vuitton Wallet', 'lv-wallet-1', 'Louis Vuitton luxury wallet', 130, 'https://aprlqajbairipommvnra.supabase.co/storage/v1/object/public/product-images/products/1773330843831-4ee70b0f.jpg', (SELECT id FROM public.categories WHERE slug = 'louis-vuitton'), true),
  ('Goyard', 'goyard-1', 'Goyard exclusive card holder', 40, 'https://aprlqajbairipommvnra.supabase.co/storage/v1/object/public/product-images/products/1773330805293-6e5754d4.jpg', (SELECT id FROM public.categories WHERE slug = 'goyard'), true),
  ('Goyard', 'goyard-2', 'Goyard exclusive card holder', 50, 'https://aprlqajbairipommvnra.supabase.co/storage/v1/object/public/product-images/products/1773330768070-ac7832d7.jpg', (SELECT id FROM public.categories WHERE slug = 'goyard'), true),
  ('Goyard Wallet', 'goyard-wallet-1', 'Classic Goyard compact wallet', 90, 'https://aprlqajbairipommvnra.supabase.co/storage/v1/object/public/product-images/products/1773330697740-7a217cc9.jpg', (SELECT id FROM public.categories WHERE slug = 'goyard'), true),
  ('Goyard Wallet', 'goyard-wallet-2', 'Classic Goyard bi-fold wallet', 130, 'https://aprlqajbairipommvnra.supabase.co/storage/v1/object/public/product-images/products/1773330653497-8e02497e.jpg', (SELECT id FROM public.categories WHERE slug = 'goyard'), true),
  ('Goyard Wallet', 'goyard-wallet-3', 'Classic Goyard zip wallet', 120, 'https://aprlqajbairipommvnra.supabase.co/storage/v1/object/public/product-images/products/1773330623390-6091333f.jpg', (SELECT id FROM public.categories WHERE slug = 'goyard'), true),
  ('Goyard Wallet', 'goyard-wallet-4', 'Classic Goyard long wallet', 140, 'https://aprlqajbairipommvnra.supabase.co/storage/v1/object/public/product-images/products/1773330601858-f8d18d1d.jpg', (SELECT id FROM public.categories WHERE slug = 'goyard'), true),
  ('Goyard Wallet', 'goyard-wallet-5', 'Classic Goyard travel organizer', 140, 'https://aprlqajbairipommvnra.supabase.co/storage/v1/object/public/product-images/products/1773330579707-428fd7e5.jpg', (SELECT id FROM public.categories WHERE slug = 'goyard'), true),
  ('Goyard', 'goyard-3', 'Goyard luxury pouch', 170, 'https://aprlqajbairipommvnra.supabase.co/storage/v1/object/public/product-images/products/1773330346720-3fe315ed.jpg', (SELECT id FROM public.categories WHERE slug = 'goyard'), true)
ON CONFLICT (slug) DO NOTHING;

-- ═══ 3. PROFILES ═══
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL DEFAULT '',
  email TEXT NOT NULL DEFAULT '',
  phone TEXT,
  avatar_url TEXT,
  role TEXT NOT NULL DEFAULT 'customer',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "profiles_select_own" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "profiles_update_own" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "profiles_insert_own" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, name, email, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'User'),
    COALESCE(NEW.email, ''),
    'customer'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ═══ 4. ADDRESSES ═══
CREATE TABLE public.addresses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  phone TEXT,
  line1 TEXT NOT NULL,
  line2 TEXT,
  city TEXT NOT NULL,
  postal_code TEXT,
  country TEXT NOT NULL DEFAULT 'Georgia',
  is_default BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.addresses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "addresses_select_own" ON public.addresses FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "addresses_insert_own" ON public.addresses FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "addresses_update_own" ON public.addresses FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "addresses_delete_own" ON public.addresses FOR DELETE USING (auth.uid() = user_id);

-- ═══ 5. ORDERS ═══
CREATE TABLE public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  address_id UUID REFERENCES public.addresses(id) ON DELETE SET NULL,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT,
  customer_address TEXT,
  items JSONB NOT NULL DEFAULT '[]',
  total DOUBLE PRECISION NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "orders_select_own" ON public.orders FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "orders_insert_own" ON public.orders FOR INSERT WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

-- ═══ 6. CONTACT MESSAGES ═══
CREATE TABLE public.contact_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "contact_messages_insert" ON public.contact_messages FOR INSERT WITH CHECK (true);
CREATE POLICY "contact_messages_select_own" ON public.contact_messages FOR SELECT USING (auth.uid() IS NOT NULL);

-- ═══ 7. SUBSCRIPTIONS ═══
CREATE TABLE public.subscriptions (
  id BIGSERIAL PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "subscriptions_insert" ON public.subscriptions FOR INSERT WITH CHECK (true);

-- ═══ 8. HERO SLIDES ═══
CREATE TABLE public.hero_slides (
  id BIGSERIAL PRIMARY KEY,
  badge_label TEXT NOT NULL DEFAULT '',
  title TEXT NOT NULL DEFAULT '',
  subtitle TEXT NOT NULL DEFAULT '',
  accent_color TEXT NOT NULL DEFAULT '#CCFF00',
  button_color TEXT NOT NULL DEFAULT '#CCFF00',
  image_url TEXT NOT NULL DEFAULT '',
  discount_text TEXT NOT NULL DEFAULT '',
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.hero_slides ENABLE ROW LEVEL SECURITY;
CREATE POLICY "hero_slides_public_read" ON public.hero_slides FOR SELECT USING (true);

INSERT INTO public.hero_slides (badge_label, title, subtitle, accent_color, button_color, image_url, discount_text, sort_order) VALUES
  ('IMMERSIVE AUDIO', 'Hear Every Footstep Clearly', 'Precision spatial audio that puts you right in the center of the action.', '#FF2ECC', '#FF2ECC', 'https://i.ibb.co/x8KtRW7c/1773330843831-4ee70b0f.jpg', '-10%', 1),
  ('ERGONOMIC DESIGN', 'Level Up Your Comfort Zone', 'Experience the ultimate in gaming comfort with our new futuristic ergonomic chairs.', '#00E5FF', '#00E5FF', 'https://i.ibb.co/jvXXcBMF/1773329250588-c2937090.jpg', '-15%', 2),
  ('NEW ARRIVAL', 'Discover Swiss Timepieces', 'Curated collection of the world''s finest horology. Certified pre-owned and vintage icons.', '#CCFF00', '#CCFF00', 'https://i.ibb.co/qYZT52bt/1773330805293-6e5754d4.jpg', '-12%', 3);

-- ═══ 9. SETTINGS ═══
CREATE TABLE public.settings (
  id BIGINT PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  font_family TEXT DEFAULT 'Inter, sans-serif',
  primary_color TEXT DEFAULT '#ccff00',
  site_name TEXT DEFAULT 'Katove',
  site_description TEXT DEFAULT 'Ecommerce Store',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "settings_public_read" ON public.settings FOR SELECT USING (true);

INSERT INTO public.settings (id, font_family, primary_color, site_name, site_description)
VALUES (1, 'Inter, sans-serif', '#ccff00', 'Katove', 'Ecommerce Store');

-- ═══ 10. INDEXES ═══
CREATE INDEX IF NOT EXISTS idx_addresses_user_id ON public.addresses(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON public.orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_address_id ON public.orders(address_id);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);
CREATE INDEX IF NOT EXISTS idx_products_category_id ON public.products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_slug ON public.products(slug);
