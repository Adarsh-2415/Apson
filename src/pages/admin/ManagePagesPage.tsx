import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Pencil, FileText, Globe, RefreshCw } from 'lucide-react'
import type { PageRecord } from '@/types/builder'
import { cmsService } from '@/services/cmsService'
import { PageMetaModal } from '@/components/admin/builder/PageMetaModal'

export function ManagePagesPage() {
  const navigate = useNavigate()
  const [pages, setPages] = useState<PageRecord[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)

  const loadPages = useCallback(async () => {
    setIsLoading(true)
    const { data } = await cmsService.getPages()
    setPages(data || [])
    setIsLoading(false)
  }, [])

  useEffect(() => {
    loadPages()
  }, [loadPages])

  const handleCreatePage = async (input: {
    title: string
    slug: string
    seo_title?: string
    seo_description?: string
  }) => {
    const res = await cmsService.createPage(input)
    if (res.data) {
      navigate(`/admin/pages/builder/${res.data.id}`)
    }
  }

  const handleEditClick = (page: PageRecord) => {
    const slug = page.slug
    const title = page.title.toLowerCase()

    if (slug === '/' || title === 'home') {
      navigate('/admin/pages/home/edit')
    } else if (slug === '/about' || title === 'about us' || title === 'about') {
      navigate('/admin/pages/about/edit')
    } else if (slug === '/products' || title === 'products') {
      navigate('/admin/pages/products/edit')
    } else {
      navigate(`/admin/pages/builder/${page.id}`)
    }
  }

  const getButtonLabel = (page: PageRecord) => {
    const slug = page.slug
    const title = page.title.toLowerCase()

    if (slug === '/' || title === 'home') return 'Edit Home CMS'
    if (slug === '/about' || title === 'about us' || title === 'about') return 'Edit About CMS'
    if (slug === '/products' || title === 'products') return 'Edit Products CMS'
    return 'Open Builder'
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Page Header & Add Page Action */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-[#1A2433] p-6 sm:p-8 rounded-2xl border border-[#2A3649] shadow-lg">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 text-xs font-mono text-[#2F80ED] uppercase tracking-wider mb-1">
            <FileText className="w-3.5 h-3.5" />
            <span>CMS PAGE BUILDER</span>
          </div>
          <h1 className="font-['Manrope'] text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Manage Pages
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm max-w-2xl leading-relaxed">
            Manage website structure, create custom landing pages, and edit section content.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={loadPages}
            disabled={isLoading}
            className="p-2.5 bg-[#0B1220] hover:bg-[#2F80ED] text-slate-300 hover:text-white rounded-xl border border-[#2A3649] transition-colors disabled:opacity-50"
            title="Refresh Pages List"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>

          <button
            type="button"
            onClick={() => setIsCreateModalOpen(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#2F80ED] hover:bg-[#1d6ed8] text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-md transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add Page</span>
          </button>
        </div>
      </div>

      {/* Pages Table */}
      <div className="bg-[#1A2433] rounded-2xl border border-[#2A3649] overflow-hidden shadow-xl">
        <div className="p-6 border-b border-[#2A3649] flex items-center justify-between">
          <div>
            <h2 className="font-['Manrope'] font-bold text-base text-white">
              Website Pages Directory
            </h2>
            <p className="text-slate-400 text-xs mt-0.5">
              Managed routes across core pages and custom CMS landings.
            </p>
          </div>
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest bg-[#0B1220] px-3 py-1 rounded-md border border-[#2A3649]">
            {pages.length} Pages Listed
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#0B1220]/60 border-b border-[#2A3649] text-[11px] font-mono uppercase tracking-widest text-slate-400">
                <th scope="col" className="py-4 px-6 font-bold">
                  Page Title
                </th>
                <th scope="col" className="py-4 px-6 font-bold">
                  Route
                </th>
                <th scope="col" className="py-4 px-6 font-bold">
                  Status
                </th>
                <th scope="col" className="py-4 px-6 font-bold text-right">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2A3649]/60 text-sm">
              {pages.map((page) => (
                <tr key={page.id} className="hover:bg-[#0B1220]/40 transition-colors group">
                  <td className="py-4 px-6 font-['Manrope'] font-bold text-white">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-[#0B1220] border border-[#2A3649] text-[#2F80ED]">
                        <FileText className="w-4 h-4" />
                      </div>
                      <div>
                        <span>{page.title}</span>
                        {page.seo_title && (
                          <span className="block text-[10px] font-mono text-slate-500 font-normal truncate max-w-xs">
                            {page.seo_title}
                          </span>
                        )}
                      </div>
                    </div>
                  </td>

                  <td className="py-4 px-6 font-mono text-xs text-slate-300">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#0B1220] border border-[#2A3649]">
                      <Globe className="w-3.5 h-3.5 text-[#2F80ED]" />
                      <span>{page.slug}</span>
                    </div>
                  </td>

                  <td className="py-4 px-6">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono font-bold uppercase tracking-wider ${
                        page.status === 'published'
                          ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                          : 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          page.status === 'published' ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'
                        }`}
                      />
                      <span>{page.status}</span>
                    </span>
                  </td>

                  <td className="py-4 px-6 text-right">
                    <button
                      type="button"
                      onClick={() => handleEditClick(page)}
                      className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#2F80ED]/15 hover:bg-[#2F80ED] text-[#2F80ED] hover:text-white text-xs font-bold rounded-lg border border-[#2F80ED]/30 transition-all shadow-sm"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                      <span>{getButtonLabel(page)}</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <PageMetaModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSave={handleCreatePage}
        isEditing={false}
      />
    </div>
  )
}
