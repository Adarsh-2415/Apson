import { motion, useReducedMotion, type Variants } from 'framer-motion'
import { Target, Eye, type LucideIcon } from 'lucide-react'
import type { AboutMissionVisionData } from '@/types/cms'

interface AboutMissionVisionProps {
  data: AboutMissionVisionData
}

const ICON_MAP: Record<string, LucideIcon> = {
  Target,
  Eye,
}

export function AboutMissionVision({ data }: AboutMissionVisionProps) {
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

  const cardVariants: Variants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: [0, 0, 0.2, 1] },
    },
  }

  const MissionIcon = data.mission.iconName ? ICON_MAP[data.mission.iconName] || Target : Target
  const VisionIcon = data.vision.iconName ? ICON_MAP[data.vision.iconName] || Eye : Eye

  return (
    <section className="bg-[#F7F8FA] text-[#111827] py-16 sm:py-24 border-b border-slate-200 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12"
        >
          {/* Our Mission Card */}
          <motion.div
            variants={cardVariants}
            className="bg-white rounded-2xl border border-slate-200 p-8 sm:p-10 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between space-y-4"
          >
            <div className="space-y-4">
              <div className="p-3.5 rounded-xl bg-[#2F80ED]/10 text-[#2F80ED] inline-block">
                <MissionIcon className="w-7 h-7" />
              </div>
              <h3 className="font-['Manrope'] text-2xl font-extrabold text-[#0B1220]">
                {data.mission.heading}
              </h3>
              <p className="text-slate-600 text-base leading-relaxed">
                {data.mission.description}
              </p>
            </div>
            <div className="pt-4 border-t border-slate-100 text-xs font-semibold uppercase tracking-wider text-[#2F80ED]">
              APSON INDUSTRIES • Mission Statement
            </div>
          </motion.div>

          {/* Our Vision Card */}
          <motion.div
            variants={cardVariants}
            className="bg-white rounded-2xl border border-slate-200 p-8 sm:p-10 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between space-y-4"
          >
            <div className="space-y-4">
              <div className="p-3.5 rounded-xl bg-[#0B1220] text-[#2F80ED] inline-block">
                <VisionIcon className="w-7 h-7" />
              </div>
              <h3 className="font-['Manrope'] text-2xl font-extrabold text-[#0B1220]">
                {data.vision.heading}
              </h3>
              <p className="text-slate-600 text-base leading-relaxed">
                {data.vision.description}
              </p>
            </div>
            <div className="pt-4 border-t border-slate-100 text-xs font-semibold uppercase tracking-wider text-[#0B1220]">
              APSON INDUSTRIES • Future Direction
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
