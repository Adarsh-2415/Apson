import { motion, useReducedMotion, type Variants } from 'framer-motion'
import { CheckCircle2, ShieldCheck } from 'lucide-react'
import type { AboutIntroData } from '@/types/cms'

interface AboutCompanyIntroProps {
  data: AboutIntroData
}

export function AboutCompanyIntro({ data }: AboutCompanyIntroProps) {
  const shouldReduceMotion = useReducedMotion()

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : 0.1,
        delayChildren: 0.05,
      },
    },
  }

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: [0, 0, 0.2, 1] },
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
          {/* Left Column: Image */}
          <motion.div variants={itemVariants} className="lg:col-span-5 order-2 lg:order-1">
            <div className="relative rounded-2xl overflow-hidden border border-slate-200 bg-[#0B1220] shadow-xl group">
              <img
                src={data.imageSrc}
                alt={data.imageAlt}
                className="w-full h-[360px] sm:h-[440px] lg:h-[480px] object-cover object-center transition-transform duration-700 ease-out group-hover:scale-103"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0B1220]/70 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-4 left-4 right-4 bg-[#0B1220]/90 backdrop-blur-md p-3.5 rounded-xl border border-[#2A3649] flex items-center gap-2.5 shadow-lg text-white">
                <ShieldCheck className="w-5 h-5 text-[#2F80ED] shrink-0" />
                <span className="text-xs font-semibold text-slate-200 font-['Manrope'] tracking-wide">
                  APSON INDUSTRIES • ROORKEE
                </span>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Text & Content */}
          <div className="lg:col-span-7 space-y-6 order-1 lg:order-2">
            <motion.div variants={itemVariants} className="flex items-center gap-2.5">
              <span className="w-2 h-2 rounded-full bg-[#2F80ED]" />
              <span className="font-['Manrope'] text-xs font-bold tracking-widest text-[#2F80ED] uppercase">
                {data.eyebrow}
              </span>
              <div className="h-px w-12 bg-gradient-to-r from-[#2F80ED]/50 to-transparent" />
            </motion.div>

            <motion.h2
              variants={itemVariants}
              className="font-['Manrope'] text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#0B1220] tracking-tight leading-[1.15]"
            >
              {data.heading}
            </motion.h2>

            <motion.div variants={itemVariants} className="space-y-4 text-slate-600 text-base sm:text-lg leading-relaxed">
              {data.paragraphs.map((p, idx) => (
                <p key={idx}>{p}</p>
              ))}
            </motion.div>

            {/* Highlights List */}
            {data.highlights && data.highlights.length > 0 && (
              <motion.div variants={itemVariants} className="pt-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4 border-t border-slate-100">
                  {data.highlights.map((highlight, idx) => (
                    <div key={idx} className="flex items-center gap-2.5 text-sm font-semibold text-[#0B1220]">
                      <CheckCircle2 className="w-4 h-4 text-[#2F80ED] shrink-0" />
                      <span>{highlight}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
