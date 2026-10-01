import { Link } from 'react-router-dom'
import { Mail, Phone, MapPin, Map } from 'lucide-react'
import { COMPANY_INFO, NAV_LINKS } from '@/config/company'

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-[#0B1220] text-slate-300 border-t border-[#1A2433] mt-auto relative">
      {/* Top Accent Gradient Line */}
      <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-[#2F80ED] to-transparent opacity-70" />

      {/* Primary Footer Content Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          
          {/* Column 1: BRAND SECTION */}
          <div className="space-y-4">
            <Link to="/" className="inline-flex items-center gap-3 group focus:outline-none">
              <div className="p-1.5 bg-white rounded-xl shadow-md group-hover:scale-105 transition-transform">
                <img
                  src={COMPANY_INFO.logoSrc}
                  alt={COMPANY_INFO.logoAlt}
                  className="h-12 w-auto object-contain"
                />
              </div>
              <div>
                <h2 className="font-['Manrope'] text-lg font-black tracking-wider text-white uppercase group-hover:text-[#2F80ED] transition-colors leading-tight">
                  APSON
                </h2>
                <span className="text-xs font-bold font-mono text-[#2F80ED] tracking-widest uppercase block">
                  INDUSTRIES
                </span>
              </div>
            </Link>
            
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed pt-1">
              {COMPANY_INFO.description}
            </p>
          </div>

          {/* Column 2: QUICK LINKS SECTION */}
          <div className="space-y-4">
            <h3 className="font-['Manrope'] text-sm font-bold tracking-wider text-white uppercase border-b border-[#1A2433] pb-2">
              Quick Links
            </h3>
            <ul className="space-y-2.5 text-sm">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="group inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors focus:outline-none focus:ring-1 focus:ring-[#2F80ED] rounded px-1 -mx-1"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-600 group-hover:bg-[#2F80ED] transition-colors" />
                    <span>{link.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: CONTACT DETAILS SECTION */}
          <div className="space-y-4">
            <h3 className="font-['Manrope'] text-sm font-bold tracking-wider text-white uppercase border-b border-[#1A2433] pb-2">
              Contact Details
            </h3>
            <div className="space-y-3 text-sm text-slate-400">
              
              {/* Address Card */}
              <div className="bg-[#1A2433]/50 p-3 rounded-lg border border-[#2A3649] hover:border-[#2F80ED]/40 transition-colors flex items-start gap-3">
                <MapPin className="w-4 h-4 text-[#2F80ED] shrink-0 mt-0.5" aria-hidden="true" />
                <address className="not-italic leading-relaxed text-slate-300 text-xs sm:text-sm">
                  {COMPANY_INFO.address.street},<br />
                  {COMPANY_INFO.address.city} – {COMPANY_INFO.address.postalCode},<br />
                  {COMPANY_INFO.address.state} {COMPANY_INFO.address.country}
                </address>
              </div>

              {/* Phone Card */}
              <div className="bg-[#1A2433]/50 p-3 rounded-lg border border-[#2A3649] hover:border-[#2F80ED]/40 transition-colors flex items-start gap-3">
                <Phone className="w-4 h-4 text-[#2F80ED] shrink-0 mt-0.5" aria-hidden="true" />
                <div className="flex flex-col gap-1 text-xs sm:text-sm">
                  {COMPANY_INFO.phones.map((phone) => (
                    <a
                      key={phone.raw}
                      href={`tel:${phone.raw}`}
                      className="hover:text-white transition-colors focus:outline-none focus:ring-1 focus:ring-[#2F80ED] rounded"
                      aria-label={`Call ${phone.display}`}
                    >
                      +91 {phone.display}
                    </a>
                  ))}
                </div>
              </div>

              {/* Email Card */}
              <div className="bg-[#1A2433]/50 p-3 rounded-lg border border-[#2A3649] hover:border-[#2F80ED]/40 transition-colors flex items-center gap-3">
                <Mail className="w-4 h-4 text-[#2F80ED] shrink-0" aria-hidden="true" />
                <a
                  href={`mailto:${COMPANY_INFO.email}`}
                  className="hover:text-white transition-colors break-all text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-[#2F80ED] rounded"
                  aria-label={`Email ${COMPANY_INFO.email}`}
                >
                  {COMPANY_INFO.email}
                </a>
              </div>

            </div>
          </div>

          {/* Column 4: GOOGLE MAP WIDGET SECTION */}
          <div className="space-y-3">
            <h3 className="font-['Manrope'] text-sm font-bold tracking-wider text-white uppercase border-b border-[#1A2433] pb-2">
              Location Map
            </h3>
            
            {/* Embedded Google Map Frame */}
            <div className="rounded-2xl overflow-hidden border border-[#2A3649] bg-[#1A2433] shadow-md relative w-full h-44 sm:h-48 group">
              <iframe
                title="APSON INDUSTRIES Location Map"
                src={COMPANY_INFO.googleMapsEmbedUrl}
                className="w-full h-full border-0"
                loading="lazy"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              />
            </div>

            {/* Direct Open Link */}
            <div>
              <a
                href={COMPANY_INFO.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#2F80ED] hover:text-white font-medium text-xs sm:text-sm inline-flex items-center gap-1.5 transition-colors focus:outline-none focus:ring-1 focus:ring-[#2F80ED] rounded"
                aria-label="Open location in Google Maps (opens in new tab)"
              >
                <Map className="w-3.5 h-3.5" />
                <span>Open in Google Maps →</span>
              </a>
            </div>
          </div>

        </div>
      </div>

      {/* Bottom Sub-Footer Bar */}
      <div className="bg-[#070D1E] border-t border-[#1A2433] py-4 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-center text-center text-xs text-slate-400">
          <p>
            © {currentYear} {COMPANY_INFO.name}. All rights reserved | Powered by{' '}
            <span className="text-[#2F80ED] font-semibold">FSIR Roorkee</span>
          </p>
        </div>
      </div>
    </footer>
  )
}
