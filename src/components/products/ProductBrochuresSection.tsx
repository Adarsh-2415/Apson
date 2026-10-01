import { motion } from 'framer-motion'
import { Eye, Download, Sparkles } from 'lucide-react'
import type { ProductBrochureItem } from '@/types/products'

interface ProductBrochuresSectionProps {
  brochures?: ProductBrochureItem[]
  onViewBrochure: (brochure: ProductBrochureItem) => void
}

export function ProductBrochuresSection({
  brochures = [],
  onViewBrochure,
}: ProductBrochuresSectionProps) {
  if (!brochures || brochures.length === 0) return null

  return (
    <section className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 text-xs font-mono text-[#2F80ED] font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>TECHNICAL DOCUMENTATION & CATALOGUES</span>
          </div>
          <h2 className="font-['Manrope'] text-2xl font-extrabold text-[#0B1220]">
            Product Brochures
          </h2>
        </div>

        <span className="text-xs font-mono text-slate-500 bg-slate-100 px-3 py-1 rounded-full font-semibold">
          2 PDF Catalogues Available
        </span>
      </div>

      {/* Brochure Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {brochures.map((item) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-[#0B1220] text-white rounded-xl p-6 border border-[#2A3649] shadow-lg flex flex-col justify-between space-y-4 group hover:border-[#2F80ED]/50 transition-all duration-300"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-2">
                <span className="px-2.5 py-1 rounded-md bg-[#2F80ED]/20 text-[#2F80ED] border border-[#2F80ED]/30 text-[10px] font-mono font-bold uppercase tracking-wider">
                  {item.badge || 'PDF Brochure'}
                </span>
                {item.fileSize && (
                  <span className="text-[11px] font-mono text-slate-400">
                    {item.fileSize}
                  </span>
                )}
              </div>

              <h3 className="font-['Manrope'] font-bold text-lg text-white group-hover:text-[#2F80ED] transition-colors leading-snug">
                {item.title}
              </h3>

              <p className="text-slate-300 text-xs sm:text-sm leading-relaxed line-clamp-3">
                {item.description}
              </p>
            </div>

            {/* Actions: View In-Page Modal vs Download */}
            <div className="pt-3 border-t border-[#2A3649] flex items-center gap-3">
              <button
                type="button"
                onClick={() => onViewBrochure(item)}
                className="flex-1 py-2.5 px-4 bg-[#2F80ED] hover:bg-[#1d6ed8] text-white text-xs font-bold uppercase tracking-wider rounded-lg shadow-md transition-all flex items-center justify-center gap-2"
              >
                <Eye className="w-4 h-4" />
                <span>View Brochure</span>
              </button>

              <a
                href={item.pdfUrl}
                download
                className="py-2.5 px-4 bg-[#1A2433] hover:bg-slate-800 text-slate-200 hover:text-white text-xs font-bold uppercase tracking-wider rounded-lg border border-[#2A3649] transition-all flex items-center justify-center gap-1.5"
                title={`Download ${item.title}`}
              >
                <Download className="w-4 h-4 text-[#2F80ED]" />
                <span className="hidden sm:inline">Download</span>
              </a>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
