-- ============================================================================
-- APSON INDUSTRIES — SITE SETTINGS DATABASE MIGRATION (EXPLICIT GRANULAR RLS)
-- ============================================================================

-- 1. Create Site Settings Table & Index
CREATE TABLE IF NOT EXISTS public.site_settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL DEFAULT '{}'::jsonb,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_by UUID REFERENCES auth.users(id)
);

CREATE INDEX IF NOT EXISTS idx_site_settings_key ON public.site_settings(key);

-- 2. Enable Row Level Security
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- 3. Drop existing policies before creating explicit replacement policies
DROP POLICY IF EXISTS "Public Read Maintenance Setting Only" ON public.site_settings;
DROP POLICY IF EXISTS "Admin Full Access Site Settings" ON public.site_settings;
DROP POLICY IF EXISTS "Admin Read Write Site Settings" ON public.site_settings;
DROP POLICY IF EXISTS "Admin Select Insert Update Site Settings" ON public.site_settings;
DROP POLICY IF EXISTS "Admin Select Site Settings" ON public.site_settings;
DROP POLICY IF EXISTS "Admin Insert Site Settings" ON public.site_settings;
DROP POLICY IF EXISTS "Admin Update Site Settings" ON public.site_settings;

-- ----------------------------------------------------------------------------
-- 4. PUBLIC READ POLICY (LEAST PRIVILEGE)
-- Public visitors (anon & authenticated) can ONLY read key = 'maintenance_mode'.
-- Exposing any other setting key or scanning the table is blocked at DB level.
-- ----------------------------------------------------------------------------
CREATE POLICY "Public Read Maintenance Setting Only"
ON public.site_settings FOR SELECT
TO public
USING (key = 'maintenance_mode');

-- ----------------------------------------------------------------------------
-- 5. ADMIN SELECT POLICY
-- Authenticated admins can read any row in site_settings.
-- ----------------------------------------------------------------------------
CREATE POLICY "Admin Select Site Settings"
ON public.site_settings FOR SELECT
TO authenticated
USING (
  (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
);

-- ----------------------------------------------------------------------------
-- 6. ADMIN INSERT POLICY
-- Authenticated admins can insert new site settings rows.
-- Required for upsert when a setting key does not exist yet.
-- ----------------------------------------------------------------------------
CREATE POLICY "Admin Insert Site Settings"
ON public.site_settings FOR INSERT
TO authenticated
WITH CHECK (
  (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
);

-- ----------------------------------------------------------------------------
-- 7. ADMIN UPDATE POLICY
-- Authenticated admins can update existing site settings rows.
-- Required for upsert when modifying an existing setting key.
-- Uses both USING and WITH CHECK to validate pre-update and post-update state.
-- ----------------------------------------------------------------------------
CREATE POLICY "Admin Update Site Settings"
ON public.site_settings FOR UPDATE
TO authenticated
USING (
  (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
)
WITH CHECK (
  (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
);

-- NOTE: NO DELETE POLICY IS CREATED. DELETE IS EXCLUDED AT DATABASE LEVEL.

-- ----------------------------------------------------------------------------
-- 8. SEED DEFAULT MAINTENANCE SETTING (SAFE RERUN PROTECTION)
-- ON CONFLICT (key) DO NOTHING guarantees that existing saved admin settings
-- are preserved across migration reruns.
-- ----------------------------------------------------------------------------
INSERT INTO public.site_settings (key, value)
VALUES ('maintenance_mode', '{"enabled": false, "message": "System Maintenance in Progress"}'::jsonb)
ON CONFLICT (key) DO NOTHING;
