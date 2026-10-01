import { useState } from 'react'
import { X, Monitor, Tablet, Smartphone, Eye } from 'lucide-react'
import type { PageSection } from '@/types/builder'
import { SectionRenderer } from '@/components/sections/SectionRenderer'

interface PagePreviewModalProps {
  isOpen: boolean
  pageTitle: string
  sections: PageSection[]
  onClose: () => void
}

type ViewportMode = 'desktop' | 'tablet' | 'mobile'

export function PagePreviewModal({ isOpen, pageTitle, sections, onClose }: PagePreviewModalProps) {
  const [viewport, setViewport] = useState<ViewportMode>('desktop')

  if (!isOpen) return null

  const viewportWidths: Record<ViewportMode, string> = {
    desktop: 'max-w-6xl w-full',
    tablet: 'max-w-2xl w-full',
    mobile: 'max-w-sm w-full',
  }

  return (
    <div className="fixed inset-0 z-50 bg-[#0B1220]/90 backdrop-blur-md flex flex-col">
      {/* Top Controls Bar */}
      <div className="bg-[#1A2433] border-b border-[#2A3649] px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400">
            <Eye className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-['Manrope'] font-bold text-white text-base">
              Live Preview: {pageTitle}
            </h2>
            <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest">
              IN-MEMORY DRAFT RENDER
            </span>
          </div>
        </div>

        {/* Viewport Switcher */}
        <div className="flex items-center gap-1 bg-[#0B1220] p-1 rounded-xl border border-[#2A3649]">
          <button
            onClick={() => setViewport('desktop')}
            className={`p-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              viewport === 'desktop' ? 'bg-[#2F80ED] text-white' : 'text-slate-400 hover:text-white'
            }`}
            title="Desktop 1440px"
          >
            <Monitor className="w-4 h-4" />
            <span className="hidden sm:inline">Desktop</span>
          </button>
          <button
            onClick={() => setViewport('tablet')}
            className={`p-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              viewport === 'tablet' ? 'bg-[#2F80ED] text-white' : 'text-slate-400 hover:text-white'
            }`}
            title="Tablet 768px"
          >
            <Tablet className="w-4 h-4" />
            <span className="hidden sm:inline">Tablet</span>
          </button>
          <button
            onClick={() => setViewport('mobile')}
            className={`p-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              viewport === 'mobile' ? 'bg-[#2F80ED] text-white' : 'text-slate-400 hover:text-white'
            }`}
            title="Mobile 375px"
          >
            <Smartphone className="w-4 h-4" />
            <span className="hidden sm:inline">Mobile</span>
          </button>
        </div>

        <button
          onClick={onClose}
          className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-[#0B1220]"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Main Preview Container */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-8 flex justify-center bg-[#0B1220]">
        <div className={`${viewportWidths[viewport]} transition-all duration-300 space-y-4`}>
          {sections.length === 0 ? (
            <div className="py-20 text-center text-slate-500 text-sm font-mono border border-dashed border-[#2A3649] rounded-3xl">
              No sections added to page canvas yet.
            </div>
          ) : (
            sections.map((sec) => <SectionRenderer key={sec.id} section={sec} isPreview={true} />)
          )}
        </div>
      </div>
    </div>
  )
}
