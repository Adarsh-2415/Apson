import { motion, useReducedMotion, type Variants } from 'framer-motion'
import { Car, Radio, CloudRain, Factory, Layers, type LucideIcon } from 'lucide-react'
import type { AboutIndustriesData } from '@/types/cms'

interface AboutIndustriesProps {
  data: AboutIndustriesData
}

const ICON_MAP: Record<string, LucideIcon> = {
  Car,
  Radio,
  CloudRain,
  Factory,
}

export function AboutIndustries({ data }: AboutIndustriesProps) {
  const shouldReduceMotion = useReducedMotion()

  const items = (data?.items || [])
    .filter((item) => item.isActive)
    .sort((a, b) => a.displayOrder - b.displayOrder)

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

        {/* Industries Grid or Empty State */}
        {items.length > 0 ? (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {items.map((item) => {
              const IconComponent = item.iconName ? ICON_MAP[item.iconName] || Layers : Layers

              return (
                <motion.div
                  key={item.id}
                  variants={itemVariants}
                  className="bg-[#F7F8FA] rounded-xl border border-slate-200 p-6 sm:p-7 hover:border-[#2F80ED]/40 hover:shadow-md transition-all flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    <div className="p-3.5 rounded-xl bg-[#0B1220] text-[#2F80ED] inline-block">
                      <IconComponent className="w-6 h-6" />
                    </div>
                    <h3 className="font-['Manrope'] font-bold text-xl text-[#0B1220]">
                      {item.name}
                    </h3>
                    <p className="text-slate-600 text-sm leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </motion.div>
              )
            })}
          </motion.div>
        ) : (
          <div className="bg-[#F7F8FA] rounded-xl border border-slate-200 p-8 text-center max-w-md mx-auto space-y-2">
            <Layers className="w-8 h-8 text-slate-400 mx-auto" />
            <h3 className="font-['Manrope'] font-bold text-base text-[#0B1220]">
              Industries Updating
            </h3>
            <p className="text-slate-500 text-xs">
              Industry applications are currently being configured in the system.
            </p>
          </div>
        )}

      </div>
    </section>
  )
}
