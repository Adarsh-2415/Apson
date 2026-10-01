import { z } from 'zod'
import { Users } from 'lucide-react'
import type { SectionDefinition } from '@/types/builder'

export const manpowerSchema = z.object({
  eyebrow: z.string().default('OUR WORKFORCE'),
  heading: z.string().min(1, 'Heading is required'),
  description: z.string().min(1, 'Description is required'),
  technical: z.number().default(3),
  nonTechnical: z.number().default(4),
  skilled: z.number().default(2),
  semiUnskilled: z.number().default(2),
})

export type ManpowerContent = z.infer<typeof manpowerSchema>

function ManpowerEditor({ value, onChange }: { value: ManpowerContent; onChange: (val: ManpowerContent) => void }) {
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
        <label className="block text-slate-300 font-bold mb-1 uppercase tracking-wider">Description</label>
        <textarea
          rows={2}
          value={value.description}
          onChange={(e) => onChange({ ...value, description: e.target.value })}
          className="w-full p-2.5 bg-[#0B1220] border border-[#2A3649] rounded-lg text-white font-medium resize-y"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-slate-300 font-bold mb-1 uppercase tracking-wider">Technical Personnel</label>
          <input
            type="number"
            value={value.technical}
            onChange={(e) => onChange({ ...value, technical: Number(e.target.value) || 0 })}
            className="w-full p-2.5 bg-[#0B1220] border border-[#2A3649] rounded-lg text-white font-medium"
          />
        </div>
        <div>
          <label className="block text-slate-300 font-bold mb-1 uppercase tracking-wider">Non-Technical Staff</label>
          <input
            type="number"
            value={value.nonTechnical}
            onChange={(e) => onChange({ ...value, nonTechnical: Number(e.target.value) || 0 })}
            className="w-full p-2.5 bg-[#0B1220] border border-[#2A3649] rounded-lg text-white font-medium"
          />
        </div>
        <div>
          <label className="block text-slate-300 font-bold mb-1 uppercase tracking-wider">Skilled Workers</label>
          <input
            type="number"
            value={value.skilled}
            onChange={(e) => onChange({ ...value, skilled: Number(e.target.value) || 0 })}
            className="w-full p-2.5 bg-[#0B1220] border border-[#2A3649] rounded-lg text-white font-medium"
          />
        </div>
        <div>
          <label className="block text-slate-300 font-bold mb-1 uppercase tracking-wider">Semi/Unskilled Staff</label>
          <input
            type="number"
            value={value.semiUnskilled}
            onChange={(e) => onChange({ ...value, semiUnskilled: Number(e.target.value) || 0 })}
            className="w-full p-2.5 bg-[#0B1220] border border-[#2A3649] rounded-lg text-white font-medium"
          />
        </div>
      </div>
    </div>
  )
}

function ManpowerRenderer({ content }: { content: ManpowerContent }) {
  const total = (content.technical || 0) + (content.nonTechnical || 0) + (content.skilled || 0) + (content.semiUnskilled || 0)

  const stats = [
    { label: 'Technical', val: content.technical },
    { label: 'Non-Technical', val: content.nonTechnical },
    { label: 'Skilled', val: content.skilled },
    { label: 'Semi/Un-skilled', val: content.semiUnskilled },
    { label: 'Total Workforce', val: total, isTotal: true },
  ]

  return (
    <div className="py-12 px-6 sm:px-10 bg-[#1A2433] rounded-3xl border border-[#2A3649] my-6 space-y-6 shadow-xl">
      <div className="max-w-2xl space-y-1">
        <span className="text-[11px] font-mono text-[#2F80ED] font-bold uppercase tracking-widest block">
          {content.eyebrow}
        </span>
        <h2 className="font-['Manrope'] text-2xl sm:text-3xl font-extrabold text-white">
          {content.heading}
        </h2>
        <p className="text-slate-300 text-sm">{content.description}</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {stats.map((s) => (
          <div
            key={s.label}
            className={`p-5 rounded-2xl border text-center space-y-1 ${
              s.isTotal
                ? 'bg-[#2F80ED]/15 border-[#2F80ED]/40 text-[#2F80ED]'
                : 'bg-[#0B1220] border-[#2A3649] text-white'
            }`}
          >
            <div className="font-['Manrope'] text-3xl font-extrabold">{s.val}</div>
            <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider font-bold">
              {s.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export const manpowerSectionDefinition: SectionDefinition<ManpowerContent> = {
  type: 'manpower',
  label: 'Manpower Strength',
  category: 'Company',
  description: 'Workforce structure statistics displaying technical, skilled, and operational manpower numbers.',
  icon: Users,
  defaultContent: {
    eyebrow: 'OUR WORKFORCE',
    heading: 'Our Workforce',
    description: 'A dedicated team working together to deliver reliable industrial solutions.',
    technical: 3,
    nonTechnical: 4,
    skilled: 2,
    semiUnskilled: 2,
  },
  validationSchema: manpowerSchema,
  editor: ManpowerEditor,
  renderer: ManpowerRenderer,
}
