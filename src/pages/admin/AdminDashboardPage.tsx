import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import {
  Boxes,
  FileText,
  Mail,
  RefreshCw,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Inbox,
  Activity,
  Star,
  Wrench,
  Loader2,
  Check,
  AlertCircle,
  type LucideIcon,
} from 'lucide-react'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import { siteSettingsService } from '@/services/siteSettingsService'

interface DashboardStats {
  totalProducts: number
  publishedProducts: number
  featuredProducts: number
  totalPages: number
  publishedPages: number
  totalEnquiries: number
  newEnquiries: number
}

interface StatCardConfig {
  id: string
  label: string
  value: number | string
  subText: string
  icon: LucideIcon
  color: string
}

export function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    totalProducts: 0,
    publishedProducts: 0,
    featuredProducts: 0,
    totalPages: 5,
    publishedPages: 4,
    totalEnquiries: 0,
    newEnquiries: 0,
  })

  const [isLoading, setIsLoading] = useState(true)
  const [isError, setIsError] = useState(false)
  const [lastRefreshed, setLastRefreshed] = useState<string>('')

  // Maintenance Control State
  const [isMaintenanceEnabled, setIsMaintenanceEnabled] = useState(false)
  const [maintenanceMessage, setMaintenanceMessage] = useState('System Maintenance in Progress')
  const [isFetchingMaintenance, setIsFetchingMaintenance] = useState(true)
  const [isUpdatingMaintenance, setIsUpdatingMaintenance] = useState(false)
  const [maintenanceFetchError, setMaintenanceFetchError] = useState<string | null>(null)
  const [maintenanceActionFeedback, setMaintenanceActionFeedback] = useState<{
    type: 'success' | 'error'
    text: string
  } | null>(null)

  // Fetch Maintenance Mode Status from Supabase
  const loadMaintenanceStatus = useCallback(async (force = true) => {
    setIsFetchingMaintenance(true)
    setMaintenanceFetchError(null)

    const { data, error } = await siteSettingsService.getMaintenanceStatus(force)

    if (error) {
      setMaintenanceFetchError('Unable to fetch maintenance status from database.')
    } else if (data) {
      setIsMaintenanceEnabled(data.enabled)
      setMaintenanceMessage(data.message || 'System Maintenance in Progress')
    }

    setIsFetchingMaintenance(false)
  }, [])

  // Toggle Maintenance Mode Handler with Strict Write Confirmation
  const handleToggleMaintenance = async () => {
    const targetState = !isMaintenanceEnabled
    setIsUpdatingMaintenance(true)
    setMaintenanceActionFeedback(null)

    const { error } = await siteSettingsService.setMaintenanceMode(targetState, maintenanceMessage)

    if (error) {
      // Preserve confirmed database state on failure; do NOT optimistically spoof UI state
      setMaintenanceActionFeedback({
        type: 'error',
        text: `Failed to update database: ${error.message}. Maintenance setting remains unchanged.`,
      })
    } else {
      // Confirmed write success
      setIsMaintenanceEnabled(targetState)
      setMaintenanceActionFeedback({
        type: 'success',
        text: targetState
          ? 'Maintenance Mode ENABLED — Public website visitors now see the Maintenance Page.'
          : 'Website Restored ONLINE — Public website routes are fully accessible.',
      })
    }

    setIsUpdatingMaintenance(false)
  }

  // Load Dashboard Stats
  const loadDashboardStats = useCallback(async () => {
    setIsLoading(true)
    setIsError(false)

    try {
      if (isSupabaseConfigured) {
        const [prodRes, enqRes] = await Promise.all([
          supabase.from('products').select('*', { count: 'exact', head: false }),
          supabase.from('enquiries').select('*', { count: 'exact', head: false }),
        ])

        const products = prodRes.data || []
        const enquiries = enqRes.data || []

        setStats({
          totalProducts: products.length,
          publishedProducts: products.filter((p: { is_published?: boolean }) => p.is_published).length,
          featuredProducts: products.filter((p: { is_featured?: boolean }) => p.is_featured).length,
          totalPages: 5,
          publishedPages: 4,
          totalEnquiries: enquiries.length,
          newEnquiries: enquiries.filter((e: { status?: string }) => e.status === 'new').length,
        })
      } else {
        setStats({
          totalProducts: 6,
          publishedProducts: 6,
          featuredProducts: 6,
          totalPages: 5,
          publishedPages: 4,
          totalEnquiries: 0,
          newEnquiries: 0,
        })
      }

      setLastRefreshed(new Date().toLocaleTimeString())
    } catch {
      setIsError(true)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    loadDashboardStats()
    loadMaintenanceStatus(true)
  }, [loadDashboardStats, loadMaintenanceStatus])

  const statCards: StatCardConfig[] = [
    {
      id: 'total-products',
      label: 'Total Products',
      value: stats.totalProducts,
      subText: 'Products in database',
      icon: Boxes,
      color: 'text-[#2F80ED] bg-[#2F80ED]/15',
    },
    {
      id: 'published-products',
      label: 'Published Products',
      value: stats.publishedProducts,
      subText: 'Publicly visible items',
      icon: CheckCircle2,
      color: 'text-emerald-400 bg-emerald-500/15',
    },
    {
      id: 'featured-products',
      label: 'Featured Products',
      value: stats.featuredProducts,
      subText: 'Highlighted on Homepage',
      icon: Star,
      color: 'text-amber-400 bg-amber-500/15',
    },
    {
      id: 'total-pages',
      label: 'Total Pages',
      value: stats.totalPages,
      subText: 'Website route hierarchy',
      icon: FileText,
      color: 'text-[#2F80ED] bg-[#2F80ED]/15',
    },
    {
      id: 'published-pages',
      label: 'Published Pages',
      value: stats.publishedPages,
      subText: 'Active public routes',
      icon: ShieldCheck,
      color: 'text-[#2F80ED] bg-[#2F80ED]/15',
    },
    {
      id: 'total-enquiries',
      label: 'Total Enquiries',
      value: stats.totalEnquiries,
      subText: 'Submitted query forms',
      icon: Mail,
      color: 'text-purple-400 bg-purple-500/15',
    },
    {
      id: 'new-enquiries',
      label: 'New Enquiries',
      value: stats.newEnquiries,
      subText: 'Unprocessed submissions',
      icon: Inbox,
      color: 'text-[#2F80ED] bg-[#2F80ED]/15',
    },
  ]

  return (
    <div className="space-y-8">
      {/* Top Banner / Actions Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-[#1A2433] p-6 rounded-2xl border border-[#2A3649]">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-mono text-[#2F80ED] uppercase tracking-wider mb-1">
            <Activity className="w-3.5 h-3.5" />
            <span>SYSTEM HEALTH: ACTIVE</span>
          </div>
          <h2 className="font-['Manrope'] text-2xl font-extrabold text-white">
            APSON CMS Control Center
          </h2>
          <p className="text-slate-400 text-xs mt-0.5">
            {lastRefreshed ? `Last updated at ${lastRefreshed}` : 'Synchronizing statistics...'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              loadDashboardStats()
              loadMaintenanceStatus(true)
            }}
            disabled={isLoading || isFetchingMaintenance}
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#0B1220] hover:bg-[#2F80ED] text-slate-200 hover:text-white text-xs font-bold rounded-xl border border-[#2A3649] transition-all disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading || isFetchingMaintenance ? 'animate-spin' : ''}`} />
            <span>Refresh Data</span>
          </button>

          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#2F80ED] hover:bg-[#1d6ed8] text-white text-xs font-bold rounded-xl shadow-md transition-all"
          >
            <span>View Website</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Website Maintenance Mode Control Card */}
      <div className="bg-[#1A2433] rounded-2xl border border-[#2A3649] p-6 shadow-md space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div
              className={`p-3 rounded-xl ${
                isMaintenanceEnabled ? 'bg-amber-500/15 text-amber-400' : 'bg-emerald-500/15 text-emerald-400'
              }`}
            >
              <Wrench className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-['Manrope'] text-base font-extrabold text-white">
                  Website Maintenance Mode
                </h3>
                {isFetchingMaintenance ? (
                  <span className="text-[10px] bg-[#0B1220] text-slate-400 px-2 py-0.5 rounded font-mono">
                    Syncing...
                  </span>
                ) : isMaintenanceEnabled ? (
                  <span className="text-[10px] bg-amber-500/20 text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                    Maintenance Active (OFFLINE)
                  </span>
                ) : (
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                    Website Live (ONLINE)
                  </span>
                )}
              </div>
              <p className="text-slate-400 text-xs mt-0.5">
                Toggle Maintenance Mode ON to display the Maintenance Page to public visitors while keeping Admin panel accessible.
              </p>
            </div>
          </div>

          {/* Action Switch Button */}
          {maintenanceFetchError ? (
            <button
              onClick={() => loadMaintenanceStatus(true)}
              className="px-4 py-2 bg-amber-950/80 hover:bg-amber-900 border border-amber-600/50 text-amber-200 text-xs font-bold rounded-xl flex items-center gap-2"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Retry Sync</span>
            </button>
          ) : (
            <button
              onClick={handleToggleMaintenance}
              disabled={isFetchingMaintenance || isUpdatingMaintenance}
              className={`px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider shadow-md flex items-center gap-2 transition-all disabled:opacity-50 ${
                isMaintenanceEnabled
                  ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                  : 'bg-amber-600 hover:bg-amber-500 text-white'
              }`}
            >
              {isUpdatingMaintenance ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Updating DB...</span>
                </>
              ) : isMaintenanceEnabled ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Turn Maintenance OFF (Go Live)</span>
                </>
              ) : (
                <>
                  <Wrench className="w-4 h-4" />
                  <span>Turn Maintenance ON</span>
                </>
              )}
            </button>
          )}
        </div>

        {/* Feedback Messages */}
        {maintenanceActionFeedback && (
          <div
            className={`p-3.5 rounded-xl text-xs flex items-center gap-2 border ${
              maintenanceActionFeedback.type === 'success'
                ? 'bg-emerald-950/80 border-emerald-600/50 text-emerald-200'
                : 'bg-rose-950/80 border-rose-600/50 text-rose-200'
            }`}
          >
            {maintenanceActionFeedback.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            )}
            <span>{maintenanceActionFeedback.text}</span>
          </div>
        )}

        {maintenanceFetchError && (
          <div className="p-3 bg-amber-950/80 border border-amber-600/50 rounded-xl text-xs text-amber-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
              <span>{maintenanceFetchError} Toggle control disabled until re-synchronized.</span>
            </div>
            <button
              onClick={() => loadMaintenanceStatus(true)}
              className="text-[#2F80ED] underline font-bold"
            >
              Retry Connection
            </button>
          </div>
        )}
      </div>

      {/* Error Recovery Alert Banner */}
      {isError && (
        <div className="p-4 bg-rose-950/80 border border-rose-600/50 rounded-xl flex items-center justify-between gap-4 text-xs text-rose-200">
          <div className="flex items-center gap-2.5">
            <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>Unable to fetch real-time data from Supabase.</span>
          </div>
          <button
            onClick={loadDashboardStats}
            className="px-3 py-1 bg-rose-900 hover:bg-rose-800 text-white rounded-md font-bold"
          >
            Retry
          </button>
        </div>
      )}

      {/* Statistics Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {statCards.map((card) => {
          const IconComponent = card.icon

          return (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-[#1A2433] rounded-2xl border border-[#2A3649] p-5 flex flex-col justify-between space-y-4 hover:border-[#2F80ED]/40 transition-colors shadow-sm"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 font-['Manrope']">
                  {card.label}
                </span>
                <div className={`p-2.5 rounded-xl ${card.color}`}>
                  <IconComponent className="w-5 h-5" />
                </div>
              </div>

              <div className="space-y-1">
                {isLoading ? (
                  <div className="h-9 w-20 bg-slate-800 rounded animate-pulse my-1" />
                ) : (
                  <div className="font-['Manrope'] text-3xl font-extrabold text-white tracking-tight">
                    {card.value}
                  </div>
                )}
                <div className="text-[11px] text-slate-400 font-medium">
                  {card.subText}
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
