import { useState } from 'react'
import { X, Plus, Layers } from 'lucide-react'
import { registeredSectionList } from '@/sections/registry'
import type { SectionDefinition } from '@/types/builder'

interface AddSectionModalProps {
  isOpen: boolean
  onClose: () => void
  onSelectSection: (definition: SectionDefinition) => void
}

const CATEGORIES = ['All', 'Content', 'Company', 'Products', 'Conversion', 'Layout'] as const

export function AddSectionModal({ isOpen, onClose, onSelectSection }: AddSectionModalProps) {
  const [selectedCategory, setSelectedCategory] = useState<(typeof CATEGORIES)[number]>('All')

  if (!isOpen) return null

  const filteredSections =
    selectedCategory === 'All'
      ? registeredSectionList
      : registeredSectionList.filter((s) => s.category === selectedCategory)

  return (
    <div className="fixed inset-0 z-50 bg-[#0B1220]/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#1A2433] border border-[#2A3649] rounded-2xl w-full max-w-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-6 border-b border-[#2A3649] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-[#2F80ED]/20 text-[#2F80ED]">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-['Manrope'] font-extrabold text-white text-lg">
                Add New Page Section
              </h2>
              <p className="text-slate-400 text-xs">Select a pre-designed component section to insert into your page.</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-[#0B1220]">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Category Tabs Filter */}
        <div className="px-6 py-3 border-b border-[#2A3649] flex items-center gap-2 overflow-x-auto bg-[#0B1220]/40">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-[#2F80ED] text-white shadow-sm'
                  : 'text-slate-400 hover:bg-[#1A2433] hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grid List of Available Sections */}
        <div className="p-6 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 gap-4 flex-1">
          {filteredSections.map((def) => {
            const Icon = def.icon

            return (
              <div
                key={def.type}
                onClick={() => {
                  onSelectSection(def)
                  onClose()
                }}
                className="p-5 bg-[#0B1220] hover:bg-[#0B1220]/80 rounded-xl border border-[#2A3649] hover:border-[#2F80ED] cursor-pointer transition-all space-y-3 group flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="p-2.5 rounded-xl bg-[#1A2433] text-[#2F80ED] border border-[#2A3649] group-hover:bg-[#2F80ED] group-hover:text-white transition-colors">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest px-2 py-0.5 bg-[#1A2433] rounded border border-[#2A3649]">
                      {def.category}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-['Manrope'] font-bold text-white text-base group-hover:text-[#2F80ED] transition-colors">
                      {def.label}
                    </h3>
                    <p className="text-slate-400 text-xs line-clamp-2 leading-relaxed mt-1">
                      {def.description}
                    </p>
                  </div>
                </div>

                <div className="pt-2 flex items-center gap-1 text-xs font-bold text-[#2F80ED] group-hover:translate-x-1 transition-transform">
                  <Plus className="w-3.5 h-3.5" />
                  <span>Insert Section</span>
                </div>
              </div>
            )
          })}
        </div>

      </div>
    </div>
  )
}
