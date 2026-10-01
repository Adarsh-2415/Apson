import { z } from 'zod'
import { Megaphone } from 'lucide-react'
import type { SectionDefinition } from '@/types/builder'

export const ctaSchema = z.object({
  eyebrow: z.string().default('GET IN TOUCH'),
  heading: z.string().min(1, 'Heading is required'),
  description: z.string().min(1, 'Description is required'),
  primaryCtaText: z.string().default('Contact Us Now'),
  primaryCtaHref: z.string().default('/contact'),
  secondaryCtaText: z.string().default('View Products'),
  secondaryCtaHref: z.string().default('/products'),
})

export type CTAContent = z.infer<typeof ctaSchema>

function CTAEditor({ value, onChange }: { value: CTAContent; onChange: (val: CTAContent) => void }) {
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

function CTARenderer({ content }: { content: CTAContent }) {
  return (
    <div className="py-14 px-6 sm:px-12 bg-gradient-to-r from-[#1A2433] via-[#0B1220] to-[#1A2433] rounded-3xl border border-[#2F80ED]/30 my-6 text-center space-y-6 shadow-2xl relative overflow-hidden">
      <div className="max-w-2xl mx-auto space-y-3 relative z-10">
        <span className="text-[11px] font-mono text-[#2F80ED] font-bold uppercase tracking-widest block">
          {content.eyebrow}
        </span>
        <h2 className="font-['Manrope'] text-2xl sm:text-4xl font-extrabold text-white">
          {content.heading}
        </h2>
        <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
          {content.description}
        </p>
      </div>

      <div className="flex flex-wrap justify-center gap-4 relative z-10 pt-2">
        {content.primaryCtaText && (
          <a
            href={content.primaryCtaHref}
            className="px-6 py-3 bg-[#2F80ED] hover:bg-[#1d6ed8] text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-lg transition-all"
          >
            {content.primaryCtaText}
          </a>
        )}
        {content.secondaryCtaText && (
          <a
            href={content.secondaryCtaHref}
            className="px-6 py-3 bg-[#0B1220] hover:bg-[#1A2433] text-white text-xs font-bold uppercase tracking-wider rounded-xl border border-[#2A3649] transition-all"
          >
            {content.secondaryCtaText}
          </a>
        )}
      </div>
    </div>
  )
}

export const ctaSectionDefinition: SectionDefinition<CTAContent> = {
  type: 'contact_cta',
  label: 'Contact CTA',
  category: 'Conversion',
  description: 'High-converting industrial inquiry banner with primary and secondary call-to-action buttons.',
  icon: Megaphone,
  defaultContent: {
    eyebrow: 'GET IN TOUCH',
    heading: 'Need Custom Testing Equipment for Your Facility?',
    description: 'Speak directly with our senior engineering team to discuss custom specifications and project quotes.',
    primaryCtaText: 'Request Technical Quote',
    primaryCtaHref: '/contact',
    secondaryCtaText: 'Explore Catalog',
    secondaryCtaHref: '/products',
  },
  validationSchema: ctaSchema,
  editor: CTAEditor,
  renderer: CTARenderer,
}
