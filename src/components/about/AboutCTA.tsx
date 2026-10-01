import { Link } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import { ArrowRight, Boxes } from 'lucide-react'
import type { AboutCTAData } from '@/types/cms'

interface AboutCTAProps {
  data: AboutCTAData
}

export function AboutCTA({ data }: AboutCTAProps) {
  const shouldReduceMotion = useReducedMotion()

  if (!data?.isVisible) return null

  return (
    <section className="bg-[#0B1220] text-white py-16 sm:py-24 relative overflow-hidden">
      {/* Top Hairline Gradient Accent */}
      <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-[#2F80ED] to-transparent opacity-80 absolute top-0 left-0" />

      {/* Subtle Background Grid Overlay */}
      <div
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage:
            'radial-gradient(rgba(47, 128, 237, 0.4) 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6, ease: [0, 0, 0.2, 1] }}
          className="bg-[#1A2433]/80 backdrop-blur-md border border-[#2A3649] rounded-2xl p-8 sm:p-12 lg:p-16 shadow-2xl text-center max-w-4xl mx-auto space-y-6"
        >
          {/* Eyebrow Label */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#2F80ED]/15 border border-[#2F80ED]/30 text-[#2F80ED] text-xs font-bold tracking-wider uppercase">
            <Boxes className="w-3.5 h-3.5" />
            <span>{data.eyebrow}</span>
          </div>

          {/* Heading */}
          <h2 className="font-['Manrope'] text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
            {data.heading}
          </h2>

          {/* Description */}
          <p className="text-slate-300 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto">
            {data.description}
          </p>

          {/* Action Buttons */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
            <Link
              to={data.primaryCtaHref}
              className="inline-flex items-center gap-2.5 px-7 py-3.5 bg-[#2F80ED] hover:bg-[#1d6ed8] text-white text-sm font-semibold rounded-md shadow-lg shadow-[#2F80ED]/25 transition-all transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-[#2F80ED]"
            >
              <span>{data.primaryCtaText}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              to={data.secondaryCtaHref}
              className="inline-flex items-center gap-2.5 px-7 py-3.5 bg-transparent hover:bg-white/10 text-white text-sm font-semibold rounded-md border border-slate-400/40 transition-all focus:outline-none focus:ring-2 focus:ring-slate-300"
            >
              <span>{data.secondaryCtaText}</span>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
