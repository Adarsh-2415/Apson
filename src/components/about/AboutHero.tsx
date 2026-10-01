import { Link } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import { ChevronRight } from 'lucide-react'
import type { AboutHeroData } from '@/types/cms'

interface AboutHeroProps {
  data: AboutHeroData
}

export function AboutHero({ data }: AboutHeroProps) {
  const shouldReduceMotion = useReducedMotion()

  return (
    <section className="relative w-full bg-[#0B1220] text-white py-16 sm:py-24 border-b border-[#2A3649] overflow-hidden">
      {/* Background Image with Dark Navy Vignette */}
      <div className="absolute inset-0 z-0">
        <img
          src={data.imageSrc}
          alt={data.imageAlt}
          className="w-full h-full object-cover object-center opacity-25"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0B1220] via-[#0B1220]/90 to-[#0B1220]/70" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B1220] via-transparent to-transparent" />
      </div>

      {/* Top Hairline Accent */}
      <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-[#2F80ED] to-transparent opacity-80 absolute top-0 left-0" />

      {/* Hero Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0, 0, 0.2, 1] }}
          className="max-w-3xl space-y-4"
        >
          {/* Breadcrumb Navigation */}
          <nav className="flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
            <Link to="/" className="hover:text-white transition-colors">
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-[#2F80ED]" />
            <span className="text-[#2F80ED]">About Us</span>
          </nav>

          {/* Eyebrow Label */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#2F80ED]/15 border border-[#2F80ED]/30 text-[#2F80ED] text-xs font-bold tracking-wider uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-[#2F80ED] animate-pulse" />
            <span>{data.eyebrow}</span>
          </div>

          {/* Main Heading */}
          <h1 className="font-['Manrope'] text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
            {data.heading}
          </h1>

          {/* Supporting Description */}
          <p className="text-slate-300 text-base sm:text-lg leading-relaxed pt-1">
            {data.description}
          </p>
        </motion.div>
      </div>
    </section>
  )
}
