import { Wrench, Phone, Mail, MapPin } from 'lucide-react'
import { COMPANY_INFO } from '@/config/company'

export function MaintenancePage() {
  return (
    <div className="min-h-screen bg-[#0B1220] text-white flex flex-col justify-between selection:bg-[#2F80ED] selection:text-white">
      {/* Top Header Bar */}
      <header className="border-b border-[#1A2433] bg-[#0B1220]/90 backdrop-blur-md sticky top-0 z-50 py-4 px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white p-1.5 shadow-md flex items-center justify-center">
              <img src={COMPANY_INFO.logoSrc} alt={COMPANY_INFO.logoAlt} className="w-full h-full object-contain" />
            </div>
            <div>
              <span className="font-['Manrope'] font-extrabold text-white text-base tracking-tight block">
                APSON <span className="text-[#2F80ED]">INDUSTRIES</span>
              </span>
              <span className="text-[10px] text-slate-400 font-mono tracking-widest uppercase block">
                Roorkee • India
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Body */}
      <main className="flex-1 flex items-center justify-center p-6 sm:p-12">
        <div className="max-w-2xl w-full bg-[#1A2433] border border-[#2A3649] rounded-3xl p-8 sm:p-12 shadow-2xl space-y-8 relative overflow-hidden">
          {/* Subtle Ambient Background Gradient */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#2F80ED]/10 rounded-full blur-3xl pointer-events-none" />

          {/* Status Badge */}
          <div className="flex items-center justify-between">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#2F80ED]/15 border border-[#2F80ED]/30 text-[#2F80ED] text-xs font-bold uppercase tracking-wider">
              <Wrench className="w-4 h-4 animate-bounce" />
              <span>Under Scheduled Maintenance</span>
            </div>
          </div>

          {/* Heading */}
          <div className="space-y-4">
            <h1 className="font-['Manrope'] font-extrabold text-3xl sm:text-5xl text-white tracking-tight leading-tight">
              We&apos;ll Be Back Soon!
            </h1>
          </div>

          {/* Verified Contact Info Card */}
          <div className="bg-[#0B1220] border border-[#2A3649] rounded-2xl p-6 space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-widest text-[#2F80ED] font-['Manrope']">
              Direct Assistance & Inquiries
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-300">
              {/* Address */}
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-[#2F80ED] shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-white mb-0.5">Manufacturing Facility</div>
                  <div>{COMPANY_INFO.address.fullFormatted}</div>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-[#2F80ED] shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-white mb-0.5">Email Support</div>
                  <a href={`mailto:${COMPANY_INFO.email}`} className="hover:text-[#2F80ED] transition-colors underline">
                    {COMPANY_INFO.email}
                  </a>
                </div>
              </div>

              {/* Phone Lines */}
              <div className="flex items-start gap-3 sm:col-span-2">
                <Phone className="w-4 h-4 text-[#2F80ED] shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-white mb-0.5">Direct Phone Lines</div>
                  <div className="flex flex-wrap gap-x-4 gap-y-1">
                    {COMPANY_INFO.phones.map((phone) => (
                      <a key={phone.raw} href={`tel:${phone.raw}`} className="hover:text-[#2F80ED] transition-colors">
                        +91 {phone.display}
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#1A2433] py-4 px-6 text-center text-xs text-slate-500 font-mono">
        © {new Date().getFullYear()} APSON INDUSTRIES. All rights reserved.
      </footer>
    </div>
  )
}
