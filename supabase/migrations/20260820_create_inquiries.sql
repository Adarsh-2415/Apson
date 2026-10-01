-- ============================================================================
-- APSON INDUSTRIES — CONTACT INQUIRIES DATABASE MIGRATION
-- ============================================================================

-- 1. Create Inquiries Table
CREATE TABLE IF NOT EXISTS public.inquiries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  address TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'read', 'archived')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Indexing for fast search & filtering
CREATE INDEX IF NOT EXISTS idx_inquiries_status ON public.inquiries(status);
CREATE INDEX IF NOT EXISTS idx_inquiries_created_at ON public.inquiries(created_at DESC);

-- 2. Row Level Security Policies
ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public Insert Inquiries" ON public.inquiries;
DROP POLICY IF EXISTS "Admin Full Access Inquiries" ON public.inquiries;

-- Public Insert Policy: Anyone can submit a contact inquiry form
CREATE POLICY "Public Insert Inquiries"
ON public.inquiries FOR INSERT
WITH CHECK (true);

-- Admin Full Access: Restricted strictly to authenticated users with app_metadata.role = 'admin'
CREATE POLICY "Admin Full Access Inquiries"
ON public.inquiries FOR ALL
TO authenticated
USING (
  (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
)
WITH CHECK (
  (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
);
