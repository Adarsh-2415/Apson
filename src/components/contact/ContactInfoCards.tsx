import { MapPin, Phone, Mail } from 'lucide-react'
import { COMPANY_INFO } from '@/config/company'

export function ContactInfoCards() {
  return (
    <div className="space-y-6">
      {/* Title & Introduction */}
      <div className="space-y-2">
        <h2 className="font-['Manrope'] text-2xl sm:text-3xl font-extrabold text-[#0B1220]">
          Contact Details
        </h2>
        <p className="text-slate-600 text-sm leading-relaxed">
          Reach out directly to our engineering and administrative team in Roorkee for enquiries regarding vibration systems, environmental chambers, and custom assemblies.
        </p>
      </div>

      {/* Cards List */}
      <div className="space-y-4">
        {/* Address Card */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:border-[#2F80ED]/40 transition-colors flex items-start gap-4">
          <div className="p-2.5 rounded-lg bg-[#2F80ED]/10 text-[#2F80ED] shrink-0">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-['Manrope'] font-bold text-base text-[#0B1220] mb-1">
              Office
            </h3>
            <address className="not-italic text-slate-600 text-sm leading-relaxed">
              {COMPANY_INFO.address.fullFormatted}
            </address>
          </div>
        </div>

        {/* Phone Card */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:border-[#2F80ED]/40 transition-colors flex items-start gap-4">
          <div className="p-2.5 rounded-lg bg-[#2F80ED]/10 text-[#2F80ED] shrink-0">
            <Phone className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-['Manrope'] font-bold text-base text-[#0B1220] mb-1">
              Direct Phone Lines
            </h3>
            <div className="flex flex-col gap-1 text-sm text-slate-600">
              {COMPANY_INFO.phones.map((phone) => (
                <a
                  key={phone.raw}
                  href={`tel:${phone.raw}`}
                  className="hover:text-[#2F80ED] font-medium transition-colors inline-flex items-center gap-2"
                >
                  <span>+91 {phone.display}</span>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Email Card */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:border-[#2F80ED]/40 transition-colors flex items-start gap-4">
          <div className="p-2.5 rounded-lg bg-[#2F80ED]/10 text-[#2F80ED] shrink-0">
            <Mail className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-['Manrope'] font-bold text-base text-[#0B1220] mb-1">
              Email Communication
            </h3>
            <a
              href={`mailto:${COMPANY_INFO.email}`}
              className="text-slate-600 hover:text-[#2F80ED] font-medium text-sm transition-colors break-all"
            >
              {COMPANY_INFO.email}
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
