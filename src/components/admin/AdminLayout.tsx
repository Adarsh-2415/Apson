import { useState, useEffect } from 'react'
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import {
  LayoutDashboard,
  FileText,
  Inbox,
  LogOut,
  ExternalLink,
  Menu,
  X,
  ShieldCheck,
  User as UserIcon,
} from 'lucide-react'
import { inquiryService } from '@/services/inquiryService'

export function AdminLayout() {
  const { user, signOut } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    async function checkUnread() {
      const { data } = await inquiryService.getInquiries()
      if (data) {
        setUnreadCount(data.filter((i) => i.status === 'new').length)
      }
    }
    checkUnread()
  }, [location.pathname])

  const handleLogout = async () => {
    await signOut()
    navigate('/admin/login', { replace: true })
  }

  const navItems = [
    {
      label: 'Dashboard',
      href: '/admin/dashboard',
      icon: LayoutDashboard,
    },
    {
      label: 'Manage Pages',
      href: '/admin/pages',
      icon: FileText,
    },
    {
      label: 'Contact Inquiries',
      href: '/admin/inquiries',
      icon: Inbox,
      badge: unreadCount > 0 ? unreadCount : null,
    },
  ]

  const getHeaderTitle = () => {
    if (location.pathname === '/admin/pages') return 'Manage Pages'
    if (location.pathname === '/admin/inquiries') return 'Contact Inquiries Panel'
    if (location.pathname.startsWith('/admin/pages/products/edit')) return 'Products Page Editor'
    if (location.pathname.startsWith('/admin/pages/builder')) return 'Page Builder Studio'
    return 'Dashboard Overview'
  }

  const getHeaderSubtitle = () => {
    if (location.pathname === '/admin/pages') return 'Website page management and CMS structure.'
    if (location.pathname === '/admin/inquiries') return 'Monitor and respond to customer technical inquiries.'
    if (location.pathname.startsWith('/admin/pages/products/edit')) return 'Catalogue & page content management.'
    if (location.pathname.startsWith('/admin/pages/builder')) return 'Custom page section layout editor.'
    return 'Welcome back. Manage website content and monitor activity.'
  }

  return (
    <div className="min-h-screen bg-[#0B1220] text-slate-100 flex flex-col md:flex-row font-sans selection:bg-[#2F80ED] selection:text-white">
      {/* Mobile Top Header */}
      <header className="md:hidden bg-[#1A2433] border-b border-[#2A3649] px-4 py-3 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-[#2F80ED]/20 text-[#2F80ED]">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <span className="font-['Manrope'] font-bold text-white text-base">
            APSON CMS
          </span>
        </div>

        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 rounded-lg bg-[#0B1220] text-slate-300 hover:text-white border border-[#2A3649]"
          aria-label="Toggle Navigation Menu"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </header>

      {/* Sidebar Overlay (Mobile) */}
      {mobileMenuOpen && (
        <div
          onClick={() => setMobileMenuOpen(false)}
          className="md:hidden fixed inset-0 bg-[#0B1220]/80 backdrop-blur-sm z-40"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed md:static inset-y-0 left-0 z-50 w-64 bg-[#1A2433] border-r border-[#2A3649] flex flex-col justify-between transition-transform duration-300 ease-in-out ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Top Brand Banner */}
        <div className="p-6 border-b border-[#2A3649] space-y-1">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-[#2F80ED]/20 text-[#2F80ED]">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-['Manrope'] font-extrabold text-white text-lg tracking-wide leading-none">
                APSON CMS
              </h2>
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">
                ADMIN PANEL
              </span>
            </div>
          </div>
        </div>

        {/* Navigation Menu Links */}
        <div className="p-4 flex-1 space-y-1.5 overflow-y-auto">
          <div className="px-3 py-2 text-[10px] font-mono uppercase tracking-widest text-slate-500 font-bold">
            Navigation
          </div>
          {navItems.map((item) => {
            const isActive = location.pathname === item.href
            const Icon = item.icon

            return (
              <Link
                key={item.href}
                to={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-[#2F80ED] text-white shadow-md shadow-[#2F80ED]/20'
                    : 'text-slate-300 hover:bg-[#0B1220] hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </div>
                {item.badge ? (
                  <span className="px-2 py-0.5 rounded-full bg-rose-500 text-white font-mono text-[10px] font-bold">
                    {item.badge}
                  </span>
                ) : null}
              </Link>
            )
          })}
        </div>

        {/* Bottom Profile Badge & Logout Action */}
        <div className="p-4 border-t border-[#2A3649] space-y-3 bg-[#0B1220]/50">
          <div className="flex items-center gap-3 px-2">
            <div className="p-2 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
              <UserIcon className="w-4 h-4" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-white truncate">
                {user?.email || 'admin@apsonindustries.com'}
              </p>
              <span className="text-[10px] font-mono text-emerald-400 uppercase">
                Administrator
              </span>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full py-2.5 px-3 bg-[#0B1220] hover:bg-rose-950/60 hover:text-rose-400 text-slate-300 text-xs font-semibold rounded-lg border border-[#2A3649] transition-all flex items-center justify-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Viewport */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Desktop Header Bar */}
        <header className="hidden md:flex bg-[#1A2433] border-b border-[#2A3649] px-8 py-4 items-center justify-between">
          <div>
            <h1 className="font-['Manrope'] text-xl font-extrabold text-white">
              {getHeaderTitle()}
            </h1>
            <p className="text-slate-400 text-xs">
              {getHeaderSubtitle()}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#0B1220] hover:bg-[#2F80ED] text-white text-xs font-semibold rounded-lg border border-[#2A3649] transition-colors"
            >
              <span>View Public Website</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-2 px-4 py-2 bg-transparent hover:bg-rose-950/60 text-slate-300 hover:text-rose-400 text-xs font-semibold rounded-lg border border-[#2A3649] transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </div>
        </header>

        {/* Dynamic Admin Page Outlet */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
