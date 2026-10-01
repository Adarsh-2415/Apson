import { z } from 'zod'
import { ShieldCheck } from 'lucide-react'
import type { SectionDefinition } from '@/types/builder'

export const whyApsonSchema = z.object({
  eyebrow: z.string().default('WHY CHOOSE US'),
  heading: z.string().min(1, 'Heading is required'),
  introduction: z.string().min(1, 'Introduction is required'),
})

export type WhyApsonContent = z.infer<typeof whyApsonSchema>

function WhyApsonEditor({ value, onChange }: { value: WhyApsonContent; onChange: (val: WhyApsonContent) => void }) {
  return (
    <div className="space-y-4 text-xs">
      <div>
        <label className="block text-slate-300 font-bold mb-1 uppercase tracking-wider">Eyebrow</label>
        <input
          type="text"
          value={value.eyebrow}
          onChange={(e) => onChange({ ...value, eyebrow: e.target.value })}
          className="w-full p-2.5 bg-[#0B1220] border border-[#2A3649] rounded-lg text-white font-medium"
        />
      </div>

      <div>
        <label className="block text-slate-300 font-bold mb-1 uppercase tracking-wider">Heading</label>
        <input
          type="text"
          value={value.heading}
          onChange={(e) => onChange({ ...value, heading: e.target.value })}
          className="w-full p-2.5 bg-[#0B1220] border border-[#2A3649] rounded-lg text-white font-medium"
        />
      </div>

      <div>
        <label className="block text-slate-300 font-bold mb-1 uppercase tracking-wider">Introduction Text</label>
        <textarea
          rows={3}
          value={value.introduction}
          onChange={(e) => onChange({ ...value, introduction: e.target.value })}
          className="w-full p-2.5 bg-[#0B1220] border border-[#2A3649] rounded-lg text-white font-medium resize-y"
        />
      </div>
    </div>
  )
}

function WhyApsonRenderer({ content }: { content: WhyApsonContent }) {
  const features = [
    { number: '01', title: 'Proven Industrial Reliability', description: 'Engineered for continuous heavy-duty industrial testing environments.' },
    { number: '02', title: 'Custom Engineering Options', description: 'Tailored test parameters and custom fixtures matching specific client requirements.' },
    { number: '03', title: 'Comprehensive Post-Sale Support', description: 'Dedicated technical team for installation, calibration, and routine servicing.' },
  ]

  return (
    <div className="py-12 px-6 sm:px-10 bg-[#1A2433] rounded-3xl border border-[#2A3649] my-6 space-y-8 shadow-xl">
      <div className="max-w-3xl space-y-2">
        <span className="text-[11px] font-mono text-[#2F80ED] font-bold uppercase tracking-widest block">
          {content.eyebrow}
        </span>
        <h2 className="font-['Manrope'] text-2xl sm:text-3xl font-extrabold text-white">
          {content.heading}
        </h2>
        <p className="text-slate-300 text-sm leading-relaxed">
          {content.introduction}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {features.map((item) => (
          <div key={item.number} className="p-6 bg-[#0B1220] rounded-2xl border border-[#2A3649] space-y-3">
            <span className="font-mono text-2xl font-extrabold text-[#2F80ED]">{item.number}</span>
            <h3 className="font-['Manrope'] font-bold text-white text-base">{item.title}</h3>
            <p className="text-slate-400 text-xs leading-relaxed">{item.description}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export const whyApsonSectionDefinition: SectionDefinition<WhyApsonContent> = {
  type: 'why_apson',
  label: 'Why APSON',
  category: 'Company',
  description: 'Industrial capability showcase highlighting APSON engineering advantages.',
  icon: ShieldCheck,
  defaultContent: {
    eyebrow: 'WHY APSON',
    heading: 'Engineered for Performance & Uncompromised Quality',
    introduction:
      'APSON Industries provides dependable industrial equipment designed with high-grade components and certified precision standards.',
  },
  validationSchema: whyApsonSchema,
  editor: WhyApsonEditor,
  renderer: WhyApsonRenderer,
}
