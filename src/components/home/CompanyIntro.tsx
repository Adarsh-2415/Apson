import { Link } from 'react-router-dom'
import { motion, useReducedMotion, type Variants } from 'framer-motion'
import { ArrowRight, ShieldCheck } from 'lucide-react'
import type { CompanyIntroData } from '@/types/cms'
import { DEFAULT_COMPANY_INTRO_DATA } from '@/config/cmsSeedData'

interface CompanyIntroProps {
  data?: CompanyIntroData
}

export function CompanyIntro({ data = DEFAULT_COMPANY_INTRO_DATA }: CompanyIntroProps) {
  const shouldReduceMotion = useReducedMotion()

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : 0.12,
        delayChildren: 0.05,
      },
    },
  }

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 24 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0, 0, 0.2, 1] },
    },
  }

  const imageVariants: Variants = {
    hidden: { opacity: 0, scale: shouldReduceMotion ? 1 : 0.98 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.7, ease: [0, 0, 0.2, 1] },
    },
  }

  return (
    <section className="bg-white text-[#111827] py-16 sm:py-24 border-b border-slate-200 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center"
        >
          {/* Left Column: Text Content */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Eyebrow Label */}
            <motion.div variants={itemVariants} className="flex items-center gap-2.5">
              <span className="w-2 h-2 rounded-full bg-[#2F80ED]" />
              <span className="font-['Manrope'] text-xs font-bold tracking-widest text-[#2F80ED] uppercase">
                {data.eyebrow}
              </span>
              <div className="h-px w-12 bg-gradient-to-r from-[#2F80ED]/50 to-transparent" />
            </motion.div>

            {/* Main Heading */}
            <motion.h2
              variants={itemVariants}
              className="font-['Manrope'] text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#0B1220] tracking-tight leading-[1.15]"
            >
              {data.heading}
            </motion.h2>

            {/* Description Paragraphs */}
            <motion.div variants={itemVariants} className="space-y-4 text-slate-600 text-base sm:text-lg leading-relaxed">
              {data.descriptionParagraphs.map((paragraph, idx) => (
                <p key={idx}>{paragraph}</p>
              ))}
            </motion.div>

            {/* CTA Button */}
            <motion.div variants={itemVariants} className="pt-2">
              <Link
                to={data.ctaHref}
                className="inline-flex items-center gap-3 px-6 py-3.5 bg-[#0B1220] hover:bg-[#2F80ED] text-white text-sm font-semibold rounded-md shadow-md hover:shadow-lg transition-all duration-200 group focus:outline-none focus:ring-2 focus:ring-[#2F80ED] focus:ring-offset-2"
                aria-label={`${data.ctaText} page`}
              >
                <span>{data.ctaText}</span>
                <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-white transition-transform group-hover:translate-x-1" />
              </Link>
            </motion.div>

          </div>

          {/* Right Column: Visual Equipment Photography */}
          <motion.div variants={imageVariants} className="lg:col-span-5">
            <div className="relative rounded-2xl overflow-hidden border border-slate-200 bg-[#0B1220] shadow-xl group">
              {/* Equipment Photo */}
              <img
                src={data.imageSrc}
                alt={data.imageAlt}
                className="w-full h-[360px] sm:h-[440px] lg:h-[480px] object-cover object-center transition-transform duration-700 ease-out group-hover:scale-103"
              />

              {/* Subdued Dark Gradient Bottom Edge */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0B1220]/70 via-transparent to-transparent pointer-events-none" />

              {/* Architectural Technical Badge */}
              <div className="absolute bottom-4 left-4 right-4 bg-[#0B1220]/90 backdrop-blur-md p-3.5 rounded-xl border border-[#2A3649] flex items-center justify-between shadow-lg text-white">
                <div className="flex items-center gap-2.5">
                  <ShieldCheck className="w-5 h-5 text-[#2F80ED] shrink-0" />
                  <span className="text-xs font-semibold text-slate-200 font-['Manrope'] tracking-wide">
                    APSON INDUSTRIES • ROORKEE
                  </span>
                </div>
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">
                  ISO SPEC
                </span>
              </div>
            </div>
          </motion.div>

        </motion.div>
      </div>
    </section>
  )
}
