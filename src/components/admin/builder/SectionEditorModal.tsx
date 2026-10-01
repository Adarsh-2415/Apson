import { useState, useEffect } from 'react'
import { X, Settings, Check, AlertCircle } from 'lucide-react'
import { getSectionDefinition } from '@/sections/registry'
import type { PageSection } from '@/types/builder'

interface SectionEditorModalProps {
  isOpen: boolean
  section: PageSection | null
  onClose: () => void
  onSave: (updatedContent: Record<string, any>) => void
}

export function SectionEditorModal({ isOpen, section, onClose, onSave }: SectionEditorModalProps) {
  const definition = section ? getSectionDefinition(section.section_type) : undefined
  const [contentState, setContentState] = useState<Record<string, any>>({})
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (section && definition) {
      setContentState(section.content || definition.defaultContent || {})
      setError(null)
    }
  }, [section, definition])

  if (!isOpen || !section || !definition) return null

  const EditorForm = definition.editor

  const handleSave = () => {
    setError(null)
    const result = definition.validationSchema.safeParse(contentState)

    if (!result.success) {
      const issue = result.error.issues[0]
      setError(issue ? `${issue.path.join('.')}: ${issue.message}` : 'Invalid section content data.')
      return
    }

    onSave(result.data)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 bg-[#0B1220]/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#1A2433] border border-[#2A3649] rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-6 border-b border-[#2A3649] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-[#2F80ED]/20 text-[#2F80ED]">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-['Manrope'] font-extrabold text-white text-lg">
                Edit Section: {definition.label}
              </h2>
              <p className="text-slate-400 text-xs">Configure text, media, and display settings for this section.</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-[#0B1220]">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Validation Error Banner */}
        {error && (
          <div className="mx-6 mt-4 p-3 bg-rose-950/80 border border-rose-600/50 rounded-xl text-xs text-rose-200 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Dynamic Type Editor Form */}
        <div className="p-6 overflow-y-auto flex-1">
          <EditorForm value={contentState} onChange={(val) => setContentState(val)} />
        </div>

        {/* Actions Footer */}
        <div className="p-4 bg-[#0B1220]/50 border-t border-[#2A3649] flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2.5 bg-[#0B1220] text-slate-300 hover:text-white rounded-xl border border-[#2A3649] text-xs font-bold"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-5 py-2.5 bg-[#2F80ED] hover:bg-[#1d6ed8] text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-md flex items-center gap-2"
          >
            <Check className="w-4 h-4" />
            <span>Apply Changes</span>
          </button>
        </div>

      </div>
    </div>
  )
}
