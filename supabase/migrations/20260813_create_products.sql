-- ============================================================================
-- APSON INDUSTRIES — PRODUCTS PAGE COMPLETE MASTER MIGRATION & SEED SCRIPT
-- Run this complete script in Supabase SQL Editor
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. CREATE PRODUCTS TABLE & INDEXES
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  category TEXT NOT NULL,
  short_description TEXT NOT NULL,
  image_src TEXT NOT NULL,
  image_alt TEXT,
  highlights TEXT[] DEFAULT '{}'::text[],
  is_published BOOLEAN DEFAULT true NOT NULL,
  is_featured BOOLEAN DEFAULT true NOT NULL,
  display_order INT DEFAULT 1 NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_products_slug ON public.products(slug);
CREATE INDEX IF NOT EXISTS idx_products_published_order ON public.products(is_published, display_order);
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category);

-- Enable RLS on Products
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public Read Published Products" ON public.products;
DROP POLICY IF EXISTS "Admin Full Access Products" ON public.products;

-- Public Read Policy: Anyone can read published products
CREATE POLICY "Public Read Published Products"
ON public.products FOR SELECT
USING (is_published = true);

-- Admin Policy: Strictly restricted to users with app_metadata.role = 'admin'
CREATE POLICY "Admin Full Access Products"
ON public.products FOR ALL
TO authenticated
USING (
  (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
)
WITH CHECK (
  (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
);

-- ----------------------------------------------------------------------------
-- 2. SEED INITIAL PRODUCTS DATA INTO PUBLIC.PRODUCTS
-- ----------------------------------------------------------------------------
INSERT INTO public.products (
  id, name, slug, category, short_description, image_src, image_alt, highlights, is_published, is_featured, display_order
)
VALUES
  (
    'a1b2c3d4-1001-4000-8000-000000000001',
    'Electrodynamic Vibration Testing System',
    'electrodynamic-vibration-testing-system',
    'Vibration Testing Systems',
    'Advanced shaker systems engineered for sine, random, shock, and resonance search testing up to +4000 Kgf.',
    '/images/slider-1.jpg',
    'Electrodynamic Vibration Testing System',
    ARRAY['Sine, Random & Shock Testing', 'Up to +4000 Kgf Thrust Rating', 'Digital Vibration Control Interface'],
    true,
    true,
    1
  ),
  (
    'a1b2c3d4-1002-4000-8000-000000000002',
    'Combined Horizontal Slip Table with Electrodynamic Vibration Shaker',
    'combined-horizontal-slip-table',
    'Vibration Testing Systems',
    'Combo base horizontal slip table integrated with an electrodynamic vibration shaker system, used for industrial and laboratory durability testing.',
    '/images/slider-2.jpg',
    'Combined Horizontal Slip Table with Electrodynamic Vibration Shaker',
    ARRAY['Integrated Combo Base Architecture', 'Horizontal & Vertical Testing Capability', 'High Precision Hydrodynamic Bearings'],
    true,
    true,
    2
  ),
  (
    'a1b2c3d4-1003-4000-8000-000000000003',
    'Vibration Test Head Expander',
    'vibration-test-head-expander',
    'Vibration Testing Systems',
    'Head expanders designed to extend the mounting area of electrodynamic shakers for large specimen testing.',
    '/images/slider-3.jpg',
    'Vibration Test Head Expander',
    ARRAY['Extended Specimen Mounting Area', 'Lightweight Alloy Fabrication', 'Low Resonance Frequency'],
    true,
    true,
    3
  ),
  (
    'a1b2c3d4-1004-4000-8000-000000000004',
    'Shock & Bump Test Machine',
    'shock-bump-test-machine',
    'Mechanical Testing Equipment',
    'Shock and bump test machine used for mechanical testing and evaluating product durability under impact or acceleration loads.',
    '/images/slider-3.jpg',
    'Shock & Bump Test Machine',
    ARRAY['Repetitive Bump & Half-Sine Impact Testing', 'Heavy-Duty Mechanical Frame', 'Programmable Drop Acceleration'],
    true,
    true,
    4
  ),
  (
    'a1b2c3d4-1005-4000-8000-000000000005',
    'Dust Test Chamber',
    'dust-test-chamber',
    'Environmental Testing Equipment',
    'Dust ingress protection test chamber designed for evaluating component sealing and reliability under dusty environmental conditions.',
    '/images/slider-2.jpg',
    'Dust Test Chamber',
    ARRAY['Ingress Protection Evaluation', 'Controlled Dust Agitation System', 'Transparent Inspection Window'],
    true,
    true,
    5
  ),
  (
    'a1b2c3d4-1006-4000-8000-000000000006',
    'Industrial Centrifugal Fan',
    'industrial-centrifugal-fan',
    'Industrial Equipment',
    'This industrial centrifugal fan features a heavy-duty scroll housing, an integrated electric motor with direct drive mounting, and an extended rectangular inlet/outlet duct assembly. It is commonly utilized in manufacturing facilities for material conveying, ventilation, combustion supply, or dust collection.',
    '/images/slider-1.jpg',
    'Industrial Centrifugal Fan',
    ARRAY['Heavy-Duty Scroll Housing', 'Direct Drive Motor Mounting', 'Ventilation & Material Conveying'],
    true,
    true,
    6
  )
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  short_description = EXCLUDED.short_description,
  image_src = EXCLUDED.image_src,
  image_alt = EXCLUDED.image_alt,
  highlights = EXCLUDED.highlights,
  is_published = EXCLUDED.is_published,
  is_featured = EXCLUDED.is_featured,
  display_order = EXCLUDED.display_order;

-- ----------------------------------------------------------------------------
-- 3. ENSURE PRODUCTS PAGE & PAGE_SECTION CONTENT ARE SEEDED IN PUBLIC.PAGES
-- ----------------------------------------------------------------------------

-- Ensure Products Page Record Exists
INSERT INTO public.pages (id, title, slug, status, seo_title, seo_description)
VALUES (
  'a1b2c3d4-0003-4000-8000-000000000003',
  'Products',
  '/products',
  'published',
  'Industrial Equipment & Products — APSON Industries',
  'Browse APSON Industries full range of testing and engineering equipment.'
)
ON CONFLICT (slug) DO NOTHING;

-- Seed Products Page Header & CTA Content into page_sections
INSERT INTO public.page_sections (id, page_id, section_type, content, display_order, is_visible)
VALUES (
  'b1b2c3d4-0003-4000-8000-000000000003',
  'a1b2c3d4-0003-4000-8000-000000000003',
  'products_page_content',
  '{
    "hero": {
      "eyebrow": "OUR PRODUCTS",
      "heading": "Engineered Solutions for Testing & Industrial Applications",
      "description": "Explore APSON Industries’ comprehensive range of electrodynamic vibration shaker systems, environmental test chambers, shock testing machines, and specialized industrial equipment.",
      "breadcrumbText": "Home / Products",
      "imageSrc": "/images/slider-1.jpg",
      "imageAlt": "APSON INDUSTRIES Product Catalogue"
    },
    "categories": [
      "Vibration Testing Systems",
      "Mechanical Testing Equipment",
      "Environmental Testing Equipment",
      "Industrial Equipment"
    ],
    "cta": {
      "eyebrow": "LOOKING FOR RELIABLE INDUSTRIAL SOLUTIONS?",
      "heading": "Discuss Your Testing Equipment Requirement",
      "description": "Get in touch with APSON Industries to discuss vibration shaker systems, environmental chambers, or custom engineering assemblies.",
      "primaryCtaText": "Explore Products",
      "primaryCtaHref": "/products",
      "secondaryCtaText": "Contact Us",
      "secondaryCtaHref": "/contact"
    }
  }'::jsonb,
  1,
  true
)
ON CONFLICT (id) DO UPDATE SET
  content = EXCLUDED.content;
