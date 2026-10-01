import { useState, useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import { Header } from './Header'
import { Footer } from './Footer'
import { siteSettingsService } from '@/services/siteSettingsService'
import { MaintenancePage } from '@/components/public/MaintenancePage'

export function RootLayout() {
  const location = useLocation()
  const [isLoading, setIsLoading] = useState(true)
  const [isMaintenanceMode, setIsMaintenanceMode] = useState(false)

  useEffect(() => {
    let isMounted = true

    async function checkMaintenanceStatus(force = false) {
      const { data, error } = await siteSettingsService.getMaintenanceStatus(force)

      if (!isMounted) return

      if (data) {
        setIsMaintenanceMode(data.enabled)
      } else if (error) {
        console.warn('Maintenance status unverified due to read error:', error.message)
        setIsMaintenanceMode(true)
      }

      setIsLoading(false)
    }

    checkMaintenanceStatus()

    // Revalidate state when user returns to tab
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        checkMaintenanceStatus(true)
      }
    }

    window.addEventListener('visibilitychange', handleVisibilityChange)
    return () => {
      isMounted = false
      window.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [location.pathname])

  // Initial Verification Loader (Zero Content Exposure until state is known)
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0B1220] flex items-center justify-center text-white p-6">
        <div className="text-center space-y-3">
          <Loader2 className="w-8 h-8 animate-spin text-[#2F80ED] mx-auto" />
          <p className="text-xs font-mono text-slate-400 uppercase tracking-widest">
            Connecting to APSON Platform...
          </p>
        </div>
      </div>
    )
  }

  // Maintenance Mode ON View
  if (isMaintenanceMode) {
    return <MaintenancePage />
  }

  // Maintenance Mode OFF (Standard Website Layout)
  return (
    <div className="min-h-screen flex flex-col bg-[#F7F8FA] text-[#111827]">
      <Header />
      <div className="flex-1 flex flex-col">
        <Outlet />
      </div>
      <Footer />
    </div>
  )
}
