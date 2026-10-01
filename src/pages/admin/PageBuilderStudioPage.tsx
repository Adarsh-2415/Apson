import { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  Plus,
  Save,
  Eye,
  Globe,
  Loader2,
  ArrowUp,
  ArrowDown,
  Pencil,
  Copy,
  Trash2,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  FileText,
  Settings,
} from 'lucide-react'
import type { PageRecord, PageSection, SectionDefinition } from '@/types/builder'
import { cmsService } from '@/services/cmsService'
import { getSectionDefinition } from '@/sections/registry'
import { PageMetaModal } from '@/components/admin/builder/PageMetaModal'
import { AddSectionModal } from '@/components/admin/builder/AddSectionModal'
import { SectionEditorModal } from '@/components/admin/builder/SectionEditorModal'
import { PagePreviewModal } from '@/components/admin/builder/PagePreviewModal'

export function PageBuilderStudioPage() {
  const { pageId } = useParams<{ pageId: string }>()
  const navigate = useNavigate()

  const [page, setPage] = useState<PageRecord | null>(null)
  const [sections, setSections] = useState<PageSection[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isDirty, setIsDirty] = useState(false)
  const [toastMessage, setToastMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  // Modals
  const [isMetaModalOpen, setIsMetaModalOpen] = useState(false)
  const [isAddSectionOpen, setIsAddSectionOpen] = useState(false)
  const [editingSection, setEditingSection] = useState<PageSection | null>(null)
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)

  // Auto clear toast
  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => setToastMessage(null), 3500)
      return () => clearTimeout(timer)
    }
  }, [toastMessage])

  // Load Page & Sections
  const loadPageData = useCallback(async () => {
    if (!pageId) return
    setIsLoading(true)

    const [pageRes, secRes] = await Promise.all([
      cmsService.getPageById(pageId),
      cmsService.getPageSections(pageId),
    ])

    if (pageRes.data) {
      setPage(pageRes.data)
      setSections(secRes.data || [])
      setIsDirty(false)
    } else {
      setToastMessage({ type: 'error', text: 'Unable to load page records.' })
    }
    setIsLoading(false)
  }, [pageId])

  useEffect(() => {
    loadPageData()
  }, [loadPageData])

  // Mark modified
  const updateSectionsState = (newSections: PageSection[]) => {
    // reindex display orders sequentially
    const indexed = newSections.map((sec, idx) => ({ ...sec, display_order: idx + 1 }))
    setSections(indexed)
    setIsDirty(true)
  }

  // Action Handlers
  const handleSaveDraft = async () => {
    if (!pageId) return
    setIsSaving(true)

    const res = await cmsService.savePageSections(pageId, sections)
    if (res.error) {
      setToastMessage({ type: 'error', text: 'Failed to save section draft.' })
    } else {
      setIsDirty(false)
      setToastMessage({ type: 'success', text: 'Page draft saved successfully!' })
    }
    setIsSaving(false)
  }

  const handlePublishPage = async () => {
    if (!pageId || !page) return

    if (sections.length === 0) {
      setToastMessage({ type: 'error', text: 'Cannot publish a page with 0 sections.' })
      return
    }

    setIsSaving(true)
    const saveSecRes = await cmsService.savePageSections(pageId, sections)
    if (saveSecRes.error) {
      setToastMessage({ type: 'error', text: 'Failed to save section changes before publishing.' })
      setIsSaving(false)
      return
    }

    const pubRes = await cmsService.updatePage(pageId, { status: 'published' })
    if (pubRes.data) {
      setPage(pubRes.data)
      setIsDirty(false)
      setToastMessage({ type: 'success', text: `Page '${pubRes.data.title}' is now Published live!` })
    } else {
      setToastMessage({ type: 'error', text: 'Failed to update page publish status.' })
    }
    setIsSaving(false)
  }

  const handleMoveUp = (index: number) => {
    if (index <= 0) return
    const updated = [...sections]
    const temp = updated[index - 1]
    updated[index - 1] = updated[index]
    updated[index] = temp
    updateSectionsState(updated)
  }

  const handleMoveDown = (index: number) => {
    if (index >= sections.length - 1) return
    const updated = [...sections]
    const temp = updated[index + 1]
    updated[index + 1] = updated[index]
    updated[index] = temp
    updateSectionsState(updated)
  }

  const handleToggleVisibility = (index: number) => {
    const updated = [...sections]
    updated[index] = { ...updated[index], is_visible: !updated[index].is_visible }
    updateSectionsState(updated)
  }

  const handleDuplicate = (index: number) => {
    const target = sections[index]
    const duplicated: PageSection = {
      ...target,
      id: `sec-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      content: JSON.parse(JSON.stringify(target.content)),
    }
    const updated = [...sections]
    updated.splice(index + 1, 0, duplicated)
    updateSectionsState(updated)
  }

  const handleDelete = (index: number) => {
    const updated = sections.filter((_, i) => i !== index)
    updateSectionsState(updated)
  }

  const handleAddSectionSelect = (def: SectionDefinition) => {
    if (!pageId) return
    const newSection: PageSection = {
      id: `sec-${Date.now()}`,
      page_id: pageId,
      section_type: def.type,
      content: JSON.parse(JSON.stringify(def.defaultContent)),
      display_order: sections.length + 1,
      is_visible: true,
    }
    updateSectionsState([...sections, newSection])
  }

  const handleSaveSectionContent = (updatedContent: Record<string, any>) => {
    if (!editingSection) return
    const updated = sections.map((sec) =>
      sec.id === editingSection.id ? { ...sec, content: updatedContent } : sec
    )
    updateSectionsState(updated)
  }

  const handleUpdatePageMeta = async (data: { title: string; slug: string; seo_title?: string; seo_description?: string }) => {
    if (!pageId) return
    const res = await cmsService.updatePage(pageId, data)
    if (res.data) {
      setPage(res.data)
      setToastMessage({ type: 'success', text: 'Page information updated.' })
    }
  }

  if (isLoading) {
    return (
      <div className="py-20 text-center space-y-3">
        <Loader2 className="w-8 h-8 text-[#2F80ED] animate-spin mx-auto" />
        <p className="text-slate-400 text-xs font-mono">Loading Page Builder Studio...</p>
      </div>
    )
  }

  if (!page) {
    return (
      <div className="py-20 text-center space-y-4">
        <AlertCircle className="w-10 h-10 text-rose-500 mx-auto" />
        <h2 className="text-white font-bold text-lg">Page Not Found</h2>
        <button
          onClick={() => navigate('/admin/pages')}
          className="px-4 py-2 bg-[#2F80ED] text-white text-xs font-bold rounded-xl"
        >
          Return to Manage Pages
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Toast Notification Alert */}
      {toastMessage && (
        <div
          className={`fixed top-4 right-4 z-50 p-4 rounded-xl shadow-2xl border flex items-center gap-3 text-xs font-bold animate-in fade-in slide-in-from-top-4 duration-300 ${
            toastMessage.type === 'success'
              ? 'bg-emerald-950 border-emerald-500/50 text-emerald-200'
              : 'bg-rose-950 border-rose-500/50 text-rose-200'
          }`}
        >
          {toastMessage.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
          )}
          <span>{toastMessage.text}</span>
        </div>
      )}

      {/* Top Controls Header Bar */}
      <div className="bg-[#1A2433] p-6 rounded-2xl border border-[#2A3649] shadow-lg flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/admin/pages')}
              className="p-1.5 rounded-lg bg-[#0B1220] hover:bg-[#2F80ED] text-slate-300 hover:text-white border border-[#2A3649] transition-colors"
              title="Return to Pages List"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>

            <h1 className="font-['Manrope'] text-2xl font-extrabold text-white tracking-tight">
              {page.title}
            </h1>

            {/* Unsaved Changes / Saved Status Indicator Badge */}
            {isDirty ? (
              <span className="px-2.5 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-400 font-mono text-[10px] font-bold uppercase tracking-wider animate-pulse">
                Unsaved Changes
              </span>
            ) : (
              <span className="px-2.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 font-mono text-[10px] font-bold uppercase tracking-wider">
                Saved
              </span>
            )}
          </div>

          <div className="flex items-center gap-3 text-xs font-mono text-slate-400 pt-1">
            <span className="flex items-center gap-1">
              <Globe className="w-3.5 h-3.5 text-[#2F80ED]" />
              <span>{page.slug}</span>
            </span>
            <span>•</span>
            <span className={`uppercase font-bold ${page.status === 'published' ? 'text-emerald-400' : 'text-slate-400'}`}>
              Status: {page.status}
            </span>
          </div>
        </div>

        {/* Builder Toolbar Actions */}
        <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto justify-start lg:justify-end">
          <button
            onClick={() => setIsMetaModalOpen(true)}
            className="px-3.5 py-2 bg-[#0B1220] hover:bg-[#2A3649] text-slate-300 hover:text-white text-xs font-bold rounded-xl border border-[#2A3649] transition-all flex items-center gap-1.5"
            title="Edit page title and slug"
          >
            <Settings className="w-3.5 h-3.5" />
            <span>Page Info</span>
          </button>

          <button
            onClick={() => setIsPreviewOpen(true)}
            className="px-3.5 py-2 bg-[#0B1220] hover:bg-[#2F80ED] text-slate-200 hover:text-white text-xs font-bold rounded-xl border border-[#2A3649] transition-all flex items-center gap-1.5"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Live Preview</span>
          </button>

          <button
            onClick={handleSaveDraft}
            disabled={isSaving}
            className="px-4 py-2 bg-[#1A2433] hover:bg-[#2A3649] text-white text-xs font-bold rounded-xl border border-[#2A3649] transition-all flex items-center gap-1.5 disabled:opacity-50"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Draft</span>
          </button>

          <button
            onClick={handlePublishPage}
            disabled={isSaving}
            className="px-5 py-2 bg-[#2F80ED] hover:bg-[#1d6ed8] text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-md transition-all flex items-center gap-1.5 disabled:opacity-50"
          >
            {isSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
            <span>Publish Page</span>
          </button>
        </div>
      </div>

      {/* Main Section Canvas */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-mono text-slate-400 uppercase tracking-wider font-bold">
            <FileText className="w-4 h-4 text-[#2F80ED]" />
            <span>Page Canvas ({sections.length} Sections)</span>
          </div>

          <button
            onClick={() => setIsAddSectionOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#2F80ED] hover:bg-[#1d6ed8] text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-md transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add Section</span>
          </button>
        </div>

        {sections.length === 0 ? (
          /* Clean Empty Canvas State */
          <div className="py-20 text-center space-y-4 bg-[#1A2433] rounded-2xl border border-dashed border-[#2A3649] p-8">
            <div className="p-4 rounded-full bg-[#0B1220] text-slate-500 w-16 h-16 mx-auto flex items-center justify-center border border-[#2A3649]">
              <Plus className="w-8 h-8" />
            </div>
            <div className="space-y-1 max-w-sm mx-auto">
              <h3 className="font-['Manrope'] font-bold text-white text-base">This Page Has No Sections</h3>
              <p className="text-slate-400 text-xs leading-relaxed">
                Click below to select and add pre-designed components like Hero Banners, Text Blocks, Product Grids, or Contact CTAs.
              </p>
            </div>
            <button
              onClick={() => setIsAddSectionOpen(true)}
              className="px-5 py-2.5 bg-[#2F80ED] text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-md inline-flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>Add First Section</span>
            </button>
          </div>
        ) : (
          /* Ordered Section Cards List */
          <div className="space-y-3">
            {sections.map((sec, index) => {
              const def = getSectionDefinition(sec.section_type)
              const Icon = def?.icon || FileText

              return (
                <div
                  key={sec.id}
                  className={`p-4 sm:p-5 rounded-2xl border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                    sec.is_visible
                      ? 'bg-[#1A2433] border-[#2A3649] hover:border-[#2F80ED]/40'
                      : 'bg-[#0B1220]/70 border-[#2A3649]/60 opacity-60'
                  }`}
                >
                  {/* Left Info */}
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="p-2.5 rounded-xl bg-[#0B1220] border border-[#2A3649] text-[#2F80ED] shrink-0">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="min-w-0 space-y-0.5">
                      <div className="flex items-center gap-2.5">
                        <span className="font-['Manrope'] font-bold text-white text-sm">
                          {def?.label || sec.section_type}
                        </span>
                        <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest px-2 py-0.5 bg-[#0B1220] rounded border border-[#2A3649]">
                          {def?.category || 'Custom'}
                        </span>
                        {!sec.is_visible && (
                          <span className="text-[10px] font-mono text-amber-400 uppercase tracking-wider">
                            Hidden
                          </span>
                        )}
                      </div>
                      <p className="text-slate-400 text-xs font-mono truncate max-w-md">
                        Order #{index + 1} • Type: {sec.section_type}
                      </p>
                    </div>
                  </div>

                  {/* Right Actions */}
                  <div className="flex items-center gap-1.5 self-end sm:self-center">
                    {/* Move Up */}
                    <button
                      onClick={() => handleMoveUp(index)}
                      disabled={index === 0}
                      className="p-2 rounded-lg bg-[#0B1220] text-slate-300 hover:text-white border border-[#2A3649] disabled:opacity-30 disabled:cursor-not-allowed"
                      title="Move Section Up"
                    >
                      <ArrowUp className="w-4 h-4" />
                    </button>

                    {/* Move Down */}
                    <button
                      onClick={() => handleMoveDown(index)}
                      disabled={index === sections.length - 1}
                      className="p-2 rounded-lg bg-[#0B1220] text-slate-300 hover:text-white border border-[#2A3649] disabled:opacity-30 disabled:cursor-not-allowed"
                      title="Move Section Down"
                    >
                      <ArrowDown className="w-4 h-4" />
                    </button>

                    {/* Toggle Visibility */}
                    <button
                      onClick={() => handleToggleVisibility(index)}
                      className={`p-2 rounded-lg border transition-colors ${
                        sec.is_visible
                          ? 'bg-[#0B1220] text-slate-300 hover:text-white border-[#2A3649]'
                          : 'bg-amber-950/40 text-amber-400 border-amber-500/30'
                      }`}
                      title={sec.is_visible ? 'Hide Section' : 'Show Section'}
                    >
                      {sec.is_visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                    </button>

                    {/* Edit Section */}
                    <button
                      onClick={() => setEditingSection(sec)}
                      className="p-2 rounded-lg bg-[#2F80ED]/20 text-[#2F80ED] hover:bg-[#2F80ED] hover:text-white border border-[#2F80ED]/30 transition-colors"
                      title="Edit Section Configuration"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>

                    {/* Duplicate */}
                    <button
                      onClick={() => handleDuplicate(index)}
                      className="p-2 rounded-lg bg-[#0B1220] text-slate-300 hover:text-white border border-[#2A3649]"
                      title="Duplicate Section"
                    >
                      <Copy className="w-4 h-4" />
                    </button>

                    {/* Delete */}
                    <button
                      onClick={() => handleDelete(index)}
                      className="p-2 rounded-lg bg-[#0B1220] text-slate-400 hover:text-rose-400 hover:bg-rose-950/40 border border-[#2A3649] transition-colors"
                      title="Delete Section"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Modals */}
      <PageMetaModal
        isOpen={isMetaModalOpen}
        onClose={() => setIsMetaModalOpen(false)}
        onSave={handleUpdatePageMeta}
        initialData={{
          title: page.title,
          slug: page.slug,
          seo_title: page.seo_title,
          seo_description: page.seo_description,
        }}
        isEditing={true}
      />

      <AddSectionModal
        isOpen={isAddSectionOpen}
        onClose={() => setIsAddSectionOpen(false)}
        onSelectSection={handleAddSectionSelect}
      />

      <SectionEditorModal
        isOpen={Boolean(editingSection)}
        section={editingSection}
        onClose={() => setEditingSection(null)}
        onSave={handleSaveSectionContent}
      />

      <PagePreviewModal
        isOpen={isPreviewOpen}
        pageTitle={page.title}
        sections={sections}
        onClose={() => setIsPreviewOpen(false)}
      />
    </div>
  )
}
