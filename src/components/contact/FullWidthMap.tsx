import { Map, ExternalLink } from 'lucide-react'
import { COMPANY_INFO } from '@/config/company'

export function FullWidthMap() {
  return (
    <section className="w-full bg-[#0B1220] border-t border-[#2A3649] py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-md bg-[#2F80ED]/20 text-[#2F80ED]">
              <Map className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-['Manrope'] text-lg font-bold text-white">
                Office Location Map
              </h3>
              <p className="text-slate-400 text-xs sm:text-sm">
                385/2, Jadugar Road, 42 Civil Lines, Roorkee – 247 667, Uttarakhand, India
              </p>
            </div>
          </div>

          <a
            href={COMPANY_INFO.googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#2F80ED] hover:bg-[#1d6ed8] text-white text-xs font-semibold rounded-md shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-[#2F80ED]"
            aria-label="Open location in Google Maps (opens in new tab)"
          >
            <span>Open in Google Maps</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Embedded Interactive Map Container */}
        <div className="rounded-2xl overflow-hidden border border-[#2A3649] bg-[#1A2433] shadow-2xl relative w-full h-[400px] sm:h-[480px] lg:h-[520px]">
          <iframe
            title="APSON INDUSTRIES Location Map"
            src={COMPANY_INFO.googleMapsEmbedUrl}
            className="w-full h-full border-0"
            loading="lazy"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
        </div>

      </div>
    </section>
  )
}
