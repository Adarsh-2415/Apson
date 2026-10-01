import { Mail, Phone } from 'lucide-react'
import { COMPANY_INFO } from '@/config/company'

export function TopInfoBar() {
  return (
    <div className="bg-[#0B1220] text-slate-300 text-xs border-b border-[#1A2433] py-2 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2 text-center md:text-left">
        {/* Email Contact */}
        <div className="flex items-center gap-2">
          <Mail className="w-3.5 h-3.5 text-[#2F80ED] shrink-0" aria-hidden="true" />
          <span className="text-slate-400 font-medium hidden sm:inline">Email:</span>
          <a
            href={`mailto:${COMPANY_INFO.email}`}
            className="text-slate-200 hover:text-white transition-colors focus:outline-none focus:ring-1 focus:ring-[#2F80ED] rounded px-1"
            aria-label={`Send email to ${COMPANY_INFO.email}`}
          >
            {COMPANY_INFO.email}
          </a>
        </div>

        {/* Phone Contact List */}
        <div className="flex items-center flex-wrap justify-center md:justify-end gap-x-3 gap-y-1">
          <div className="flex items-center gap-1.5">
            <Phone className="w-3.5 h-3.5 text-[#2F80ED] shrink-0" aria-hidden="true" />
            <span className="text-slate-400 font-medium hidden sm:inline">Phone:</span>
          </div>
          <div className="flex items-center flex-wrap justify-center gap-2 text-slate-200">
            {COMPANY_INFO.phones.map((phone, idx) => (
              <span key={phone.raw} className="inline-flex items-center gap-2">
                <a
                  href={`tel:${phone.raw}`}
                  className="hover:text-white transition-colors focus:outline-none focus:ring-1 focus:ring-[#2F80ED] rounded px-0.5"
                  aria-label={`Call ${phone.display}`}
                >
                  {phone.display}
                </a>
                {idx < COMPANY_INFO.phones.length - 1 && (
                  <span className="text-slate-600 select-none" aria-hidden="true">•</span>
                )}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
