import { useState, useEffect, useCallback, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  ExternalLink,
  Save,
  Plus,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Upload,
  Image as ImageIcon,
  Users,
  Award,
} from 'lucide-react'
import type { HomePageContentPayload, HeroSlide } from '@/types/homeCms'
import { cmsService } from '@/services/cmsService'
import { storageService } from '@/services/storageService'

export function HomePageEditorPage() {
  const navigate = useNavigate()

  const [content, setContent] = useState<HomePageContentPayload | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isDirty, setIsDirty] = useState(false)
  const [uploadingSlideId, setUploadingSlideId] = useState<string | null>(null)
  const [isUploadingIntroImg, setIsUploadingIntroImg] = useState(false)

  const introFileInputRef = useRef<HTMLInputElement | null>(null)
  const slideFileInputRefs = useRef<Record<string, HTMLInputElement | null>>({})

  // Toast
  const [toastMessage, setToastMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => setToastMessage(null), 3500)
      return () => clearTimeout(timer)
    }
  }, [toastMessage])

  const loadData = useCallback(async () => {
    setIsLoading(true)
    const res = await cmsService.getHomePageContent()
    if (res.data) {
      setContent(res.data)
      setIsDirty(false)
    }
    setIsLoading(false)
  }, [])

  useEffect(() => {
    loadData()
  }, [loadData])

  const handleSave = async () => {
    if (!content) return
    setIsSaving(true)

    const res = await cmsService.saveHomePageContent(content)
    if (res.error) {
      setToastMessage({ type: 'error', text: 'Failed to save Home page content.' })
    } else {
      setIsDirty(false)
      setToastMessage({ type: 'success', text: 'Home page content saved successfully!' })
    }
    setIsSaving(false)
  }

  // Handle Slide Image Upload
  const handleSlideImageUpload = async (slideId: string, file: File) => {
    if (!content) return
    setUploadingSlideId(slideId)

    const res = await storageService.uploadImage(file, 'heroes')
    if (res.url) {
      const updatedSlides = content.heroSlides.map((slide) =>
        slide.id === slideId ? { ...slide, imageSrc: res.url! } : slide
      )
      setContent({ ...content, heroSlides: updatedSlides })
      setIsDirty(true)
      setToastMessage({ type: 'success', text: 'Slide image uploaded successfully!' })
    } else if (res.error) {
      setToastMessage({ type: 'error', text: res.error.message })
    }
    setUploadingSlideId(null)
  }

  // Handle Company Intro Image Upload
  const handleIntroImageUpload = async (file: File) => {
    if (!content) return
    setIsUploadingIntroImg(true)

    const res = await storageService.uploadImage(file, 'company')
    if (res.url) {
      setContent({
        ...content,
        companyIntro: { ...content.companyIntro, imageSrc: res.url },
      })
      setIsDirty(true)
      setToastMessage({ type: 'success', text: 'Company intro image uploaded!' })
    } else if (res.error) {
      setToastMessage({ type: 'error', text: res.error.message })
    }
    setIsUploadingIntroImg(false)
  }

  // Add Slide
  const handleAddSlide = () => {
    if (!content) return
    const newSlide: HeroSlide = {
      id: `slide-${Date.now()}`,
      title: 'New Industrial Equipment Slide',
      subtitle: 'High precision testing machinery for engineering applications.',
      primaryCtaText: 'Explore Products',
      primaryCtaHref: '/products',
      secondaryCtaText: 'Contact Us',
      secondaryCtaHref: '/contact',
      imageSrc: '/images/slider-1.jpg',
      imageAlt: 'APSON Testing Machinery',
    }
    setContent({ ...content, heroSlides: [...content.heroSlides, newSlide] })
    setIsDirty(true)
  }

  // Remove Slide
  const handleRemoveSlide = (slideId: string) => {
    if (!content) return
    if (content.heroSlides.length <= 1) {
      setToastMessage({ type: 'error', text: 'Hero slider must contain at least 1 slide.' })
      return
    }
    setContent({
      ...content,
      heroSlides: content.heroSlides.filter((s) => s.id !== slideId),
    })
    setIsDirty(true)
  }

  if (isLoading || !content) {
    return (
      <div className="py-20 text-center space-y-3">
        <Loader2 className="w-8 h-8 text-[#2F80ED] animate-spin mx-auto" />
        <p className="text-slate-400 text-xs font-mono">Loading Home Page CMS Editor...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Toast Alert */}
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

      {/* Top Header Bar */}
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
              Home Page CMS Editor
            </h1>
            {isDirty && (
              <span className="px-2.5 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-400 font-mono text-[10px] font-bold uppercase tracking-wider animate-pulse">
                Unsaved Changes
              </span>
            )}
          </div>
          <p className="text-slate-400 text-xs pl-9">
            Manage hero slides, company intro, manpower workforce stats, why APSON features, and CTAs.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#0B1220] hover:bg-[#2F80ED] text-white text-xs font-bold rounded-xl border border-[#2A3649] transition-all"
          >
            <span>View Live Page</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          <button
            onClick={handleSave}
            disabled={isSaving}
            className="inline-flex items-center gap-2 px-5 py-2 bg-[#2F80ED] hover:bg-[#1d6ed8] text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-md transition-all disabled:opacity-50"
          >
            {isSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
            <span>Save Content</span>
          </button>
        </div>
      </div>

      {/* SECTION 1: HERO SHOWCASE SLIDER */}
      <div className="bg-[#1A2433] p-6 rounded-2xl border border-[#2A3649] space-y-5 shadow-xl">
        <div className="flex items-center justify-between border-b border-[#2A3649] pb-3">
          <div className="flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-[#2F80ED]" />
            <h2 className="font-['Manrope'] font-bold text-base text-white">
              Hero Showcase Slider ({content.heroSlides.length} Slides)
            </h2>
          </div>
          <button
            type="button"
            onClick={handleAddSlide}
            className="px-3.5 py-1.5 bg-[#2F80ED] hover:bg-[#1d6ed8] text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-md inline-flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Add Slide</span>
          </button>
        </div>

        <div className="space-y-6">
          {content.heroSlides.map((slide, index) => (
            <div key={slide.id} className="p-5 bg-[#0B1220] rounded-xl border border-[#2A3649] space-y-4">
              <div className="flex items-center justify-between border-b border-[#2A3649]/80 pb-2">
                <span className="text-xs font-mono text-[#2F80ED] font-bold uppercase">
                  Slide {index + 1} of {content.heroSlides.length}
                </span>
                <button
                  type="button"
                  onClick={() => handleRemoveSlide(slide.id)}
                  className="text-slate-400 hover:text-rose-400 p-1"
                  title="Remove Slide"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-4 text-xs">
                <div>
                  <label className="block text-slate-300 font-bold mb-1 uppercase tracking-wider">Slide Title</label>
                  <input
                    type="text"
                    value={slide.title}
                    onChange={(e) => {
                      const updated = content.heroSlides.map((s) => (s.id === slide.id ? { ...s, title: e.target.value } : s))
                      setContent({ ...content, heroSlides: updated })
                      setIsDirty(true)
                    }}
                    className="w-full p-2.5 bg-[#1A2433] border border-[#2A3649] rounded-xl text-white font-medium"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1 uppercase tracking-wider">Slide Subtitle</label>
                  <textarea
                    rows={2}
                    value={slide.subtitle}
                    onChange={(e) => {
                      const updated = content.heroSlides.map((s) => (s.id === slide.id ? { ...s, subtitle: e.target.value } : s))
                      setContent({ ...content, heroSlides: updated })
                      setIsDirty(true)
                    }}
                    className="w-full p-2.5 bg-[#1A2433] border border-[#2A3649] rounded-xl text-white font-medium resize-y"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-300 font-bold mb-1 uppercase tracking-wider">Primary Button Text</label>
                    <input
                      type="text"
                      value={slide.primaryCtaText}
                      onChange={(e) => {
                        const updated = content.heroSlides.map((s) => (s.id === slide.id ? { ...s, primaryCtaText: e.target.value } : s))
                        setContent({ ...content, heroSlides: updated })
                        setIsDirty(true)
                      }}
                      className="w-full p-2.5 bg-[#1A2433] border border-[#2A3649] rounded-xl text-white font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-bold mb-1 uppercase tracking-wider">Primary Button Link</label>
                    <input
                      type="text"
                      value={slide.primaryCtaHref}
                      onChange={(e) => {
                        const updated = content.heroSlides.map((s) => (s.id === slide.id ? { ...s, primaryCtaHref: e.target.value } : s))
                        setContent({ ...content, heroSlides: updated })
                        setIsDirty(true)
                      }}
                      className="w-full p-2.5 bg-[#1A2433] border border-[#2A3649] rounded-xl text-white font-medium"
                    />
                  </div>
                </div>

                {/* Slide Background Image Upload */}
                <div className="space-y-2">
                  <label className="block text-slate-300 font-bold uppercase tracking-wider">Background Image</label>
                  
                  <input
                    type="file"
                    ref={(el) => {
                      slideFileInputRefs.current[slide.id] = el
                    }}
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) handleSlideImageUpload(slide.id, file)
                    }}
                    className="hidden"
                  />

                  <div className="flex flex-col sm:flex-row items-center gap-4 p-3 bg-[#1A2433] rounded-xl border border-[#2A3649]">
                    <div className="w-24 h-16 rounded-lg bg-[#0B1220] border border-[#2A3649] overflow-hidden shrink-0 flex items-center justify-center relative">
                      <img src={slide.imageSrc} alt={slide.imageAlt} className="w-full h-full object-cover" />
                      {uploadingSlideId === slide.id && (
                        <div className="absolute inset-0 bg-[#0B1220]/80 backdrop-blur-xs flex items-center justify-center">
                          <Loader2 className="w-5 h-5 text-[#2F80ED] animate-spin" />
                        </div>
                      )}
                    </div>

                    <div className="flex-1 space-y-1 text-center sm:text-left">
                      <button
                        type="button"
                        disabled={uploadingSlideId === slide.id}
                        onClick={() => slideFileInputRefs.current[slide.id]?.click()}
                        className="px-4 py-2 bg-[#2F80ED] hover:bg-[#1d6ed8] text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-md transition-all inline-flex items-center gap-2 disabled:opacity-50"
                      >
                        {uploadingSlideId === slide.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
                        <span>Upload Slide Image from Device</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 2: COMPANY INTRODUCTION */}
      <div className="bg-[#1A2433] p-6 rounded-2xl border border-[#2A3649] space-y-4 shadow-xl text-xs">
        <div className="flex items-center justify-between border-b border-[#2A3649] pb-3">
          <h2 className="font-['Manrope'] font-bold text-base text-white">
            Company Introduction Section
          </h2>
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">About Overview</span>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 font-bold mb-1 uppercase tracking-wider">Eyebrow</label>
              <input
                type="text"
                value={content.companyIntro.eyebrow}
                onChange={(e) => {
                  setContent({ ...content, companyIntro: { ...content.companyIntro, eyebrow: e.target.value } })
                  setIsDirty(true)
                }}
                className="w-full p-2.5 bg-[#0B1220] border border-[#2A3649] rounded-xl text-white font-medium"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-bold mb-1 uppercase tracking-wider">Heading</label>
              <input
                type="text"
                value={content.companyIntro.heading}
                onChange={(e) => {
                  setContent({ ...content, companyIntro: { ...content.companyIntro, heading: e.target.value } })
                  setIsDirty(true)
                }}
                className="w-full p-2.5 bg-[#0B1220] border border-[#2A3649] rounded-xl text-white font-medium"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-bold mb-1 uppercase tracking-wider">Paragraph 1</label>
            <textarea
              rows={3}
              value={content.companyIntro.descriptionParagraphs[0] || ''}
              onChange={(e) => {
                const updated = [...content.companyIntro.descriptionParagraphs]
                updated[0] = e.target.value
                setContent({ ...content, companyIntro: { ...content.companyIntro, descriptionParagraphs: updated } })
                setIsDirty(true)
              }}
              className="w-full p-2.5 bg-[#0B1220] border border-[#2A3649] rounded-xl text-white font-medium resize-y"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-bold mb-1 uppercase tracking-wider">Paragraph 2</label>
            <textarea
              rows={3}
              value={content.companyIntro.descriptionParagraphs[1] || ''}
              onChange={(e) => {
                const updated = [...content.companyIntro.descriptionParagraphs]
                updated[1] = e.target.value
                setContent({ ...content, companyIntro: { ...content.companyIntro, descriptionParagraphs: updated } })
                setIsDirty(true)
              }}
              className="w-full p-2.5 bg-[#0B1220] border border-[#2A3649] rounded-xl text-white font-medium resize-y"
            />
          </div>

          {/* Intro Image Upload */}
          <div className="space-y-2">
            <label className="block text-slate-300 font-bold uppercase tracking-wider">Intro Showcase Image</label>
            
            <input
              type="file"
              ref={introFileInputRef}
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) handleIntroImageUpload(file)
              }}
              className="hidden"
            />

            <div className="flex flex-col sm:flex-row items-center gap-4 p-3 bg-[#0B1220] rounded-xl border border-[#2A3649]">
              <div className="w-24 h-16 rounded-lg bg-[#1A2433] border border-[#2A3649] overflow-hidden shrink-0 flex items-center justify-center relative">
                <img src={content.companyIntro.imageSrc} alt={content.companyIntro.imageAlt} className="w-full h-full object-cover" />
                {isUploadingIntroImg && (
                  <div className="absolute inset-0 bg-[#0B1220]/80 backdrop-blur-xs flex items-center justify-center">
                    <Loader2 className="w-5 h-5 text-[#2F80ED] animate-spin" />
                  </div>
                )}
              </div>

              <div className="flex-1 space-y-1 text-center sm:text-left">
                <button
                  type="button"
                  disabled={isUploadingIntroImg}
                  onClick={() => introFileInputRef.current?.click()}
                  className="px-4 py-2 bg-[#2F80ED] hover:bg-[#1d6ed8] text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-md transition-all inline-flex items-center gap-2 disabled:opacity-50"
                >
                  {isUploadingIntroImg ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
                  <span>Upload Intro Image from Device</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 3: MANPOWER STRENGTH */}
      <div className="bg-[#1A2433] p-6 rounded-2xl border border-[#2A3649] space-y-4 shadow-xl text-xs">
        <div className="flex items-center justify-between border-b border-[#2A3649] pb-3">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-[#2F80ED]" />
            <h2 className="font-['Manrope'] font-bold text-base text-white">
              Manpower Workforce Statistics
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div>
            <label className="block text-slate-300 font-bold mb-1 uppercase tracking-wider">Technical Engineers</label>
            <input
              type="number"
              min={0}
              value={content.manpower.technical}
              onChange={(e) => {
                setContent({ ...content, manpower: { ...content.manpower, technical: Number(e.target.value) || 0 } })
                setIsDirty(true)
              }}
              className="w-full p-2.5 bg-[#0B1220] border border-[#2A3649] rounded-xl text-white font-bold text-lg text-center"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-bold mb-1 uppercase tracking-wider">Non-Technical Staff</label>
            <input
              type="number"
              min={0}
              value={content.manpower.nonTechnical}
              onChange={(e) => {
                setContent({ ...content, manpower: { ...content.manpower, nonTechnical: Number(e.target.value) || 0 } })
                setIsDirty(true)
              }}
              className="w-full p-2.5 bg-[#0B1220] border border-[#2A3649] rounded-xl text-white font-bold text-lg text-center"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-bold mb-1 uppercase tracking-wider">Skilled Technicians</label>
            <input
              type="number"
              min={0}
              value={content.manpower.skilled}
              onChange={(e) => {
                setContent({ ...content, manpower: { ...content.manpower, skilled: Number(e.target.value) || 0 } })
                setIsDirty(true)
              }}
              className="w-full p-2.5 bg-[#0B1220] border border-[#2A3649] rounded-xl text-white font-bold text-lg text-center"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-bold mb-1 uppercase tracking-wider">Semi-Skilled Staff</label>
            <input
              type="number"
              min={0}
              value={content.manpower.semiUnskilled}
              onChange={(e) => {
                setContent({ ...content, manpower: { ...content.manpower, semiUnskilled: Number(e.target.value) || 0 } })
                setIsDirty(true)
              }}
              className="w-full p-2.5 bg-[#0B1220] border border-[#2A3649] rounded-xl text-white font-bold text-lg text-center"
            />
          </div>
        </div>
      </div>

      {/* SECTION 4: WHY APSON FEATURES */}
      <div className="bg-[#1A2433] p-6 rounded-2xl border border-[#2A3649] space-y-4 shadow-xl text-xs">
        <div className="flex items-center justify-between border-b border-[#2A3649] pb-3">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-[#2F80ED]" />
            <h2 className="font-['Manrope'] font-bold text-base text-white">
              Why APSON Feature Cards ({content.whyApson.features.length})
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {content.whyApson.features.map((feat, idx) => (
            <div key={idx} className="p-4 bg-[#0B1220] rounded-xl border border-[#2A3649] space-y-2">
              <span className="text-[10px] font-mono text-[#2F80ED] font-bold block">Feature #{feat.number}</span>
              <input
                type="text"
                value={feat.title}
                onChange={(e) => {
                  const updated = [...content.whyApson.features]
                  updated[idx] = { ...updated[idx], title: e.target.value }
                  setContent({ ...content, whyApson: { ...content.whyApson, features: updated } })
                  setIsDirty(true)
                }}
                className="w-full p-2 bg-[#1A2433] border border-[#2A3649] rounded-lg text-white font-bold"
              />
              <textarea
                rows={2}
                value={feat.description}
                onChange={(e) => {
                  const updated = [...content.whyApson.features]
                  updated[idx] = { ...updated[idx], description: e.target.value }
                  setContent({ ...content, whyApson: { ...content.whyApson, features: updated } })
                  setIsDirty(true)
                }}
                className="w-full p-2 bg-[#1A2433] border border-[#2A3649] rounded-lg text-slate-300 resize-y"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
