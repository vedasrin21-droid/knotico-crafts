
-- Create categories table
CREATE TABLE public.categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

-- Anyone can view categories
CREATE POLICY "Anyone can view categories" ON public.categories FOR SELECT USING (true);

-- Only admins can manage categories
CREATE POLICY "Admins can insert categories" ON public.categories FOR INSERT WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can update categories" ON public.categories FOR UPDATE USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can delete categories" ON public.categories FOR DELETE USING (has_role(auth.uid(), 'admin'::app_role));

-- Seed existing categories
INSERT INTO public.categories (name, slug) VALUES
  ('Bags', 'bags'),
  ('Accessories', 'accessories'),
  ('Custom', 'custom');

-- Change products.category from enum to text
ALTER TABLE public.products ALTER COLUMN category DROP DEFAULT;
ALTER TABLE public.products ALTER COLUMN category TYPE TEXT USING category::TEXT;
ALTER TABLE public.products ALTER COLUMN category SET DEFAULT 'accessories';
