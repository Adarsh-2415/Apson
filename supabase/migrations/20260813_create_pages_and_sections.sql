-- ============================================================================
-- APSON INDUSTRIES — PAGE BUILDER CMS DATABASE MIGRATION (SECURED)
-- ============================================================================

-- 1. Create Pages Table
CREATE TABLE IF NOT EXISTS public.pages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  seo_title TEXT,
  seo_description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  published_at TIMESTAMP WITH TIME ZONE,
  created_by UUID REFERENCES auth.users(id),
  updated_by UUID REFERENCES auth.users(id)
);

-- 2. Create Page Sections Table
CREATE TABLE IF NOT EXISTS public.page_sections (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  page_id UUID NOT NULL REFERENCES public.pages(id) ON DELETE CASCADE,
  section_type TEXT NOT NULL,
  content JSONB NOT NULL DEFAULT '{}'::jsonb,
  display_order INT NOT NULL DEFAULT 1,
  is_visible BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Indexing for high-performance public queries
CREATE INDEX IF NOT EXISTS idx_pages_slug ON public.pages(slug);
CREATE INDEX IF NOT EXISTS idx_page_sections_page_order ON public.page_sections(page_id, display_order);

-- 3. Row Level Security Policies
ALTER TABLE public.pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.page_sections ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if re-running
DROP POLICY IF EXISTS "Public Read Published Pages" ON public.pages;
DROP POLICY IF EXISTS "Public Read Visible Page Sections" ON public.page_sections;
DROP POLICY IF EXISTS "Admin Full Access Pages" ON public.pages;
DROP POLICY IF EXISTS "Admin Full Access Page Sections" ON public.page_sections;

-- Public Read Policy: Anyone can read published pages
CREATE POLICY "Public Read Published Pages"
ON public.pages FOR SELECT
USING (status = 'published');

-- Public Read Policy: Anyone can read visible sections of published pages
CREATE POLICY "Public Read Visible Page Sections"
ON public.page_sections FOR SELECT
USING (
  is_visible = true AND 
  EXISTS (
    SELECT 1 FROM public.pages 
    WHERE pages.id = page_sections.page_id 
    AND pages.status = 'published'
  )
);

-- Admin Full Access: STRICTLY RESTRICTED TO USERS WITH app_metadata.role = 'admin'
-- ZERO generic authenticated fallback
CREATE POLICY "Admin Full Access Pages"
ON public.pages FOR ALL
TO authenticated
USING (
  (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
)
WITH CHECK (
  (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
);

CREATE POLICY "Admin Full Access Page Sections"
ON public.page_sections FOR ALL
TO authenticated
USING (
  (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
)
WITH CHECK (
  (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
);

-- 4. Atomic Reorder RPC Stored Procedure with Strict Payload & Admin Role Validation
CREATE OR REPLACE FUNCTION public.reorder_page_sections(
  p_page_id UUID,
  p_section_orders JSONB
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_payload_count INT;
  v_db_count INT;
  v_mismatch_count INT;
  v_invalid_order_count INT;
  v_duplicate_order_count INT;
BEGIN
  -- 1. STRICT ADMIN AUTHORIZATION CHECK
  IF (auth.jwt() -> 'app_metadata' ->> 'role') != 'admin' THEN
    RAISE EXCEPTION 'Access denied: Admin authorization required (app_metadata.role = admin).';
  END IF;

  -- 2. VALIDATE PAYLOAD IS A JSON ARRAY
  IF jsonb_typeof(p_section_orders) != 'array' THEN
    RAISE EXCEPTION 'Invalid payload format: p_section_orders must be a JSON array.';
  END IF;

  v_payload_count := jsonb_array_length(p_section_orders);

  -- 3. VALIDATE DATABASE SECTION COUNT MATCHES PAYLOAD COUNT
  SELECT COUNT(*) INTO v_db_count
  FROM public.page_sections
  WHERE page_id = p_page_id;

  IF v_payload_count != v_db_count THEN
    RAISE EXCEPTION 'Reorder validation error: Payload section count (%) does not match existing page sections count (%).', v_payload_count, v_db_count;
  END IF;

  -- 4. VALIDATE ALL SECTION IDs BELONG TO THE REQUESTED PAGE
  SELECT COUNT(*) INTO v_mismatch_count
  FROM jsonb_array_elements(p_section_orders) AS item
  LEFT JOIN public.page_sections ps ON ps.id = (item->>'id')::UUID AND ps.page_id = p_page_id
  WHERE ps.id IS NULL;

  IF v_mismatch_count > 0 THEN
    RAISE EXCEPTION 'Reorder validation error: One or more section IDs do not belong to page %.', p_page_id;
  END IF;

  -- 5. VALIDATE ALL DISPLAY ORDERS ARE GREATER THAN 0
  SELECT COUNT(*) INTO v_invalid_order_count
  FROM jsonb_array_elements(p_section_orders) AS item
  WHERE (item->>'display_order')::INT <= 0;

  IF v_invalid_order_count > 0 THEN
    RAISE EXCEPTION 'Reorder validation error: display_order values must be integers greater than 0.';
  END IF;

  -- 6. VALIDATE NO DUPLICATE DISPLAY ORDERS IN PAYLOAD
  SELECT COUNT(*) INTO v_duplicate_order_count
  FROM (
    SELECT (item->>'display_order')::INT AS order_val
    FROM jsonb_array_elements(p_section_orders) AS item
    GROUP BY order_val
    HAVING COUNT(*) > 1
  ) duplicates;

  IF v_duplicate_order_count > 0 THEN
    RAISE EXCEPTION 'Reorder validation error: Duplicate display_order values detected in payload.';
  END IF;

  -- 7. ATOMIC BULK UPDATE INSIDE TRANSACTION
  UPDATE public.page_sections AS ps
  SET 
    display_order = (item->>'display_order')::INT,
    updated_at = timezone('utc'::text, now())
  FROM jsonb_array_elements(p_section_orders) AS item
  WHERE ps.id = (item->>'id')::UUID
    AND ps.page_id = p_page_id;
END;
$$;
