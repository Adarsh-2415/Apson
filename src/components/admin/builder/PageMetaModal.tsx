import { useState } from 'react'
import { X, FileText, Globe, Loader2 } from 'lucide-react'

interface PageMetaModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (data: { title: string; slug: string; seo_title?: string; seo_description?: string }) => Promise<void>
  initialData?: { title: string; slug: string; seo_title?: string; seo_description?: string }
  isEditing?: boolean
}

export function PageMetaModal({ isOpen, onClose, onSave, initialData, isEditing = false }: PageMetaModalProps) {
  const [title, setTitle] = useState(initialData?.title || '')
  const [slug, setSlug] = useState(initialData?.slug || '')
  const [seoTitle, setSeoTitle] = useState(initialData?.seo_title || '')
  const [seoDescription, setSeoDescription] = useState(initialData?.seo_description || '')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (!isOpen) return null

  const handleTitleChange = (newTitle: string) => {
    setTitle(newTitle)
    if (!isEditing && !slug) {
      const autoSlug = '/' + newTitle.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
      setSlug(autoSlug)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!title.trim()) {
      setError('Page title is required.')
      return
    }

    if (!slug.trim()) {
      setError('Page slug is required.')
      return
    }

    const formattedSlug = slug.startsWith('/') ? slug.trim() : `/${slug.trim()}`
    
    // Reserved routes validation
    const reserved = ['/admin', '/login', '/dashboard', '/api']
    if (reserved.some((r) => formattedSlug.startsWith(r))) {
      setError(`Slug '${formattedSlug}' conflicts with reserved system path.`)
      return
    }

    setIsSubmitting(true)
    try {
      await onSave({
        title: title.trim(),
        slug: formattedSlug,
        seo_title: seoTitle.trim() || title.trim(),
        seo_description: seoDescription.trim(),
      })
      onClose()
    } catch {
      setError('Failed to save page information. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-[#0B1220]/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#1A2433] border border-[#2A3649] rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="p-6 border-b border-[#2A3649] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-[#2F80ED]/20 text-[#2F80ED]">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-['Manrope'] font-extrabold text-white text-lg">
                {isEditing ? 'Edit Page Information' : 'Create New Page'}
              </h2>
              <p className="text-slate-400 text-xs">Define page title, route URL slug, and SEO options.</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-[#0B1220]">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          {error && (
            <div className="p-3 bg-rose-950/80 border border-rose-600/50 rounded-xl text-rose-200 font-medium">
              {error}
            </div>
          )}

          <div>
            <label className="block text-slate-300 font-bold mb-1 uppercase tracking-wider">
              Page Title <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="e.g. Aerospace Testing Solutions"
              required
              className="w-full p-3 bg-[#0B1220] border border-[#2A3649] rounded-xl text-white font-medium text-sm focus:outline-none focus:border-[#2F80ED]"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-bold mb-1 uppercase tracking-wider">
              Route Slug <span className="text-rose-400">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500 font-mono">
                <Globe className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="/aerospace-testing-solutions"
                required
                className="w-full pl-10 pr-3 py-3 bg-[#0B1220] border border-[#2A3649] rounded-xl text-white font-mono text-xs focus:outline-none focus:border-[#2F80ED]"
              />
            </div>
          </div>

          <div className="pt-2 border-t border-[#2A3649] space-y-3">
            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest font-bold block">
              SEO Metadata (Optional)
            </span>

            <div>
              <label className="block text-slate-300 font-bold mb-1 uppercase tracking-wider">SEO Meta Title</label>
              <input
                type="text"
                value={seoTitle}
                onChange={(e) => setSeoTitle(e.target.value)}
                placeholder="Browser title tag text"
                className="w-full p-2.5 bg-[#0B1220] border border-[#2A3649] rounded-lg text-white font-medium"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-bold mb-1 uppercase tracking-wider">SEO Meta Description</label>
              <textarea
                rows={2}
                value={seoDescription}
                onChange={(e) => setSeoDescription(e.target.value)}
                placeholder="Brief summary for search engine results..."
                className="w-full p-2.5 bg-[#0B1220] border border-[#2A3649] rounded-lg text-white font-medium resize-y"
              />
            </div>
          </div>

          <div className="pt-4 flex items-center justify-end gap-3 border-t border-[#2A3649]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 bg-[#0B1220] text-slate-300 hover:text-white rounded-xl border border-[#2A3649] font-bold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 bg-[#2F80ED] hover:bg-[#1d6ed8] text-white rounded-xl font-bold uppercase tracking-wider shadow-md flex items-center gap-2"
            >
              {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              <span>{isEditing ? 'Save Changes' : 'Create Page & Open Builder'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
