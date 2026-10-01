import { motion, useReducedMotion, type Variants } from 'framer-motion'
import { Activity, Grid, MapPin, Award, type LucideIcon } from 'lucide-react'
import type { AboutStatItem } from '@/types/cms'

interface AboutStatsProps {
  statistics: AboutStatItem[]
}

const ICON_MAP: Record<string, LucideIcon> = {
  Activity,
  Grid,
  MapPin,
  Award,
}

export function AboutStats({ statistics }: AboutStatsProps) {
  const shouldReduceMotion = useReducedMotion()

  const visibleStats = (statistics || []).filter(
    (s) => s.isVisible && s.value && s.label
  )

  if (visibleStats.length === 0) return null

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
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 16 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: [0, 0, 0.2, 1] },
    },
  }

  return (
    <section className="bg-[#0B1220] text-white py-12 sm:py-16 border-b border-[#2A3649] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-40px' }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
        >
          {visibleStats.map((stat) => {
            const IconComponent = stat.iconName ? ICON_MAP[stat.iconName] : null

            return (
              <motion.div
                key={stat.id}
                variants={itemVariants}
                className="bg-[#1A2433]/80 backdrop-blur-md p-6 rounded-xl border border-[#2A3649] flex items-center gap-4 hover:border-[#2F80ED]/50 transition-colors"
              >
                {IconComponent && (
                  <div className="p-3 rounded-lg bg-[#2F80ED]/15 text-[#2F80ED] shrink-0">
                    <IconComponent className="w-6 h-6" />
                  </div>
                )}
                <div>
                  <div className="font-['Manrope'] text-3xl font-extrabold text-white tracking-tight flex items-baseline gap-1">
                    <span>{stat.value}</span>
                    {stat.suffix && (
                      <span className="text-sm font-semibold text-[#2F80ED] font-sans">
                        {stat.suffix}
                      </span>
                    )}
                  </div>
                  <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 mt-0.5">
                    {stat.label}
                  </div>
                </div>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}
