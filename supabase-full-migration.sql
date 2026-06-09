-- ============================================================
-- Katove — Complete Database Setup
-- Run ALL of this in Supabase SQL Editor (one paste, one run)
-- ============================================================

-- ═══ 1. CATEGORIES ═══
CREATE TABLE IF NOT EXISTS public.categories (
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
  ('Frames', 'frames', 'Luxury eyewear')
ON CONFLICT (slug) DO NOTHING;

-- ═══ 2. PRODUCTS ═══
CREATE TABLE IF NOT EXISTS public.products (
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
  ('Rolex Daytona 116500LN', 'rolex-daytona', 'Ceramic bezel, white dial. The definitive chronograph.', 32500, 'https://i.ibb.co/x8KtRW7c/1773330843831-4ee70b0f.jpg', (SELECT id FROM public.categories WHERE slug = 'rolex'), true),
  ('Rolex Submariner Date', 'rolex-submariner', 'Ceramic bezel, black dial. The diver''s benchmark.', 18500, 'https://i.ibb.co/x8KtRW7c/1773330843831-4ee70b0f.jpg', (SELECT id FROM public.categories WHERE slug = 'rolex'), true),
  ('AP Royal Oak 15500ST', 'ap-royal-oak', 'Blue dial, steel bracelet. Iconic octagonal bezel.', 42500, 'https://i.ibb.co/x8KtRW7c/1773330843831-4ee70b0f.jpg', (SELECT id FROM public.categories WHERE slug = 'audemars-piguet'), true),
  ('Cartier Love Bracelet SM', 'cartier-love-sm', '18K yellow gold. The eternal symbol of love.', 7500, 'https://i.ibb.co/x8KtRW7c/1773330843831-4ee70b0f.jpg', (SELECT id FROM public.categories WHERE slug = 'cartier'), true),
  ('Cartier Panthere', 'cartier-panthere', 'Medium model, steel & gold. The feline icon.', 12400, 'https://i.ibb.co/x8KtRW7c/1773330843831-4ee70b0f.jpg', (SELECT id FROM public.categories WHERE slug = 'cartier'), false),
  ('Louis Vuitton Neverfull MM', 'lv-neverfull-mm', 'Damier Azur canvas. The iconic tote.', 2150, 'https://i.ibb.co/x8KtRW7c/1773330843831-4ee70b0f.jpg', (SELECT id FROM public.categories WHERE slug = 'louis-vuitton'), true),
  ('Louis Vuitton Wallet', 'lv-wallet-1', 'Louis Vuitton luxury wallet', 130, 'https://i.ibb.co/Mk376wqV/1773329923211-2f148b38.jpg', (SELECT id FROM public.categories WHERE slug = 'louis-vuitton'), false),
  ('Louis Vuitton Bag', 'lv-bag', 'Louis Vuitton luxury bag', 300, 'https://i.ibb.co/8L6zccv0/1773330962788-20fb4c93.webp', (SELECT id FROM public.categories WHERE slug = 'louis-vuitton'), false),
  ('Dior Saddle Bag', 'dior-saddle', 'Blue Oblique canvas. A true collector''s piece.', 4200, 'https://i.ibb.co/x8KtRW7c/1773330843831-4ee70b0f.jpg', (SELECT id FROM public.categories WHERE slug = 'dior'), true),
  ('Goyard Belvedere PM', 'goyard-belvedere', 'Chevron canvas. Understated Parisian elegance.', 3200, 'https://i.ibb.co/qYZT52bt/1773330805293-6e5754d4.jpg', (SELECT id FROM public.categories WHERE slug = 'goyard'), false),
  ('Goyard', 'goyard-1', 'Goyard exclusive accessory', 40, 'https://i.ibb.co/qYZT52bt/1773330805293-6e5754d4.jpg', (SELECT id FROM public.categories WHERE slug = 'goyard'), false),
  ('Goyard', 'goyard-2', 'Goyard exclusive accessory', 50, 'https://i.ibb.co/YBnqxRbH/1773330768070-ac7832d7.jpg', (SELECT id FROM public.categories WHERE slug = 'goyard'), false)
ON CONFLICT (slug) DO NOTHING;

-- ═══ 3. PROFILES ═══
CREATE TABLE IF NOT EXISTS public.profiles (
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

-- Auto-create profile on signup
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

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ═══ 4. ADDRESSES ═══
CREATE TABLE IF NOT EXISTS public.addresses (
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
CREATE TABLE IF NOT EXISTS public.orders (
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
CREATE TABLE IF NOT EXISTS public.contact_messages (
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
CREATE TABLE IF NOT EXISTS public.subscriptions (
  id BIGSERIAL PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "subscriptions_insert" ON public.subscriptions FOR INSERT WITH CHECK (true);

-- ═══ 8. HERO SLIDES ═══
CREATE TABLE IF NOT EXISTS public.hero_slides (
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

-- ═══ 9. INDEXES ═══
CREATE INDEX IF NOT EXISTS idx_addresses_user_id ON public.addresses(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON public.orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_address_id ON public.orders(address_id);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);
CREATE INDEX IF NOT EXISTS idx_products_category_id ON public.products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_slug ON public.products(slug);
