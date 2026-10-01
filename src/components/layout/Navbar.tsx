import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X, Home, Info, Boxes, Mail } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import { NAV_LINKS } from '@/config/company'

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const location = useLocation()

  const closeMenu = () => setIsOpen(false)

  // Map route to subtle icon helper
  const getNavIcon = (name: string) => {
    switch (name) {
      case 'Home':
        return <Home className="w-4 h-4 shrink-0" />
      case 'About Us':
        return <Info className="w-4 h-4 shrink-0" />
      case 'Products':
        return <Boxes className="w-4 h-4 shrink-0" />
      case 'Contact Us':
        return <Mail className="w-4 h-4 shrink-0" />
      default:
        return null
    }
  }

  return (
    <nav className="bg-[#1A2433]/95 backdrop-blur-md text-white border-y border-[#2A3649] sticky top-0 z-50 shadow-md">
      {/* Top subtle blue accent hairline */}
      <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-[#2F80ED] to-transparent opacity-80" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {NAV_LINKS.map((link) => {
              const isActive =
                location.pathname === link.href ||
                (link.href !== '/' && location.pathname.startsWith(link.href))

              return (
                <Link
                  key={link.href}
                  to={link.href}
                  className={`relative inline-flex items-center gap-2 px-4 py-2 text-sm font-medium transition-all rounded-md focus:outline-none focus:ring-2 focus:ring-[#2F80ED] ${
                    isActive
                      ? 'text-white bg-[#0B1220] shadow-inner'
                      : 'text-slate-300 hover:text-white hover:bg-[#0B1220]/60'
                  }`}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <span className={isActive ? 'text-[#2F80ED]' : 'text-slate-400'}>
                    {getNavIcon(link.name)}
                  </span>
                  <span>{link.name}</span>
                  {isActive && (
                    <motion.div
                      layoutId="activeIndicator"
                      className="absolute bottom-0 left-2 right-2 h-[2.5px] bg-[#2F80ED] rounded-full shadow-[0_0_8px_#2F80ED]"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </Link>
              )
            })}
          </div>

          {/* Mobile Navigation Status & Toggle */}
          <div className="flex md:hidden items-center justify-between w-full">
            <span className="text-xs font-bold tracking-widest text-slate-400 uppercase flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#2F80ED] animate-pulse" />
              Menu Navigation
            </span>
            <button
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-slate-300 hover:text-white hover:bg-[#0B1220] focus:outline-none focus:ring-2 focus:ring-[#2F80ED]"
              aria-controls="mobile-menu"
              aria-expanded={isOpen}
              aria-label="Toggle Navigation Menu"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="mobile-menu"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden bg-[#0B1220]/95 backdrop-blur-lg border-b border-[#2A3649] overflow-hidden"
          >
            <div className="px-4 pt-2 pb-4 space-y-1.5">
              {NAV_LINKS.map((link) => {
                const isActive =
                  location.pathname === link.href ||
                  (link.href !== '/' && location.pathname.startsWith(link.href))

                return (
                  <Link
                    key={link.href}
                    to={link.href}
                    onClick={closeMenu}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-base font-medium transition-colors ${
                      isActive
                        ? 'text-white bg-[#2F80ED]/20 border-l-4 border-[#2F80ED]'
                        : 'text-slate-300 hover:text-white hover:bg-[#1A2433]'
                    }`}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    <span className={isActive ? 'text-[#2F80ED]' : 'text-slate-400'}>
                      {getNavIcon(link.name)}
                    </span>
                    <span>{link.name}</span>
                  </Link>
                )
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}
