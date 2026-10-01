import { z } from 'zod'
import { Layout } from 'lucide-react'
import type { SectionDefinition } from '@/types/builder'

export const heroSchema = z.object({
  eyebrow: z.string().min(1, 'Eyebrow text is required'),
  heading: z.string().min(1, 'Heading is required'),
  description: z.string().min(1, 'Description is required'),
  imageSrc: z.string().min(1, 'Image URL is required'),
  imageAlt: z.string().default('APSON Hero Banner'),
  primaryCtaText: z.string().default('Explore Products'),
  primaryCtaHref: z.string().default('/products'),
  secondaryCtaText: z.string().default('Contact Us'),
  secondaryCtaHref: z.string().default('/contact'),
})

export type HeroContent = z.infer<typeof heroSchema>

function HeroEditor({ value, onChange }: { value: HeroContent; onChange: (val: HeroContent) => void }) {
  return (
    <div className="space-y-4 text-xs">
      <div>
        <label className="block text-slate-300 font-bold mb-1 uppercase tracking-wider">Eyebrow Badge</label>
        <input
          type="text"
          value={value.eyebrow}
          onChange={(e) => onChange({ ...value, eyebrow: e.target.value })}
          className="w-full p-2.5 bg-[#0B1220] border border-[#2A3649] rounded-lg text-white font-medium"
        />
      </div>

      <div>
        <label className="block text-slate-300 font-bold mb-1 uppercase tracking-wider">Main Heading</label>
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
          rows={3}
          value={value.description}
          onChange={(e) => onChange({ ...value, description: e.target.value })}
          className="w-full p-2.5 bg-[#0B1220] border border-[#2A3649] rounded-lg text-white font-medium resize-y"
        />
      </div>

      <div>
        <label className="block text-slate-300 font-bold mb-1 uppercase tracking-wider">Background Image URL</label>
        <input
          type="text"
          value={value.imageSrc}
          onChange={(e) => onChange({ ...value, imageSrc: e.target.value })}
          className="w-full p-2.5 bg-[#0B1220] border border-[#2A3649] rounded-lg text-white font-medium"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-slate-300 font-bold mb-1 uppercase tracking-wider">Primary Button Text</label>
          <input
            type="text"
            value={value.primaryCtaText}
            onChange={(e) => onChange({ ...value, primaryCtaText: e.target.value })}
            className="w-full p-2.5 bg-[#0B1220] border border-[#2A3649] rounded-lg text-white font-medium"
          />
        </div>
        <div>
          <label className="block text-slate-300 font-bold mb-1 uppercase tracking-wider">Primary Button Link</label>
          <input
            type="text"
            value={value.primaryCtaHref}
            onChange={(e) => onChange({ ...value, primaryCtaHref: e.target.value })}
            className="w-full p-2.5 bg-[#0B1220] border border-[#2A3649] rounded-lg text-white font-medium"
          />
        </div>
      </div>
    </div>
  )
}

function HeroRenderer({ content }: { content: HeroContent }) {
  return (
    <div className="relative bg-[#0B1220] text-white py-20 px-6 sm:px-12 rounded-3xl overflow-hidden my-6 border border-[#2A3649] shadow-2xl">
      <div
        className="absolute inset-0 opacity-20 bg-cover bg-center"
        style={{ backgroundImage: `url(${content.imageSrc || 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158'})` }}
      />
      <div className="relative z-10 max-w-3xl space-y-6">
        <span className="inline-block px-3 py-1 rounded-md bg-[#2F80ED]/20 border border-[#2F80ED]/40 text-[#2F80ED] text-xs font-mono font-bold uppercase tracking-widest">
          {content.eyebrow || 'APSON INDUSTRIES'}
        </span>
        <h1 className="font-['Manrope'] text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
          {content.heading || 'Engineering Precision Equipment'}
        </h1>
        <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl">
          {content.description || 'Reliable testing and manufacturing solutions engineered for extreme industrial standards.'}
        </p>
        <div className="flex flex-wrap gap-4 pt-2">
          {content.primaryCtaText && (
            <a
              href={content.primaryCtaHref || '/products'}
              className="px-6 py-3 bg-[#2F80ED] hover:bg-[#1d6ed8] text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-lg transition-all"
            >
              {content.primaryCtaText}
            </a>
          )}
          {content.secondaryCtaText && (
            <a
              href={content.secondaryCtaHref || '/contact'}
              className="px-6 py-3 bg-[#1A2433] hover:bg-[#2A3649] text-white text-xs font-bold uppercase tracking-wider rounded-xl border border-[#2A3649] transition-all"
            >
              {content.secondaryCtaText}
            </a>
          )}
        </div>
      </div>
    </div>
  )
}

export const heroSectionDefinition: SectionDefinition<HeroContent> = {
  type: 'hero',
  label: 'Hero Banner',
  category: 'Content',
  description: 'Full-width hero section with eyebrow, heading, paragraph, background media, and dual CTAs.',
  icon: Layout,
  defaultContent: {
    eyebrow: 'APSON INDUSTRIES',
    heading: 'Advanced Engineering & Industrial Testing Solutions',
    description: 'Delivering precision, durability, and world-class testing equipment for global industries.',
    imageSrc: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1200&q=80',
    imageAlt: 'Industrial Engineering Banner',
    primaryCtaText: 'View All Products',
    primaryCtaHref: '/products',
    secondaryCtaText: 'Contact Engineers',
    secondaryCtaHref: '/contact',
  },
  validationSchema: heroSchema,
  editor: HeroEditor,
  renderer: HeroRenderer,
}
