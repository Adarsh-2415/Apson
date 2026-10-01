import { z } from 'zod'
import { ArrowUpDown } from 'lucide-react'
import type { SectionDefinition } from '@/types/builder'

export const spacerSchema = z.object({
  height: z.enum(['sm', 'md', 'lg', 'xl']).default('md'),
})

export type SpacerContent = z.infer<typeof spacerSchema>

function SpacerEditor({ value, onChange }: { value: SpacerContent; onChange: (val: SpacerContent) => void }) {
  return (
    <div className="space-y-4 text-xs">
      <div>
        <label className="block text-slate-300 font-bold mb-1 uppercase tracking-wider">Spacer Height</label>
        <select
          value={value.height}
          onChange={(e) => onChange({ ...value, height: e.target.value as any })}
          className="w-full p-2.5 bg-[#0B1220] border border-[#2A3649] rounded-lg text-white font-medium"
        >
          <option value="sm">Small (24px)</option>
          <option value="md">Medium (48px)</option>
          <option value="lg">Large (80px)</option>
          <option value="xl">Extra Large (120px)</option>
        </select>
      </div>
    </div>
  )
}

function SpacerRenderer({ content }: { content: SpacerContent }) {
  const heights = {
    sm: 'h-6',
    md: 'h-12',
    lg: 'h-20',
    xl: 'h-32',
  }

  return <div className={`w-full ${heights[content.height || 'md']}`} />
}

export const spacerSectionDefinition: SectionDefinition<SpacerContent> = {
  type: 'spacer',
  label: 'Vertical Spacer',
  category: 'Layout',
  description: 'Adjustable vertical spacing block to separate sections.',
  icon: ArrowUpDown,
  defaultContent: {
    height: 'md',
  },
  validationSchema: spacerSchema,
  editor: SpacerEditor,
  renderer: SpacerRenderer,
}
