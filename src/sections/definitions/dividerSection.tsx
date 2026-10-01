import { z } from 'zod'
import { Minus } from 'lucide-react'
import type { SectionDefinition } from '@/types/builder'

export const dividerSchema = z.object({
  style: z.enum(['line', 'accent_hairline', 'subtle']).default('line'),
})

export type DividerContent = z.infer<typeof dividerSchema>

function DividerEditor({ value, onChange }: { value: DividerContent; onChange: (val: DividerContent) => void }) {
  return (
    <div className="space-y-4 text-xs">
      <div>
        <label className="block text-slate-300 font-bold mb-1 uppercase tracking-wider">Divider Style</label>
        <select
          value={value.style}
          onChange={(e) => onChange({ ...value, style: e.target.value as any })}
          className="w-full p-2.5 bg-[#0B1220] border border-[#2A3649] rounded-lg text-white font-medium"
        >
          <option value="line">Standard Dark Border</option>
          <option value="accent_hairline">APSON Blue Hairline Accent</option>
          <option value="subtle">Subtle Glow Gradient</option>
        </select>
      </div>
    </div>
  )
}

function DividerRenderer({ content }: { content: DividerContent }) {
  if (content.style === 'accent_hairline') {
    return <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-[#2F80ED] to-transparent my-8 opacity-60" />
  }

  if (content.style === 'subtle') {
    return <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-slate-700 to-transparent my-8" />
  }

  return <div className="h-[1px] w-full bg-[#2A3649] my-8" />
}

export const dividerSectionDefinition: SectionDefinition<DividerContent> = {
  type: 'divider',
  label: 'Divider Line',
  category: 'Layout',
  description: 'Visual section boundary line with customizable styling.',
  icon: Minus,
  defaultContent: {
    style: 'accent_hairline',
  },
  validationSchema: dividerSchema,
  editor: DividerEditor,
  renderer: DividerRenderer,
}
