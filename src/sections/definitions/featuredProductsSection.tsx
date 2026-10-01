import { z } from 'zod'
import { Boxes } from 'lucide-react'
import type { SectionDefinition } from '@/types/builder'
import type { Product } from '@/types/cms'
import { INITIAL_PRODUCTS_LIST } from '@/config/cmsSeedData'

export const featuredProductsSchema = z.object({
  eyebrow: z.string().default('FEATURED CATALOGUE'),
  heading: z.string().min(1, 'Heading is required'),
  description: z.string().min(1, 'Description is required'),
  limit: z.number().min(1).max(12).default(6),
})

export type FeaturedProductsContent = z.infer<typeof featuredProductsSchema>

function FeaturedProductsEditor({
  value,
  onChange,
}: {
  value: FeaturedProductsContent
  onChange: (val: FeaturedProductsContent) => void
}) {
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

      <div>
        <label className="block text-slate-300 font-bold mb-1 uppercase tracking-wider">Maximum Products to Display</label>
        <input
          type="number"
          min={1}
          max={12}
          value={value.limit}
          onChange={(e) => onChange({ ...value, limit: Number(e.target.value) || 6 })}
          className="w-full p-2.5 bg-[#0B1220] border border-[#2A3649] rounded-lg text-white font-medium"
        />
      </div>
    </div>
  )
}

function FeaturedProductsRenderer({ content }: { content: FeaturedProductsContent }) {
  const displayItems = INITIAL_PRODUCTS_LIST.slice(0, content.limit || 6)

  return (
    <div className="py-12 px-6 sm:px-10 bg-[#1A2433] rounded-3xl border border-[#2A3649] my-6 space-y-8 shadow-xl">
      <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 border-b border-[#2A3649] pb-6">
        <div className="space-y-1">
          <span className="text-[11px] font-mono text-[#2F80ED] font-bold uppercase tracking-widest block">
            {content.eyebrow}
          </span>
          <h2 className="font-['Manrope'] text-2xl sm:text-3xl font-extrabold text-white">
            {content.heading}
          </h2>
          <p className="text-slate-300 text-sm">{content.description}</p>
        </div>
        <a
          href="/products"
          className="px-5 py-2.5 bg-[#2F80ED] text-white text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-[#1d6ed8] transition-all shrink-0"
        >
          View All Products
        </a>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayItems.map((p: Product) => (
          <div key={p.id} className="bg-[#0B1220] rounded-2xl border border-[#2A3649] overflow-hidden flex flex-col justify-between group hover:border-[#2F80ED]/50 transition-all">
            <div className="h-44 bg-slate-900 overflow-hidden relative">
              <img
                src={p.imageSrc}
                alt={p.imageAlt}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <span className="absolute top-3 right-3 px-2.5 py-1 bg-[#1A2433]/80 backdrop-blur-md border border-[#2A3649] text-[10px] font-mono text-slate-300 rounded-md font-bold uppercase">
                {p.category}
              </span>
            </div>

            <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
              <div className="space-y-1.5">
                <h3 className="font-['Manrope'] font-bold text-white text-base group-hover:text-[#2F80ED] transition-colors">
                  {p.name}
                </h3>
                <p className="text-slate-400 text-xs line-clamp-2 leading-relaxed">
                  {p.shortDescription}
                </p>
              </div>

              <a
                href="/products"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#2F80ED] hover:underline pt-2"
              >
                <span>Product Specifications</span>
                <span>→</span>
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export const featuredProductsSectionDefinition: SectionDefinition<FeaturedProductsContent> = {
  type: 'featured_products',
  label: 'Featured Products',
  category: 'Products',
  description: 'Displays a grid of featured industrial equipment queried live from the product catalog.',
  icon: Boxes,
  defaultContent: {
    eyebrow: 'FEATURED CATALOGUE',
    heading: 'High-Precision Testing Equipment',
    description: 'Explore our certified line of testing machines designed for demanding industrial operations.',
    limit: 6,
  },
  validationSchema: featuredProductsSchema,
  editor: FeaturedProductsEditor,
  renderer: FeaturedProductsRenderer,
}
