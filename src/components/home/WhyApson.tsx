import { motion, useReducedMotion, type Variants } from 'framer-motion'
import { Layers, Cpu, Sliders, Wrench, type LucideIcon } from 'lucide-react'
import type { WhyApsonSectionData } from '@/types/cms'
import { DEFAULT_WHY_APSON_DATA } from '@/config/cmsSeedData'

interface WhyApsonProps {
  data?: WhyApsonSectionData
}

// Icon dictionary lookup helper
const ICON_MAP: Record<string, LucideIcon> = {
  Layers,
  Cpu,
  Sliders,
  Wrench,
}

export function WhyApson({ data = DEFAULT_WHY_APSON_DATA }: WhyApsonProps) {
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
        
        {/* Section Header */}
        <div className="max-w-3xl mb-12 lg:mb-16 space-y-4">
          <div className="inline-flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#2F80ED]" />
            <span className="font-['Manrope'] text-xs font-bold tracking-widest text-[#2F80ED] uppercase">
              {data.eyebrow}
            </span>
          </div>

          <h2 className="font-['Manrope'] text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#0B1220] tracking-tight leading-[1.15]">
            {data.heading}
          </h2>

          <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
            {data.introduction}
          </p>
        </div>

        {/* 4 Feature Points Grid (Editorial Industrial Layout) */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10"
        >
          {data.features.map((feature) => {
            const IconComponent = feature.iconName ? ICON_MAP[feature.iconName] : null

            return (
              <motion.div
                key={feature.number}
                variants={itemVariants}
                className="border-t-2 border-[#1A2433]/15 pt-6 flex flex-col justify-between space-y-4 group hover:border-[#2F80ED] transition-colors duration-300"
              >
                <div className="space-y-3">
                  {/* Numbering & Icon Bar */}
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-2xl sm:text-3xl font-extrabold text-[#2F80ED] tracking-wider">
                      {feature.number}
                    </span>
                    {IconComponent && (
                      <IconComponent className="w-5 h-5 text-slate-400 group-hover:text-[#2F80ED] transition-colors" />
                    )}
                  </div>

                  {/* Feature Title */}
                  <h3 className="font-['Manrope'] font-bold text-xl text-[#0B1220] leading-snug">
                    {feature.title}
                  </h3>

                  {/* Feature Description */}
                  <p className="text-slate-600 text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            )
          })}
        </motion.div>

      </div>
    </section>
  )
}
