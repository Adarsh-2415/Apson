import { useState, useEffect, useRef } from 'react'
import { motion, useInView, useReducedMotion, animate, type Variants } from 'framer-motion'
import { Wrench, Users, Award, UserCheck, ShieldCheck } from 'lucide-react'
import type { ManpowerSectionData } from '@/types/cms'
import { DEFAULT_MANPOWER_DATA } from '@/config/cmsSeedData'

interface ManpowerStrengthProps {
  data?: ManpowerSectionData
}

interface CountUpProps {
  target: number
  duration?: number
}

// Performant Count-Up Component using Framer Motion animate()
function CountUp({ target, duration = 1.0 }: CountUpProps) {
  const [value, setValue] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-40px' })
  const shouldReduceMotion = useReducedMotion()

  useEffect(() => {
    if (!isInView) return

    if (shouldReduceMotion) {
      setValue(target)
      return
    }

    const controls = animate(0, target, {
      duration,
      ease: [0, 0, 0.2, 1],
      onUpdate: (latest) => setValue(Math.round(latest)),
    })

    return () => controls.stop()
  }, [isInView, target, duration, shouldReduceMotion])

  return <span ref={ref}>{value}</span>
}

export function ManpowerStrength({ data = DEFAULT_MANPOWER_DATA }: ManpowerStrengthProps) {
  const shouldReduceMotion = useReducedMotion()

  // Calculate Total Manpower automatically if not explicitly overridden
  const totalCalculated =
    data.totalManpower ??
    data.technical + data.nonTechnical + data.skilled + data.semiUnskilled

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

  const cardVariants: Variants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: [0, 0, 0.2, 1] },
    },
  }

  const categories = [
    {
      id: 'technical',
      label: 'Technical',
      value: data.technical,
      icon: Wrench,
      isPrimary: false,
    },
    {
      id: 'nonTechnical',
      label: 'Non-technical',
      value: data.nonTechnical,
      icon: Users,
      isPrimary: false,
    },
    {
      id: 'skilled',
      label: 'Skilled',
      value: data.skilled,
      icon: Award,
      isPrimary: false,
    },
    {
      id: 'semiUnskilled',
      label: 'Semi/Un-skilled',
      value: data.semiUnskilled,
      icon: UserCheck,
      isPrimary: false,
    },
    {
      id: 'totalManpower',
      label: 'Total Manpower',
      value: totalCalculated,
      icon: ShieldCheck,
      isPrimary: true, // Visual emphasis badge
    },
  ]

  return (
    <section className="bg-white text-[#111827] py-16 sm:py-20 border-b border-slate-200 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 lg:mb-14 space-y-3">
          {data.eyebrow && (
            <div className="inline-flex items-center gap-2 justify-center">
              <span className="w-2 h-2 rounded-full bg-[#2F80ED]" />
              <span className="font-['Manrope'] text-xs font-bold tracking-widest text-[#2F80ED] uppercase">
                {data.eyebrow}
              </span>
            </div>
          )}

          <h2 className="font-['Manrope'] text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#0B1220] tracking-tight">
            {data.heading}
          </h2>

          <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
            {data.description}
          </p>
        </div>

        {/* 5 Statistics Cards Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5 sm:gap-6"
        >
          {categories.map((cat) => {
            const IconComp = cat.icon

            if (cat.isPrimary) {
              // Total Manpower Highlighted Card
              return (
                <motion.div
                  key={cat.id}
                  variants={cardVariants}
                  className="col-span-2 md:col-span-1 bg-[#0B1220] text-white rounded-2xl border-2 border-[#2F80ED] p-6 shadow-xl relative overflow-hidden flex flex-col items-center justify-between text-center space-y-3 group"
                >
                  {/* Background Glow */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#2F80ED]/15 via-transparent to-transparent pointer-events-none" />

                  <div className="p-3 rounded-xl bg-[#2F80ED]/20 text-[#2F80ED] shrink-0">
                    <IconComp className="w-6 h-6" />
                  </div>

                  <div className="space-y-1">
                    <div className="font-['Manrope'] text-4xl sm:text-5xl font-black text-white tracking-tight">
                      <CountUp target={cat.value} duration={1.1} />
                    </div>
                    <div className="text-xs font-bold font-['Manrope'] uppercase tracking-wider text-[#2F80ED]">
                      {cat.label}
                    </div>
                  </div>

                  <div className="w-full pt-3 border-t border-[#2A3649] text-[10px] font-mono text-slate-400 uppercase tracking-widest">
                    Overall Workforce
                  </div>
                </motion.div>
              )
            }

            // Category Card (Technical, Non-technical, Skilled, Semi/Un-skilled)
            return (
              <motion.div
                key={cat.id}
                variants={cardVariants}
                className="bg-[#F7F8FA] rounded-2xl border border-slate-200 p-6 shadow-xs hover:border-[#2F80ED]/40 hover:shadow-md transition-all flex flex-col items-center justify-between text-center space-y-3"
              >
                <div className="p-3 rounded-xl bg-white border border-slate-200 text-[#0B1220] shrink-0">
                  <IconComp className="w-5 h-5 text-[#2F80ED]" />
                </div>

                <div className="space-y-1">
                  <div className="font-['Manrope'] text-3xl sm:text-4xl font-extrabold text-[#0B1220] tracking-tight">
                    <CountUp target={cat.value} duration={0.9} />
                  </div>
                  <div className="text-xs font-bold text-slate-600 font-['Manrope'] uppercase tracking-wider">
                    {cat.label}
                  </div>
                </div>

                <div className="w-full pt-2 border-t border-slate-200/60 text-[10px] font-mono text-slate-400 uppercase">
                  Category Staff
                </div>
              </motion.div>
            )
          })}
        </motion.div>

      </div>
    </section>
  )
}
