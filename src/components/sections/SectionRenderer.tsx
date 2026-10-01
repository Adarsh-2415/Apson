import React from 'react'
import type { PageSection } from '@/types/builder'
import { getSectionDefinition } from '@/sections/registry'
import { AlertCircle } from 'lucide-react'

interface SectionRendererProps {
  section: PageSection
  isPreview?: boolean
}

class SectionErrorBoundary extends React.Component<
  { children: React.ReactNode; sectionType: string },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode; sectionType: string }) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-4 bg-rose-950/40 border border-rose-600/40 rounded-xl my-4 text-xs text-rose-300 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
          <span>Unable to render section &apos;{this.props.sectionType}&apos;. Check configuration.</span>
        </div>
      )
    }
    return this.props.children
  }
}

export function SectionRenderer({ section, isPreview = false }: SectionRendererProps) {
  // If hidden and not in preview, do not render on public site
  if (!section.is_visible && !isPreview) {
    return null
  }

  const definition = getSectionDefinition(section.section_type)

  if (!definition) {
    return (
      <div className="p-4 bg-[#1A2433] border border-amber-500/30 rounded-xl my-4 text-xs text-amber-300 flex items-center gap-2">
        <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
        <span>Unrecognized section type: &apos;{section.section_type}&apos;</span>
      </div>
    )
  }

  const RendererComponent = definition.renderer

  return (
    <SectionErrorBoundary sectionType={section.section_type}>
      <div className={`relative ${!section.is_visible && isPreview ? 'opacity-60 grayscale-[30%]' : ''}`}>
        {!section.is_visible && isPreview && (
          <div className="absolute top-2 right-2 z-20 px-2.5 py-1 bg-amber-500/80 text-black font-mono text-[10px] font-bold uppercase rounded shadow">
            Hidden Section (Preview Only)
          </div>
        )}
        <RendererComponent content={section.content} isPreview={isPreview} />
      </div>
    </SectionErrorBoundary>
  )
}
