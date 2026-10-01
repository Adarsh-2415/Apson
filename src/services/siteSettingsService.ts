import { supabase, isSupabaseConfigured } from '@/lib/supabase'

export interface MaintenanceStatus {
  enabled: boolean
  message?: string
}

const MOCK_MAINTENANCE_KEY = 'apson_mock_maintenance_mode'
const CACHE_TTL_MS = 5000 // 5 seconds in-memory cache TTL

let inMemoryCache: MaintenanceStatus | null = null
let lastCacheTime = 0

function getLocalMaintenanceStatus(): MaintenanceStatus {
  const stored = localStorage.getItem(MOCK_MAINTENANCE_KEY)
  if (stored) {
    try {
      const parsed = JSON.parse(stored)
      return {
        enabled: Boolean(parsed.enabled),
        message: parsed.message || 'System Maintenance in Progress',
      }
    } catch {
      // Fallback
    }
  }
  return { enabled: false, message: 'System Maintenance in Progress' }
}

function setLocalMaintenanceStatus(status: MaintenanceStatus) {
  localStorage.setItem(MOCK_MAINTENANCE_KEY, JSON.stringify(status))
}

export const siteSettingsService = {
  /**
   * Fetch current Maintenance Status from Supabase (or isolated dev storage fallback).
   * Implements a short-lived 5s in-memory cache to prevent repetitive network overhead.
   */
  async getMaintenanceStatus(
    forceRefresh = false
  ): Promise<{ data: MaintenanceStatus | null; error: Error | null; isCached?: boolean }> {
    const now = Date.now()

    // Return in-memory cache if valid and forceRefresh is false
    if (!forceRefresh && inMemoryCache && now - lastCacheTime < CACHE_TTL_MS) {
      return { data: inMemoryCache, error: null, isCached: true }
    }

    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('site_settings')
          .select('value')
          .eq('key', 'maintenance_mode')
          .single()

        if (error) {
          console.warn('Supabase site_settings read warning:', error.message)
          // Return cached state if available during temporary DB read failure
          return { data: inMemoryCache, error: new Error(error.message) }
        }

        if (data?.value) {
          const val = data.value as MaintenanceStatus
          const parsedStatus: MaintenanceStatus = {
            enabled: Boolean(val.enabled),
            message: val.message || 'System Maintenance in Progress',
          }
          inMemoryCache = parsedStatus
          lastCacheTime = now
          return { data: parsedStatus, error: null }
        }
      } catch (err: any) {
        console.warn('Supabase getMaintenanceStatus Exception:', err)
        return { data: inMemoryCache, error: err instanceof Error ? err : new Error('Network error') }
      }
    }

    // Explicit Development Mode Fallback (Only when Supabase is unconfigured)
    const local = getLocalMaintenanceStatus()
    inMemoryCache = local
    lastCacheTime = now
    return { data: local, error: null }
  },

  /**
   * Update Maintenance Mode (Admin Authorized Action).
   * Authoritative write to Supabase site_settings table.
   */
  async setMaintenanceMode(
    enabled: boolean,
    message = 'System Maintenance in Progress'
  ): Promise<{ error: Error | null }> {
    const payload: MaintenanceStatus = { enabled, message }

    if (isSupabaseConfigured) {
      try {
        const { error } = await supabase.from('site_settings').upsert({
          key: 'maintenance_mode',
          value: payload,
          updated_at: new Date().toISOString(),
        })

        if (error) {
          console.error('Supabase setMaintenanceMode Write Error:', error.message)
          return { error: new Error(error.message || 'Failed to update maintenance setting in database.') }
        }

        // On verified DB write success, update in-memory cache
        inMemoryCache = payload
        lastCacheTime = Date.now()
        return { error: null }
      } catch (err: any) {
        console.error('Supabase setMaintenanceMode Exception:', err)
        return { error: err instanceof Error ? err : new Error('Failed to update maintenance mode.') }
      }
    }

    // Isolated Dev Mode Update
    setLocalMaintenanceStatus(payload)
    inMemoryCache = payload
    lastCacheTime = Date.now()
    return { error: null }
  },

  /**
   * Clear in-memory cache for immediate revalidation.
   */
  invalidateCache() {
    inMemoryCache = null
    lastCacheTime = 0
  },
}
