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
  -- Rolex (8 products)
  ('Rolex Daytona 116500LN', 'rolex-daytona', 'Ceramic bezel, white dial. The definitive chronograph.', 32500, 'https://i.ibb.co/x8KtRW7c/1773330843831-4ee70b0f.jpg', (SELECT id FROM public.categories WHERE slug = 'rolex'), true),
  ('Rolex Submariner Date 126610LN', 'rolex-submariner', 'Ceramic bezel, black dial. The diver''s benchmark.', 18500, 'https://i.ibb.co/x8KtRW7c/1773330843831-4ee70b0f.jpg', (SELECT id FROM public.categories WHERE slug = 'rolex'), true),
  ('Rolex GMT-Master II Batman', 'rolex-gmt-batman', 'Blue & black ceramic bezel. The traveler''s choice.', 22500, 'https://i.ibb.co/x8KtRW7c/1773330843831-4ee70b0f.jpg', (SELECT id FROM public.categories WHERE slug = 'rolex'), true),
  ('Rolex Datejust 41', 'rolex-datejust-41', 'Fluted bezel, jubilee bracelet. Timeless elegance.', 14500, 'https://i.ibb.co/x8KtRW7c/1773330843831-4ee70b0f.jpg', (SELECT id FROM public.categories WHERE slug = 'rolex'), true),
  ('Rolex Day-Date 40', 'rolex-day-date-40', '18K yellow gold. The president''s watch.', 48500, 'https://i.ibb.co/x8KtRW7c/1773330843831-4ee70b0f.jpg', (SELECT id FROM public.categories WHERE slug = 'rolex'), false),
  ('Rolex Explorer 36', 'rolex-explorer-36', 'The adventurer''s essential. Clean, rugged, iconic.', 10500, 'https://i.ibb.co/x8KtRW7c/1773330843831-4ee70b0f.jpg', (SELECT id FROM public.categories WHERE slug = 'rolex'), false),
  ('Rolex Sky-Dweller', 'rolex-sky-dweller', 'Annual calendar, dual time zone. Precision complexity.', 27500, 'https://i.ibb.co/x8KtRW7c/1773330843831-4ee70b0f.jpg', (SELECT id FROM public.categories WHERE slug = 'rolex'), false),
  ('Rolex Yacht-Master 42', 'rolex-yacht-master-42', 'Titanium case, matte black bezel. The sailor''s dream.', 26500, 'https://i.ibb.co/x8KtRW7c/1773330843831-4ee70b0f.jpg', (SELECT id FROM public.categories WHERE slug = 'rolex'), false),

  -- Audemars Piguet (4 products)
  ('AP Royal Oak 15500ST', 'ap-royal-oak', 'Blue dial, steel bracelet. Iconic octagonal bezel.', 42500, 'https://i.ibb.co/x8KtRW7c/1773330843831-4ee70b0f.jpg', (SELECT id FROM public.categories WHERE slug = 'audemars-piguet'), true),
  ('AP Royal Oak Offshore 26420ST', 'ap-royal-oak-offshore', 'Chronograph, black ceramic pushers. Bold and muscular.', 38500, 'https://i.ibb.co/x8KtRW7c/1773330843831-4ee70b0f.jpg', (SELECT id FROM public.categories WHERE slug = 'audemars-piguet'), true),
  ('AP Royal Oak Jumbo 15202ST', 'ap-royal-oak-jumbo', 'The original. Ultra-thin, 39mm. Collector grail.', 65000, 'https://i.ibb.co/x8KtRW7c/1773330843831-4ee70b0f.jpg', (SELECT id FROM public.categories WHERE slug = 'audemars-piguet'), false),
  ('AP Royal Oak Selfwinding 41mm', 'ap-royal-oak-41mm', 'Green dial, rose gold. Modern sophistication.', 52500, 'https://i.ibb.co/x8KtRW7c/1773330843831-4ee70b0f.jpg', (SELECT id FROM public.categories WHERE slug = 'audemars-piguet'), false),

  -- Cartier (5 products)
  ('Cartier Love Bracelet SM', 'cartier-love-sm', '18K yellow gold. The eternal symbol of love.', 7500, 'https://i.ibb.co/x8KtRW7c/1773330843831-4ee70b0f.jpg', (SELECT id FROM public.categories WHERE slug = 'cartier'), true),
  ('Cartier Panthere', 'cartier-panthere', 'Medium model, steel & gold. The feline icon.', 12400, 'https://i.ibb.co/x8KtRW7c/1773330843831-4ee70b0f.jpg', (SELECT id FROM public.categories WHERE slug = 'cartier'), false),
  ('Cartier Tank Louis Cartier', 'cartier-tank-louis', '18K gold, manual wind. The timeless rectangle.', 18500, 'https://i.ibb.co/x8KtRW7c/1773330843831-4ee70b0f.jpg', (SELECT id FROM public.categories WHERE slug = 'cartier'), true),
  ('Cartier Ballon Bleu 33mm', 'cartier-ballon-bleu', 'Steel, guilloche dial. Floating elegance.', 9200, 'https://i.ibb.co/x8KtRW7c/1773330843831-4ee70b0f.jpg', (SELECT id FROM public.categories WHERE slug = 'cartier'), false),
  ('Cartier Santos de Cartier', 'cartier-santos', 'Steel, square bezel. The original pilots watch.', 10500, 'https://i.ibb.co/x8KtRW7c/1773330843831-4ee70b0f.jpg', (SELECT id FROM public.categories WHERE slug = 'cartier'), true),

  -- Louis Vuitton (7 products)
  ('Louis Vuitton Neverfull MM', 'lv-neverfull-mm', 'Damier Azur canvas. The iconic tote.', 2150, 'https://i.ibb.co/x8KtRW7c/1773330843831-4ee70b0f.jpg', (SELECT id FROM public.categories WHERE slug = 'louis-vuitton'), true),
  ('Louis Vuitton Louis Vuitton Wallet', 'lv-wallet-1', 'Louis Vuitton luxury wallet', 130, 'https://i.ibb.co/Mk376wqV/1773329923211-2f148b38.jpg', (SELECT id FROM public.categories WHERE slug = 'louis-vuitton'), false),
  ('Louis Vuitton Bag', 'lv-bag', 'Louis Vuitton luxury bag', 300, 'https://i.ibb.co/8L6zccv0/1773330962788-20fb4c93.webp', (SELECT id FROM public.categories WHERE slug = 'louis-vuitton'), false),
  ('Louis Vuitton Speedy Bandouliere 25', 'lv-speedy-25', 'Monogram canvas. The classic city bag.', 1850, 'https://i.ibb.co/x8KtRW7c/1773330843831-4ee70b0f.jpg', (SELECT id FROM public.categories WHERE slug = 'louis-vuitton'), true),
  ('Louis Vuitton Alma BB', 'lv-alma-bb', 'Damier Ebene. Structured, elegant, timeless.', 2050, 'https://i.ibb.co/x8KtRW7c/1773330843831-4ee70b0f.jpg', (SELECT id FROM public.categories WHERE slug = 'louis-vuitton'), false),
  ('Louis Vuitton Onthego MM', 'lv-onthego-mm', 'Giant Monogram. The modern tote.', 2350, 'https://i.ibb.co/x8KtRW7c/1773330843831-4ee70b0f.jpg', (SELECT id FROM public.categories WHERE slug = 'louis-vuitton'), false),
  ('Louis Vuitton Keepall 55', 'lv-keepall-55', 'Monogram canvas. The iconic travel duffle.', 2650, 'https://i.ibb.co/x8KtRW7c/1773330843831-4ee70b0f.jpg', (SELECT id FROM public.categories WHERE slug = 'louis-vuitton'), true),

  -- Dior (3 products)
  ('Dior Saddle Bag', 'dior-saddle', 'Blue Oblique canvas. A true collector''s piece.', 4200, 'https://i.ibb.co/x8KtRW7c/1773330843831-4ee70b0f.jpg', (SELECT id FROM public.categories WHERE slug = 'dior'), true),
  ('Dior Lady Dior Small', 'dior-lady-dior', 'Cannage stitching, pale gold hardware. Grace incarnate.', 5800, 'https://i.ibb.co/x8KtRW7c/1773330843831-4ee70b0f.jpg', (SELECT id FROM public.categories WHERE slug = 'dior'), true),
  ('Dior Book Tote', 'dior-book-tote', 'Oblique embroidery. The maximalist carryall.', 3500, 'https://i.ibb.co/x8KtRW7c/1773330843831-4ee70b0f.jpg', (SELECT id FROM public.categories WHERE slug = 'dior'), false),

  -- Goyard (8 products)
  ('Goyard Belvedere PM', 'goyard-belvedere', 'Chevron canvas. Understated Parisian elegance.', 3200, 'https://i.ibb.co/qYZT52bt/1773330805293-6e5754d4.jpg', (SELECT id FROM public.categories WHERE slug = 'goyard'), false),
  ('Goyard Card Holder', 'goyard-1', 'Goyard exclusive card holder', 40, 'https://i.ibb.co/qYZT52bt/1773330805293-6e5754d4.jpg', (SELECT id FROM public.categories WHERE slug = 'goyard'), false),
  ('Goyard Card Holder', 'goyard-2', 'Goyard exclusive card holder', 50, 'https://i.ibb.co/YBnqxRbH/1773330768070-ac7832d7.jpg', (SELECT id FROM public.categories WHERE slug = 'goyard'), false),
  ('Goyard Compact Wallet', 'goyard-wallet-1', 'Classic Goyard compact wallet', 90, 'https://i.ibb.co/qYZT52bt/1773330805293-6e5754d4.jpg', (SELECT id FROM public.categories WHERE slug = 'goyard'), false),
  ('Goyard Bi-Fold Wallet', 'goyard-wallet-2', 'Classic Goyard bi-fold wallet', 130, 'https://i.ibb.co/qYZT52bt/1773330805293-6e5754d4.jpg', (SELECT id FROM public.categories WHERE slug = 'goyard'), false),
  ('Goyard Zip Wallet', 'goyard-wallet-3', 'Classic Goyard zip wallet', 120, 'https://i.ibb.co/qYZT52bt/1773330805293-6e5754d4.jpg', (SELECT id FROM public.categories WHERE slug = 'goyard'), false),
  ('Goyard Long Wallet', 'goyard-wallet-4', 'Classic Goyard long wallet', 140, 'https://i.ibb.co/qYZT52bt/1773330805293-6e5754d4.jpg', (SELECT id FROM public.categories WHERE slug = 'goyard'), false),
  ('Goyard Travel Organizer', 'goyard-wallet-5', 'Classic Goyard travel organizer', 140, 'https://i.ibb.co/qYZT52bt/1773330805293-6e5754d4.jpg', (SELECT id FROM public.categories WHERE slug = 'goyard'), false),

  -- Frames (4 products)
  ('Cartier Rimless', 'frames-cartier-rimless', 'Cartier rimless frames. Understated Parisian elegance.', 850, 'https://i.ibb.co/x8KtRW7c/1773330843831-4ee70b0f.jpg', (SELECT id FROM public.categories WHERE slug = 'frames'), false),
  ('Dior Lady Dior Sunglasses', 'frames-dior-sunglasses', 'Dior gradient cat-eye. Haute couture for your eyes.', 620, 'https://i.ibb.co/x8KtRW7c/1773330843831-4ee70b0f.jpg', (SELECT id FROM public.categories WHERE slug = 'frames'), false),
  ('LV Millionaire Sunglasses', 'frames-lv-millionaire', 'Louis Vuitton Millionaire. The iconic trendsetter.', 1050, 'https://i.ibb.co/x8KtRW7c/1773330843831-4ee70b0f.jpg', (SELECT id FROM public.categories WHERE slug = 'frames'), false),
  ('Goyard Frames', 'frames-goyard', 'Goyard chevron frames. Rare and exclusive.', 1200, 'https://i.ibb.co/x8KtRW7c/1773330843831-4ee70b0f.jpg', (SELECT id FROM public.categories WHERE slug = 'frames'), false)
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
