-- Run this in Supabase SQL Editor to update existing orders table
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS payment_method TEXT NOT NULL DEFAULT 'bank_transfer';
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS payment_screenshot_url TEXT;
ALTER TABLE public.orders ALTER COLUMN status SET DEFAULT 'awaiting_payment';

-- Update existing pending orders to awaiting_payment
UPDATE public.orders SET status = 'awaiting_payment' WHERE status = 'pending';

-- Create storage bucket for payment screenshots
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'payment-screenshots',
  'payment-screenshots',
  true,
  10485760,
  ARRAY['image/png', 'image/jpeg', 'image/jpg', 'image/webp']
)
ON CONFLICT (id) DO NOTHING;

-- Allow public read access to payment screenshots
CREATE POLICY "payment_screenshots_public_read"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'payment-screenshots');

-- Allow authenticated users and anon to upload to the bucket
CREATE POLICY "payment_screenshots_upload"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'payment-screenshots');
