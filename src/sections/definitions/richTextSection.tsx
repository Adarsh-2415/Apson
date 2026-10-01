import { z } from 'zod'
import { AlignLeft } from 'lucide-react'
import type { SectionDefinition } from '@/types/builder'

export const richTextSchema = z.object({
  eyebrow: z.string().optional(),
  heading: z.string().min(1, 'Heading is required'),
  content: z.string().min(1, 'Content body is required'),
})

export type RichTextContent = z.infer<typeof richTextSchema>

function RichTextEditor({ value, onChange }: { value: RichTextContent; onChange: (val: RichTextContent) => void }) {
  return (
    <div className="space-y-4 text-xs">
      <div>
        <label className="block text-slate-300 font-bold mb-1 uppercase tracking-wider">Eyebrow (Optional)</label>
        <input
          type="text"
          value={value.eyebrow || ''}
          onChange={(e) => onChange({ ...value, eyebrow: e.target.value })}
          className="w-full p-2.5 bg-[#0B1220] border border-[#2A3649] rounded-lg text-white font-medium"
        />
      </div>

      <div>
        <label className="block text-slate-300 font-bold mb-1 uppercase tracking-wider">Section Heading</label>
        <input
          type="text"
          value={value.heading}
          onChange={(e) => onChange({ ...value, heading: e.target.value })}
          className="w-full p-2.5 bg-[#0B1220] border border-[#2A3649] rounded-lg text-white font-medium"
        />
      </div>

      <div>
        <label className="block text-slate-300 font-bold mb-1 uppercase tracking-wider">Body Content</label>
        <textarea
          rows={6}
          value={value.content}
          onChange={(e) => onChange({ ...value, content: e.target.value })}
          className="w-full p-2.5 bg-[#0B1220] border border-[#2A3649] rounded-lg text-white font-medium resize-y font-mono text-xs leading-relaxed"
        />
      </div>
    </div>
  )
}

function RichTextRenderer({ content }: { content: RichTextContent }) {
  const paragraphs = (content.content || '').split('\n').filter(Boolean)

  return (
    <div className="py-12 px-6 sm:px-10 bg-[#1A2433] rounded-3xl border border-[#2A3649] my-6 space-y-4 shadow-xl">
      {content.eyebrow && (
        <span className="text-[11px] font-mono text-[#2F80ED] font-bold uppercase tracking-widest block">
          {content.eyebrow}
        </span>
      )}
      <h2 className="font-['Manrope'] text-2xl sm:text-3xl font-extrabold text-white">
        {content.heading}
      </h2>
      <div className="space-y-4 text-slate-300 text-sm leading-relaxed max-w-4xl">
        {paragraphs.map((p, idx) => (
          <p key={idx}>{p}</p>
        ))}
      </div>
    </div>
  )
}

export const richTextSectionDefinition: SectionDefinition<RichTextContent> = {
  type: 'rich_text',
  label: 'Rich Text Block',
  category: 'Content',
  description: 'Clean formatted text section with optional eyebrow badge and multiple body paragraphs.',
  icon: AlignLeft,
  defaultContent: {
    eyebrow: 'OVERVIEW',
    heading: 'Engineering Excellence & Quality Policy',
    content:
      'APSON Industries is committed to providing high-reliability industrial testing equipment.\nOur manufacturing facility adheres to international ISO standards, ensuring total accuracy and long service life across demanding operational environments.',
  },
  validationSchema: richTextSchema,
  editor: RichTextEditor,
  renderer: RichTextRenderer,
}
