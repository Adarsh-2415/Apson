import { Link } from 'react-router-dom'
import { COMPANY_INFO } from '@/config/company'

export function BrandHeader() {
  return (
    <div className="bg-white border-b border-slate-200 py-5 sm:py-7 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto flex items-center justify-center gap-4 sm:gap-8">
        {/* Left Architectural Hairline Rule */}
        <div className="hidden sm:flex flex-1 items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-[#2F80ED]" />
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#2F80ED]/40 to-slate-300" />
        </div>

        {/* Brand Logo & Typography Wrapper */}
        <Link
          to="/"
          className="group flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-5 px-2 focus:outline-none focus:ring-2 focus:ring-[#2F80ED] focus:ring-offset-4 rounded-xl transition-all"
        >
          {/* Company Emblem Logo (Clean background without white container box) */}
          <div className="relative shrink-0 group-hover:scale-105 transition-transform duration-300">
            <img
              src={COMPANY_INFO.logoSrc}
              alt={COMPANY_INFO.logoAlt}
              className="h-16 sm:h-20 lg:h-24 w-auto object-contain"
            />
          </div>

          {/* Brand Typography */}
          <div className="text-center sm:text-left space-y-0.5">
            <h1 className="font-['Manrope'] text-2xl sm:text-3xl lg:text-4xl font-black tracking-[0.16em] sm:tracking-[0.20em] uppercase select-none flex items-center justify-center sm:justify-start gap-x-2.5 flex-wrap">
              <span className="text-[#0B1220] group-hover:text-[#2F80ED] transition-colors">APSON</span>
              <span className="text-[#2F80ED]">INDUSTRIES</span>
            </h1>
            <p className="text-[10px] sm:text-xs font-mono font-bold tracking-[0.25em] sm:tracking-[0.3em] uppercase text-slate-500">
              ROORKEE • INDIA
            </p>
          </div>
        </Link>

        {/* Right Architectural Hairline Rule */}
        <div className="hidden sm:flex flex-1 items-center gap-2">
          <div className="h-px flex-1 bg-gradient-to-l from-transparent via-[#2F80ED]/40 to-slate-300" />
          <div className="w-1.5 h-1.5 rounded-full bg-[#2F80ED]" />
        </div>
      </div>
    </div>
  )
}
