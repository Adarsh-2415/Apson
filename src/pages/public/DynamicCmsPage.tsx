import { useState, useEffect, useCallback } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Loader2, AlertCircle, ArrowLeft, Boxes } from 'lucide-react'
import type { PageRecord, PageSection } from '@/types/builder'
import { cmsService } from '@/services/cmsService'
import { SectionRenderer } from '@/components/sections/SectionRenderer'

export function DynamicCmsPage() {
  const { slug } = useParams<{ slug: string }>()
  const [page, setPage] = useState<PageRecord | null>(null)
  const [sections, setSections] = useState<PageSection[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  const formattedSlug = slug ? (slug.startsWith('/') ? slug : `/${slug}`) : '/'

  const loadCmsPage = useCallback(async () => {
    setIsLoading(true)
    setNotFound(false)

    const pageRes = await cmsService.getPageBySlug(formattedSlug)

    if (pageRes.data) {
      setPage(pageRes.data)
      const secRes = await cmsService.getPageSections(pageRes.data.id)
      const visible = (secRes.data || []).filter((s) => s.is_visible)
      setSections(visible)
    } else {
      setNotFound(true)
    }
    setIsLoading(false)
  }, [formattedSlug])

  useEffect(() => {
    loadCmsPage()
  }, [loadCmsPage])

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="py-20 text-center space-y-3">
          <Loader2 className="w-8 h-8 text-[#2F80ED] animate-spin mx-auto" />
          <p className="text-slate-400 text-xs font-mono">Loading Page Content...</p>
        </div>
      </div>
    )
  }

  if (notFound || !page) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4 py-16">
        <div className="max-w-md w-full bg-[#1A2433] rounded-3xl border border-[#2A3649] p-8 sm:p-10 text-center space-y-6 shadow-2xl">
          <div className="p-4 rounded-full bg-rose-950/50 text-rose-400 w-16 h-16 mx-auto flex items-center justify-center border border-rose-500/30">
            <AlertCircle className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-mono text-rose-400 font-bold uppercase tracking-widest block">
              404 — PAGE NOT FOUND
            </span>
            <h1 className="font-['Manrope'] text-2xl sm:text-3xl font-extrabold text-white">
              Requested Page Does Not Exist
            </h1>
            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
              The page <code className="text-slate-200 bg-[#0B1220] px-2 py-0.5 rounded font-mono">{formattedSlug}</code> could not be found or is not published.
            </p>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to="/"
              className="w-full sm:w-auto px-5 py-2.5 bg-[#2F80ED] hover:bg-[#1d6ed8] text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-md inline-flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Return Home</span>
            </Link>
            <Link
              to="/products"
              className="w-full sm:w-auto px-5 py-2.5 bg-[#0B1220] hover:bg-[#1A2433] text-slate-300 hover:text-white text-xs font-bold uppercase tracking-wider rounded-xl border border-[#2A3649] inline-flex items-center justify-center gap-2"
            >
              <Boxes className="w-4 h-4" />
              <span>View Products</span>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-4">
      {sections.length === 0 ? (
        <div className="py-20 text-center text-slate-400 text-xs font-mono bg-[#1A2433] rounded-3xl border border-[#2A3649]">
          This page has no active visible sections.
        </div>
      ) : (
        sections.map((sec) => <SectionRenderer key={sec.id} section={sec} isPreview={false} />)
      )}
    </div>
  )
}
