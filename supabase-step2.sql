-- ============================================================
-- STEP 2: Insert all products (run this second)
-- ============================================================

INSERT INTO public.products (name, slug, price, image_url, category_id) VALUES

-- Louis Vuitton (6 products)
('louis vuitton Wallet', 'lv-wallet-1', 130.00, 'https://i.ibb.co/x8KtRW7c/1773330843831-4ee70b0f.jpg', (SELECT id FROM public.categories WHERE slug = 'louis-vuitton')),
('louis vuitton Bag', 'lv-bag', 300.00, 'https://i.ibb.co/8L6zccv0/1773330962788-20fb4c93.webp', (SELECT id FROM public.categories WHERE slug = 'louis-vuitton')),
('louis vuitton Wallet', 'lv-wallet-2', 120.00, 'https://i.ibb.co/VY4qr24Q/1773329940314-84fe1786.jpg', (SELECT id FROM public.categories WHERE slug = 'louis-vuitton')),
('louis vuitton Wallet', 'lv-wallet-3', 120.00, 'https://i.ibb.co/Mk376wqV/1773329923211-2f148b38.jpg', (SELECT id FROM public.categories WHERE slug = 'louis-vuitton')),
('louis vuitton Wallet', 'lv-wallet-4', 110.00, 'https://i.ibb.co/C56tHDh4/1773329791250-94cca5df.jpg', (SELECT id FROM public.categories WHERE slug = 'louis-vuitton')),
('louis vuitton Wallet', 'lv-wallet-5', 109.98, 'https://i.ibb.co/nGZW0xT/1773329739583-44d7ad12.jpg', (SELECT id FROM public.categories WHERE slug = 'louis-vuitton')),

-- Goyard (18 products)
('Goyard', 'goyard-1', 40.00, 'https://i.ibb.co/qYZT52bt/1773330805293-6e5754d4.jpg', (SELECT id FROM public.categories WHERE slug = 'goyard')),
('Goyard', 'goyard-2', 50.00, 'https://i.ibb.co/YBnqxRbH/1773330768070-ac7832d7.jpg', (SELECT id FROM public.categories WHERE slug = 'goyard')),
('Goyard Wallet', 'goyard-wallet-1', 90.00, 'https://i.ibb.co/C5Qfr4Qt/1773330697740-7a217cc9.jpg', (SELECT id FROM public.categories WHERE slug = 'goyard')),
('Goyard Wallet', 'goyard-wallet-2', 130.00, 'https://i.ibb.co/WWMzpC3K/1773330653497-8e02497e.jpg', (SELECT id FROM public.categories WHERE slug = 'goyard')),
('Goyard Wallet', 'goyard-wallet-3', 120.00, 'https://i.ibb.co/zWJDgzmZ/1773330623390-6091333f.jpg', (SELECT id FROM public.categories WHERE slug = 'goyard')),
('Goyard Wallet', 'goyard-wallet-4', 140.00, 'https://i.ibb.co/93kF3Bnz/1773330601858-f8d18d1d.jpg', (SELECT id FROM public.categories WHERE slug = 'goyard')),
('Goyard Wallet', 'goyard-wallet-5', 140.00, 'https://i.ibb.co/35N4Yh6F/1773330579707-428fd7e5.jpg', (SELECT id FROM public.categories WHERE slug = 'goyard')),
('Goyard', 'goyard-3', 170.00, 'https://i.ibb.co/tp0p6TwJ/1773330346720-3fe315ed.jpg', (SELECT id FROM public.categories WHERE slug = 'goyard')),
('Goyard Wallet', 'goyard-wallet-6', 120.00, 'https://i.ibb.co/JjjDbY7Q/1773329670082-6b1ea86a.jpg', (SELECT id FROM public.categories WHERE slug = 'goyard')),
('Goyard Wallet', 'goyard-wallet-7', 120.00, 'https://i.ibb.co/JRD03Y6G/1773329656101-7077c833.jpg', (SELECT id FROM public.categories WHERE slug = 'goyard')),
('Goyard Wallet', 'goyard-wallet-8', 120.00, 'https://i.ibb.co/TMb6B7st/1773329638591-9ebf9500.jpg', (SELECT id FROM public.categories WHERE slug = 'goyard')),
('Goyard Wallet', 'goyard-wallet-9', 120.00, 'https://i.ibb.co/Q7ZYyB56/1773329622157-7eaf2fc6.jpg', (SELECT id FROM public.categories WHERE slug = 'goyard')),
('Goyard Wallet', 'goyard-wallet-10', 119.98, 'https://i.ibb.co/1YTRzvLp/1773329604534-923bd881.jpg', (SELECT id FROM public.categories WHERE slug = 'goyard')),
('Goyard Wallet', 'goyard-wallet-11', 90.00, 'https://i.ibb.co/v70P6ZV/1773329582050-0271626a.jpg', (SELECT id FROM public.categories WHERE slug = 'goyard')),
('Goyard Wallet', 'goyard-wallet-12', 120.00, 'https://i.ibb.co/2mgvfx3/1773329543922-315c75ac.jpg', (SELECT id FROM public.categories WHERE slug = 'goyard')),
('Goyard Wallet', 'goyard-wallet-13', 129.96, 'https://i.ibb.co/SDT733fr/1773329523583-6c815109.jpg', (SELECT id FROM public.categories WHERE slug = 'goyard')),
('Goyard Wallet', 'goyard-wallet-14', 130.00, 'https://i.ibb.co/dwgZcM94/1773329509861-e30fa42a.jpg', (SELECT id FROM public.categories WHERE slug = 'goyard')),
('Goyard Wallet', 'goyard-wallet-15', 120.00, 'https://i.ibb.co/NXmbTD8/1773329485522-70a4e269.jpg', (SELECT id FROM public.categories WHERE slug = 'goyard')),

