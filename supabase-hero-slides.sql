-- Create hero_slides table
CREATE TABLE IF NOT EXISTS hero_slides (
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

-- Enable RLS
ALTER TABLE hero_slides ENABLE ROW LEVEL SECURITY;

-- Allow public read (for the hero component)
CREATE POLICY "Allow public read" ON hero_slides FOR SELECT USING (true);

-- Insert slides matching the reference site
INSERT INTO hero_slides (badge_label, title, subtitle, accent_color, button_color, image_url, discount_text, sort_order)
VALUES
  (
    'IMMERSIVE AUDIO',
    'Hear Every Footstep Clearly',
    'Precision spatial audio that puts you right in the center of the action.',
    '#FF2ECC',
    '#FF2ECC',
    'https://i.ibb.co/x8KtRW7c/1773330843831-4ee70b0f.jpg',
    '-10%',
    1
  ),
  (
    'ERGONOMIC DESIGN',
    'Level Up Your Comfort Zone',
    'Experience the ultimate in gaming comfort with our new futuristic ergonomic chairs.',
    '#00E5FF',
    '#00E5FF',
    'https://i.ibb.co/jvXXcBMF/1773329250588-c2937090.jpg',
    '-15%',
    2
  ),
  (
    'NEW ARRIVAL',
    'Discover Swiss Timepieces',
    'Curated collection of the world''s finest horology. Certified pre-owned and vintage icons.',
    '#CCFF00',
    '#CCFF00',
    'https://i.ibb.co/qYZT52bt/1773330805293-6e5754d4.jpg',
    '-12%',
    3
  );
