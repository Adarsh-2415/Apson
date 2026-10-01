import { motion, useReducedMotion, type Variants } from 'framer-motion'
import { Calendar } from 'lucide-react'
import type { AboutMilestonesData } from '@/types/cms'

interface AboutMilestonesProps {
  data: AboutMilestonesData
}

export function AboutMilestones({ data }: AboutMilestonesProps) {
  const shouldReduceMotion = useReducedMotion()

  if (!data?.isVisible) return null

  const items = (data?.items || [])
    .filter((item) => item.isVisible)
    .sort((a, b) => a.displayOrder - b.displayOrder)

  if (items.length === 0) return null

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
        
        {/* Section Header */}
        <div className="max-w-3xl mb-12 lg:mb-16 space-y-3">
          <div className="inline-flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#2F80ED]" />
            <span className="font-['Manrope'] text-xs font-bold tracking-widest text-[#2F80ED] uppercase">
              {data.eyebrow}
            </span>
          </div>

          <h2 className="font-['Manrope'] text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#0B1220] tracking-tight">
            {data.heading}
          </h2>

          <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
            {data.description}
          </p>
        </div>

        {/* Milestone Timeline Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 relative"
        >
          {items.map((milestone, idx) => (
            <motion.div
              key={milestone.id}
              variants={itemVariants}
              className="bg-[#F7F8FA] rounded-xl border border-slate-200 p-6 sm:p-7 hover:border-[#2F80ED]/40 hover:shadow-md transition-all relative space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0B1220] text-[#2F80ED] font-mono text-xs font-bold tracking-wider">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{milestone.year}</span>
                </span>
                <span className="text-xs font-bold font-mono text-slate-400">
                  0{idx + 1}
                </span>
              </div>

              <h3 className="font-['Manrope'] font-bold text-xl text-[#0B1220]">
                {milestone.title}
              </h3>

              <p className="text-slate-600 text-sm leading-relaxed">
                {milestone.description}
              </p>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  )
}
