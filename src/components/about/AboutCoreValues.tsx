import { motion, useReducedMotion, type Variants } from 'framer-motion'
import {
  Award,
  Shield,
  Zap,
  Anchor,
  Heart,
  TrendingUp,
  type LucideIcon,
} from 'lucide-react'
import type { AboutCoreValuesData } from '@/types/cms'

interface AboutCoreValuesProps {
  data: AboutCoreValuesData
}

const ICON_MAP: Record<string, LucideIcon> = {
  Award,
  Shield,
  Zap,
  Anchor,
  Heart,
  TrendingUp,
}

export function AboutCoreValues({ data }: AboutCoreValuesProps) {
  const shouldReduceMotion = useReducedMotion()

  const items = (data?.items || [])
    .filter((item) => item.isVisible)
    .sort((a, b) => a.displayOrder - b.displayOrder)

  if (items.length === 0) return null

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : 0.08,
        delayChildren: 0.05,
      },
    },
  }

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: [0, 0, 0.2, 1] },
    },
  }

  return (
    <section className="bg-[#0B1220] text-white py-16 sm:py-24 border-b border-[#2A3649] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-12 lg:mb-16 space-y-3">
          <div className="inline-flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#2F80ED]" />
            <span className="font-['Manrope'] text-xs font-bold tracking-widest text-[#2F80ED] uppercase">
              {data.eyebrow}
            </span>
          </div>

          <h2 className="font-['Manrope'] text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
            {data.heading}
          </h2>
        </div>

        {/* Core Values Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {items.map((item) => {
            const IconComponent = item.iconName ? ICON_MAP[item.iconName] || Shield : Shield

            return (
              <motion.div
                key={item.id}
                variants={itemVariants}
                className="bg-[#1A2433]/80 backdrop-blur-md rounded-xl border border-[#2A3649] p-6 sm:p-7 hover:border-[#2F80ED]/50 transition-all space-y-3"
              >
                <div className="p-3 rounded-lg bg-[#2F80ED]/15 text-[#2F80ED] inline-block">
                  <IconComponent className="w-6 h-6" />
                </div>
                <h3 className="font-['Manrope'] font-bold text-xl text-white">
                  {item.title}
                </h3>
                <p className="text-slate-300 text-sm leading-relaxed">
                  {item.description}
                </p>
              </motion.div>
            )
          })}
        </motion.div>

      </div>
    </section>
  )
}