-- Cartier (2 products)
('Juste un Clou ring, small model', 'cartier-juste-un-clou-ring', 130.00, 'https://i.ibb.co/qSp0DyW/1773327072893-6e439327.jpg', (SELECT id FROM public.categories WHERE slug = 'cartier')),
('Panthère de Cartier watch', 'cartier-panthere-watch', 230.00, 'https://i.ibb.co/ycB3KTgQ/1773326935125-ba5be620.jpg', (SELECT id FROM public.categories WHERE slug = 'cartier')),

-- Rolex (5 products)
('Rolex Day-Date', 'rolex-day-date-1', 435.00, 'https://i.ibb.co/zTb29spM/1773329275501-88dfcefe.jpg', (SELECT id FROM public.categories WHERE slug = 'rolex')),
('Rolex Day-Date', 'rolex-day-date-2', 444.00, 'https://i.ibb.co/jvXXcBMF/1773329250588-c2937090.jpg', (SELECT id FROM public.categories WHERE slug = 'rolex')),
('Rolex Day-Date', 'rolex-day-date-3', 555.00, 'https://i.ibb.co/8gJTfmHH/1773329230916-b892a1be.jpg', (SELECT id FROM public.categories WHERE slug = 'rolex')),
('Rolex Day-Date', 'rolex-day-date-4', 555.00, 'https://i.ibb.co/S4GTpLK2/1773329210413-463e1809.jpg', (SELECT id FROM public.categories WHERE slug = 'rolex')),
('Rolex Day-Date', 'rolex-day-date-5', 500.00, 'https://i.ibb.co/9kh4t0V1/1773327720819-e0e3b05b.jpg', (SELECT id FROM public.categories WHERE slug = 'rolex')),

-- Dior (6 products)
('Dior', 'dior-1', 150.00, 'https://i.ibb.co/XZb7ZR0H/1773329770381-4e79bf32.jpg', (SELECT id FROM public.categories WHERE slug = 'dior')),
('Dior wallet', 'dior-wallet-1', 120.00, 'https://i.ibb.co/WNRmtqrm/1773329447416-6d1ae41d.jpg', (SELECT id FROM public.categories WHERE slug = 'dior')),
('Dior wallet', 'dior-wallet-2', 119.98, 'https://i.ibb.co/6R2SV2Sy/1773329424707-529b985c.jpg', (SELECT id FROM public.categories WHERE slug = 'dior')),
('Dior wallet', 'dior-wallet-3', 140.00, 'https://i.ibb.co/cpM8jq5/1773329403101-d38f63a8.jpg', (SELECT id FROM public.categories WHERE slug = 'dior')),
('Dior wallet', 'dior-wallet-4', 100.00, 'https://i.ibb.co/XZWL5r49/1773329383555-965e4e19.jpg', (SELECT id FROM public.categories WHERE slug = 'dior')),
('Dior wallet', 'dior-wallet-5', 120.00, 'https://i.ibb.co/8pc8fQw/1773329350740-6e27ae39.jpg', (SELECT id FROM public.categories WHERE slug = 'dior'));
