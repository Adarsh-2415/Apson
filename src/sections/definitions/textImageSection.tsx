import { z } from 'zod'
import { Image as ImageIcon } from 'lucide-react'
import type { SectionDefinition } from '@/types/builder'

export const textImageSchema = z.object({
  eyebrow: z.string().optional(),
  heading: z.string().min(1, 'Heading is required'),
  description: z.string().min(1, 'Description is required'),
  imageSrc: z.string().min(1, 'Image URL is required'),
  imageAlt: z.string().default('Section Image'),
  imagePosition: z.enum(['left', 'right']).default('right'),
  ctaText: z.string().optional(),
  ctaHref: z.string().optional(),
})

export type TextImageContent = z.infer<typeof textImageSchema>

function TextImageEditor({ value, onChange }: { value: TextImageContent; onChange: (val: TextImageContent) => void }) {
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
          rows={4}
          value={value.description}
          onChange={(e) => onChange({ ...value, description: e.target.value })}
          className="w-full p-2.5 bg-[#0B1220] border border-[#2A3649] rounded-lg text-white font-medium resize-y"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-slate-300 font-bold mb-1 uppercase tracking-wider">Image URL</label>
          <input
            type="text"
            value={value.imageSrc}
            onChange={(e) => onChange({ ...value, imageSrc: e.target.value })}
            className="w-full p-2.5 bg-[#0B1220] border border-[#2A3649] rounded-lg text-white font-medium"
          />
        </div>
        <div>
          <label className="block text-slate-300 font-bold mb-1 uppercase tracking-wider">Image Alignment</label>
          <select
            value={value.imagePosition}
            onChange={(e) => onChange({ ...value, imagePosition: e.target.value as 'left' | 'right' })}
            className="w-full p-2.5 bg-[#0B1220] border border-[#2A3649] rounded-lg text-white font-medium"
          >
            <option value="right">Right Side</option>
            <option value="left">Left Side</option>
          </select>
        </div>
      </div>
    </div>
  )
}

function TextImageRenderer({ content }: { content: TextImageContent }) {
  const isLeft = content.imagePosition === 'left'

  return (
    <div className="py-12 px-6 sm:px-10 bg-[#1A2433] rounded-3xl border border-[#2A3649] my-6 shadow-xl">
      <div className={`grid grid-cols-1 lg:grid-cols-12 gap-8 items-center ${isLeft ? 'lg:flex-row-reverse' : ''}`}>
        
        {/* Text Content */}
        <div className={`space-y-4 ${isLeft ? 'lg:col-span-7 lg:order-2' : 'lg:col-span-7'}`}>
          {content.eyebrow && (
            <span className="text-[11px] font-mono text-[#2F80ED] font-bold uppercase tracking-widest block">
              {content.eyebrow}
            </span>
          )}
          <h2 className="font-['Manrope'] text-2xl sm:text-3xl font-extrabold text-white">
            {content.heading}
          </h2>
          <p className="text-slate-300 text-sm leading-relaxed">
            {content.description}
          </p>
          {content.ctaText && (
            <div className="pt-2">
              <a
                href={content.ctaHref || '#'}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#2F80ED] text-white text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-[#1d6ed8] transition-all"
              >
                {content.ctaText}
              </a>
            </div>
          )}
        </div>

        {/* Media Box */}
        <div className={`${isLeft ? 'lg:col-span-5 lg:order-1' : 'lg:col-span-5'}`}>
          <div className="rounded-2xl overflow-hidden border border-[#2A3649] shadow-lg aspect-video lg:aspect-square bg-[#0B1220]">
            <img
              src={content.imageSrc || 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158'}
              alt={content.imageAlt}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

      </div>
    </div>
  )
}

export const textImageSectionDefinition: SectionDefinition<TextImageContent> = {
  type: 'text_image',
  label: 'Text + Image',
  category: 'Content',
  description: 'Side-by-side content layout with text block and featured media image.',
  icon: ImageIcon,
  defaultContent: {
    eyebrow: 'MANUFACTURING QUALITY',
    heading: 'High Precision Testing & Calibration Facilities',
    description:
      'Our facility features modern calibration machinery ensuring accuracy in stress testing, thermal chamber operations, and structural durability assessments.',
    imageSrc: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=800&q=80',
    imageAlt: 'Calibration machinery',
    imagePosition: 'right',
    ctaText: 'Learn More',
    ctaHref: '/about',
  },
  validationSchema: textImageSchema,
  editor: TextImageEditor,
  renderer: TextImageRenderer,
}
