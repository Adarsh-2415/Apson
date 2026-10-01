import { useState, useEffect, useCallback, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  ExternalLink,
  Save,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Upload,
  Clock,
  Target,
  Activity,
  ShieldCheck,
  Award,
  Factory,
  Mail,
  Info,
  Plus,
  Trash2,
} from 'lucide-react'
import type { AboutPageContentPayload } from '@/types/aboutCms'
import { cmsService } from '@/services/cmsService'
import { storageService } from '@/services/storageService'

export function AboutPageEditorPage() {
  const navigate = useNavigate()

  const [content, setContent] = useState<AboutPageContentPayload | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isDirty, setIsDirty] = useState(false)

  // Image Upload Spinners & Refs
  const [isUploadingHeroImg, setIsUploadingHeroImg] = useState(false)
  const heroFileInputRef = useRef<HTMLInputElement | null>(null)

  const [isUploadingIntroImg, setIsUploadingIntroImg] = useState(false)
  const introFileInputRef = useRef<HTMLInputElement | null>(null)

  const [isUploadingQualityImg, setIsUploadingQualityImg] = useState(false)
  const qualityFileInputRef = useRef<HTMLInputElement | null>(null)

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
    const res = await cmsService.getAboutPageContent()
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

    const res = await cmsService.saveAboutPageContent(content)
    if (res.error) {
      setToastMessage({ type: 'error', text: 'Failed to save About Us page content.' })
    } else {
      setIsDirty(false)
      setToastMessage({ type: 'success', text: 'About Us page content saved successfully!' })
    }
    setIsSaving(false)
  }

  // Handle Hero Image Upload
  const handleHeroImageUpload = async (file: File) => {
    if (!content) return
    setIsUploadingHeroImg(true)

    const res = await storageService.uploadImage(file, 'heroes')
    if (res.url) {
      setContent({
        ...content,
        hero: { ...content.hero, imageSrc: res.url },
      })
      setIsDirty(true)
      setToastMessage({ type: 'success', text: 'About hero image uploaded!' })
    } else if (res.error) {
      setToastMessage({ type: 'error', text: res.error.message })
    }
    setIsUploadingHeroImg(false)
  }

  // Handle Intro Image Upload
  const handleIntroImageUpload = async (file: File) => {
    if (!content) return
    setIsUploadingIntroImg(true)

    const res = await storageService.uploadImage(file, 'about')
    if (res.url) {
      setContent({
        ...content,
        intro: { ...content.intro, imageSrc: res.url },
      })
      setIsDirty(true)
      setToastMessage({ type: 'success', text: 'Company intro image uploaded!' })
    } else if (res.error) {
      setToastMessage({ type: 'error', text: res.error.message })
    }
    setIsUploadingIntroImg(false)
  }

  // Handle Quality Manufacturing Image Upload
  const handleQualityImageUpload = async (file: File) => {
    if (!content) return
    setIsUploadingQualityImg(true)

    const res = await storageService.uploadImage(file, 'about')
    if (res.url) {
      setContent({
        ...content,
        qualityManufacturing: { ...content.qualityManufacturing, imageSrc: res.url },
      })
      setIsDirty(true)
      setToastMessage({ type: 'success', text: 'Quality manufacturing image uploaded!' })
    } else if (res.error) {
      setToastMessage({ type: 'error', text: res.error.message })
    }
    setIsUploadingQualityImg(false)
  }

  if (isLoading || !content) {
    return (
      <div className="py-20 text-center space-y-3">
        <Loader2 className="w-8 h-8 text-[#2F80ED] animate-spin mx-auto" />
        <p className="text-slate-400 text-xs font-mono">Loading About Us Page CMS Editor...</p>
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
              About Us Page CMS Editor Studio
            </h1>
            {isDirty && (
              <span className="px-2.5 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-400 font-mono text-[10px] font-bold uppercase tracking-wider animate-pulse">
                Unsaved Changes
              </span>
            )}
          </div>
          <p className="text-slate-400 text-xs pl-9">
            Manage 100% of all 10 About Us page sections: text, images, stats, mission/vision, values, industries, and CTAs.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <a
            href="/about"
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

      {/* SECTION 1: HERO BANNER */}
      <div className="bg-[#1A2433] p-6 rounded-2xl border border-[#2A3649] space-y-4 shadow-xl text-xs">
        <div className="flex items-center justify-between border-b border-[#2A3649] pb-3">
          <h2 className="font-['Manrope'] font-bold text-base text-white">
            1. Hero Banner Section
          </h2>
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">Section 1 of 10</span>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 font-bold mb-1 uppercase tracking-wider">Hero Eyebrow</label>
              <input
                type="text"
                value={content.hero.eyebrow}
                onChange={(e) => {
                  setContent({ ...content, hero: { ...content.hero, eyebrow: e.target.value } })
                  setIsDirty(true)
                }}
                className="w-full p-2.5 bg-[#0B1220] border border-[#2A3649] rounded-xl text-white font-medium"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-bold mb-1 uppercase tracking-wider">Hero Heading</label>
              <input
                type="text"
                value={content.hero.heading}
                onChange={(e) => {
                  setContent({ ...content, hero: { ...content.hero, heading: e.target.value } })
                  setIsDirty(true)
                }}
                className="w-full p-2.5 bg-[#0B1220] border border-[#2A3649] rounded-xl text-white font-medium"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-bold mb-1 uppercase tracking-wider">Hero Description</label>
            <textarea
              rows={2}
              value={content.hero.description}
              onChange={(e) => {
                setContent({ ...content, hero: { ...content.hero, description: e.target.value } })
                setIsDirty(true)
              }}
              className="w-full p-2.5 bg-[#0B1220] border border-[#2A3649] rounded-xl text-white font-medium resize-y"
            />
          </div>

          {/* Hero Image Upload */}
          <div className="space-y-2">
            <label className="block text-slate-300 font-bold uppercase tracking-wider">Hero Background Image</label>
            <input
              type="file"
              ref={heroFileInputRef}
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) handleHeroImageUpload(file)
              }}
              className="hidden"
            />
            <div className="flex items-center gap-4 p-3 bg-[#0B1220] rounded-xl border border-[#2A3649]">
              <div className="w-24 h-16 rounded-lg bg-[#1A2433] border border-[#2A3649] overflow-hidden shrink-0 relative">
                <img src={content.hero.imageSrc} alt="Hero" className="w-full h-full object-cover" />
                {isUploadingHeroImg && (
                  <div className="absolute inset-0 bg-[#0B1220]/80 flex items-center justify-center">
                    <Loader2 className="w-5 h-5 text-[#2F80ED] animate-spin" />
                  </div>
                )}
              </div>
              <button
                type="button"
                disabled={isUploadingHeroImg}
                onClick={() => heroFileInputRef.current?.click()}
                className="px-4 py-2 bg-[#2F80ED] text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-md inline-flex items-center gap-2"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Upload Hero Image from Device</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 2: COMPANY BACKGROUND & CORE FOCUS (INTRO) */}
      <div className="bg-[#1A2433] p-6 rounded-2xl border border-[#2A3649] space-y-4 shadow-xl text-xs">
        <div className="flex items-center justify-between border-b border-[#2A3649] pb-3">
          <div className="flex items-center gap-2">
            <Info className="w-5 h-5 text-[#2F80ED]" />
            <h2 className="font-['Manrope'] font-bold text-base text-white">
              2. Company Background & Core Focus
            </h2>
          </div>
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">Section 2 of 10</span>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 font-bold mb-1 uppercase tracking-wider">Intro Eyebrow</label>
              <input
                type="text"
                value={content.intro.eyebrow}
                onChange={(e) => {
                  setContent({ ...content, intro: { ...content.intro, eyebrow: e.target.value } })
                  setIsDirty(true)
                }}
                className="w-full p-2.5 bg-[#0B1220] border border-[#2A3649] rounded-xl text-white font-medium"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-bold mb-1 uppercase tracking-wider">Intro Heading</label>
              <input
                type="text"
                value={content.intro.heading}
                onChange={(e) => {
                  setContent({ ...content, intro: { ...content.intro, heading: e.target.value } })
                  setIsDirty(true)
                }}
                className="w-full p-2.5 bg-[#0B1220] border border-[#2A3649] rounded-xl text-white font-medium"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-bold mb-1 uppercase tracking-wider">Intro Paragraphs (One per line)</label>
            <textarea
              rows={4}
              value={content.intro.paragraphs.join('\n')}
              onChange={(e) => {
                const paragraphs = e.target.value.split('\n').filter(Boolean)
                setContent({ ...content, intro: { ...content.intro, paragraphs } })
                setIsDirty(true)
              }}
              className="w-full p-2.5 bg-[#0B1220] border border-[#2A3649] rounded-xl text-white font-medium resize-y"
            />
          </div>

          {/* Key Highlights Checklist */}
          <div>
            <label className="block text-slate-300 font-bold mb-1 uppercase tracking-wider">Key Highlights Checklist (One per line)</label>
            <textarea
              rows={3}
              value={(content.intro.highlights || []).join('\n')}
              onChange={(e) => {
                const highlights = e.target.value.split('\n').filter(Boolean)
                setContent({ ...content, intro: { ...content.intro, highlights } })
                setIsDirty(true)
              }}
              className="w-full p-2.5 bg-[#0B1220] border border-[#2A3649] rounded-xl text-white font-medium resize-y"
            />
          </div>

          {/* Intro Section Image Upload */}
          <div className="space-y-2">
            <label className="block text-slate-300 font-bold uppercase tracking-wider">Intro Section Image</label>
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
            <div className="flex items-center gap-4 p-3 bg-[#0B1220] rounded-xl border border-[#2A3649]">
              <div className="w-24 h-16 rounded-lg bg-[#1A2433] border border-[#2A3649] overflow-hidden shrink-0 relative">
                <img src={content.intro.imageSrc} alt="Intro" className="w-full h-full object-cover" />
                {isUploadingIntroImg && (
                  <div className="absolute inset-0 bg-[#0B1220]/80 flex items-center justify-center">
                    <Loader2 className="w-5 h-5 text-[#2F80ED] animate-spin" />
                  </div>
                )}
              </div>
              <button
                type="button"
                disabled={isUploadingIntroImg}
                onClick={() => introFileInputRef.current?.click()}
                className="px-4 py-2 bg-[#2F80ED] text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-md inline-flex items-center gap-2"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Upload Intro Image from Device</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 3: STATISTICS & HIGHLIGHTS */}
      <div className="bg-[#1A2433] p-6 rounded-2xl border border-[#2A3649] space-y-4 shadow-xl text-xs">
        <div className="flex items-center justify-between border-b border-[#2A3649] pb-3">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-[#2F80ED]" />
            <h2 className="font-['Manrope'] font-bold text-base text-white">
              3. Company Statistics & Key Metrics ({content.statistics.length})
            </h2>
          </div>
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">Section 3 of 10</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {content.statistics.map((stat, idx) => (
            <div key={stat.id || idx} className="p-4 bg-[#0B1220] rounded-xl border border-[#2A3649] space-y-2">
              <span className="text-[10px] font-mono text-[#2F80ED] font-bold uppercase block">Metric #{idx + 1}</span>
              
              <div>
                <label className="block text-slate-400 font-bold mb-1">Label</label>
                <input
                  type="text"
                  value={stat.label}
                  onChange={(e) => {
                    const updated = [...content.statistics]
                    updated[idx] = { ...updated[idx], label: e.target.value }
                    setContent({ ...content, statistics: updated })
                    setIsDirty(true)
                  }}
                  className="w-full p-2 bg-[#1A2433] border border-[#2A3649] rounded-lg text-white font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-400 font-bold mb-1">Value</label>
                  <input
                    type="text"
                    value={stat.value}
                    onChange={(e) => {
                      const updated = [...content.statistics]
                      updated[idx] = { ...updated[idx], value: e.target.value }
                      setContent({ ...content, statistics: updated })
                      setIsDirty(true)
                    }}
                    className="w-full p-2 bg-[#1A2433] border border-[#2A3649] rounded-lg text-white font-bold"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-bold mb-1">Suffix</label>
                  <input
                    type="text"
                    value={stat.suffix || ''}
                    onChange={(e) => {
                      const updated = [...content.statistics]
                      updated[idx] = { ...updated[idx], suffix: e.target.value }
                      setContent({ ...content, statistics: updated })
                      setIsDirty(true)
                    }}
                    className="w-full p-2 bg-[#1A2433] border border-[#2A3649] rounded-lg text-white font-bold"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 4: MISSION & VISION */}
      <div className="bg-[#1A2433] p-6 rounded-2xl border border-[#2A3649] space-y-4 shadow-xl text-xs">
        <div className="flex items-center justify-between border-b border-[#2A3649] pb-3">
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 text-[#2F80ED]" />
            <h2 className="font-['Manrope'] font-bold text-base text-white">
              4. Mission & Vision Statements
            </h2>
          </div>
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">Section 4 of 10</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 bg-[#0B1220] rounded-xl border border-[#2A3649] space-y-2">
            <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase block">Mission Statement</span>
            <input
              type="text"
              value={content.missionVision.mission.heading}
              onChange={(e) => {
                setContent({
                  ...content,
                  missionVision: {
                    ...content.missionVision,
                    mission: { ...content.missionVision.mission, heading: e.target.value },
                  },
                })
                setIsDirty(true)
              }}
              className="w-full p-2 bg-[#1A2433] border border-[#2A3649] rounded-lg text-white font-bold"
            />
            <textarea
              rows={3}
              value={content.missionVision.mission.description}
              onChange={(e) => {
                setContent({
                  ...content,
                  missionVision: {
                    ...content.missionVision,
                    mission: { ...content.missionVision.mission, description: e.target.value },
                  },
                })
                setIsDirty(true)
              }}
              className="w-full p-2 bg-[#1A2433] border border-[#2A3649] rounded-lg text-slate-300 resize-y"
            />
          </div>

          <div className="p-4 bg-[#0B1220] rounded-xl border border-[#2A3649] space-y-2">
            <span className="text-[10px] font-mono text-[#2F80ED] font-bold uppercase block">Vision Statement</span>
            <input
              type="text"
              value={content.missionVision.vision.heading}
              onChange={(e) => {
                setContent({
                  ...content,
                  missionVision: {
                    ...content.missionVision,
                    vision: { ...content.missionVision.vision, heading: e.target.value },
                  },
                })
                setIsDirty(true)
              }}
              className="w-full p-2 bg-[#1A2433] border border-[#2A3649] rounded-lg text-white font-bold"
            />
            <textarea
              rows={3}
              value={content.missionVision.vision.description}
              onChange={(e) => {
                setContent({
                  ...content,
                  missionVision: {
                    ...content.missionVision,
                    vision: { ...content.missionVision.vision, description: e.target.value },
                  },
                })
                setIsDirty(true)
              }}
              className="w-full p-2 bg-[#1A2433] border border-[#2A3649] rounded-lg text-slate-300 resize-y"
            />
          </div>
        </div>
      </div>

      {/* SECTION 5: WHY CHOOSE APSON */}
      <div className="bg-[#1A2433] p-6 rounded-2xl border border-[#2A3649] space-y-4 shadow-xl text-xs">
        <div className="flex items-center justify-between border-b border-[#2A3649] pb-3">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#2F80ED]" />
            <h2 className="font-['Manrope'] font-bold text-base text-white">
              5. Why Choose APSON ({content.whyChoose.items.length} Features)
            </h2>
          </div>
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">Section 5 of 10</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-slate-300 font-bold mb-1 uppercase tracking-wider">Eyebrow</label>
            <input
              type="text"
              value={content.whyChoose.eyebrow}
              onChange={(e) => {
                setContent({ ...content, whyChoose: { ...content.whyChoose, eyebrow: e.target.value } })
                setIsDirty(true)
              }}
              className="w-full p-2.5 bg-[#0B1220] border border-[#2A3649] rounded-xl text-white font-medium"
            />
          </div>
          <div>
            <label className="block text-slate-300 font-bold mb-1 uppercase tracking-wider">Heading</label>
            <input
              type="text"
              value={content.whyChoose.heading}
              onChange={(e) => {
                setContent({ ...content, whyChoose: { ...content.whyChoose, heading: e.target.value } })
                setIsDirty(true)
              }}
              className="w-full p-2.5 bg-[#0B1220] border border-[#2A3649] rounded-xl text-white font-medium"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
          {content.whyChoose.items.map((item, idx) => (
            <div key={item.id || idx} className="p-4 bg-[#0B1220] rounded-xl border border-[#2A3649] space-y-2">
              <span className="text-[10px] font-mono text-[#2F80ED] font-bold uppercase block">Feature #{idx + 1}</span>
              <input
                type="text"
                value={item.title}
                onChange={(e) => {
                  const updated = [...content.whyChoose.items]
                  updated[idx] = { ...updated[idx], title: e.target.value }
                  setContent({ ...content, whyChoose: { ...content.whyChoose, items: updated } })
                  setIsDirty(true)
                }}
                className="w-full p-2 bg-[#1A2433] border border-[#2A3649] rounded-lg text-white font-bold"
              />
              <textarea
                rows={2}
                value={item.description}
                onChange={(e) => {
                  const updated = [...content.whyChoose.items]
                  updated[idx] = { ...updated[idx], description: e.target.value }
                  setContent({ ...content, whyChoose: { ...content.whyChoose, items: updated } })
                  setIsDirty(true)
                }}
                className="w-full p-2 bg-[#1A2433] border border-[#2A3649] rounded-lg text-slate-300 resize-y"
              />
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 6: CORE VALUES */}
      <div className="bg-[#1A2433] p-6 rounded-2xl border border-[#2A3649] space-y-4 shadow-xl text-xs">
        <div className="flex items-center justify-between border-b border-[#2A3649] pb-3">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-[#2F80ED]" />
            <h2 className="font-['Manrope'] font-bold text-base text-white">
              6. Core Operational Values ({content.coreValues.items.length} Values)
            </h2>
          </div>
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">Section 6 of 10</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-slate-300 font-bold mb-1 uppercase tracking-wider">Eyebrow</label>
            <input
              type="text"
              value={content.coreValues.eyebrow}
              onChange={(e) => {
                setContent({ ...content, coreValues: { ...content.coreValues, eyebrow: e.target.value } })
                setIsDirty(true)
              }}
              className="w-full p-2.5 bg-[#0B1220] border border-[#2A3649] rounded-xl text-white font-medium"
            />
          </div>
          <div>
            <label className="block text-slate-300 font-bold mb-1 uppercase tracking-wider">Heading</label>
            <input
              type="text"
              value={content.coreValues.heading}
              onChange={(e) => {
                setContent({ ...content, coreValues: { ...content.coreValues, heading: e.target.value } })
                setIsDirty(true)
              }}
              className="w-full p-2.5 bg-[#0B1220] border border-[#2A3649] rounded-xl text-white font-medium"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
          {content.coreValues.items.map((val, idx) => (
            <div key={val.id || idx} className="p-4 bg-[#0B1220] rounded-xl border border-[#2A3649] space-y-2">
              <span className="text-[10px] font-mono text-[#2F80ED] font-bold uppercase block">Value #{idx + 1}</span>
              <input
                type="text"
                value={val.title}
                onChange={(e) => {
                  const updated = [...content.coreValues.items]
                  updated[idx] = { ...updated[idx], title: e.target.value }
                  setContent({ ...content, coreValues: { ...content.coreValues, items: updated } })
                  setIsDirty(true)
                }}
                className="w-full p-2 bg-[#1A2433] border border-[#2A3649] rounded-lg text-white font-bold"
              />
              <textarea
                rows={2}
                value={val.description}
                onChange={(e) => {
                  const updated = [...content.coreValues.items]
                  updated[idx] = { ...updated[idx], description: e.target.value }
                  setContent({ ...content, coreValues: { ...content.coreValues, items: updated } })
                  setIsDirty(true)
                }}
                className="w-full p-2 bg-[#1A2433] border border-[#2A3649] rounded-lg text-slate-300 resize-y"
              />
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 7: INDUSTRIES WE SERVE */}
      <div className="bg-[#1A2433] p-6 rounded-2xl border border-[#2A3649] space-y-4 shadow-xl text-xs">
        <div className="flex items-center justify-between border-b border-[#2A3649] pb-3">
          <div className="flex items-center gap-2">
            <Factory className="w-5 h-5 text-[#2F80ED]" />
            <h2 className="font-['Manrope'] font-bold text-base text-white">
              7. Target Industries & Sectors ({content.industries.items.length})
            </h2>
          </div>
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">Section 7 of 10</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-slate-300 font-bold mb-1 uppercase tracking-wider">Eyebrow</label>
            <input
              type="text"
              value={content.industries.eyebrow}
              onChange={(e) => {
                setContent({ ...content, industries: { ...content.industries, eyebrow: e.target.value } })
                setIsDirty(true)
              }}
              className="w-full p-2.5 bg-[#0B1220] border border-[#2A3649] rounded-xl text-white font-medium"
            />
          </div>
          <div>
            <label className="block text-slate-300 font-bold mb-1 uppercase tracking-wider">Heading</label>
            <input
              type="text"
              value={content.industries.heading}
              onChange={(e) => {
                setContent({ ...content, industries: { ...content.industries, heading: e.target.value } })
                setIsDirty(true)
              }}
              className="w-full p-2.5 bg-[#0B1220] border border-[#2A3649] rounded-xl text-white font-medium"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          {content.industries.items.map((ind, idx) => (
            <div key={ind.id || idx} className="p-4 bg-[#0B1220] rounded-xl border border-[#2A3649] space-y-2">
              <span className="text-[10px] font-mono text-[#2F80ED] font-bold uppercase block">Industry #{idx + 1}</span>
              <input
                type="text"
                value={ind.name}
                onChange={(e) => {
                  const updated = [...content.industries.items]
                  updated[idx] = { ...updated[idx], name: e.target.value }
                  setContent({ ...content, industries: { ...content.industries, items: updated } })
                  setIsDirty(true)
                }}
                className="w-full p-2 bg-[#1A2433] border border-[#2A3649] rounded-lg text-white font-bold"
              />
              <textarea
                rows={2}
                value={ind.description}
                onChange={(e) => {
                  const updated = [...content.industries.items]
                  updated[idx] = { ...updated[idx], description: e.target.value }
                  setContent({ ...content, industries: { ...content.industries, items: updated } })
                  setIsDirty(true)
                }}
                className="w-full p-2 bg-[#1A2433] border border-[#2A3649] rounded-lg text-slate-300 resize-y"
              />
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 8: QUALITY & MANUFACTURING */}
      <div className="bg-[#1A2433] p-6 rounded-2xl border border-[#2A3649] space-y-4 shadow-xl text-xs">
        <div className="flex items-center justify-between border-b border-[#2A3649] pb-3">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-[#2F80ED]" />
            <h2 className="font-['Manrope'] font-bold text-base text-white">
              8. Quality Control & Manufacturing Standards
            </h2>
          </div>
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">Section 8 of 10</span>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 font-bold mb-1 uppercase tracking-wider">Eyebrow</label>
              <input
                type="text"
                value={content.qualityManufacturing.eyebrow}
                onChange={(e) => {
                  setContent({
                    ...content,
                    qualityManufacturing: { ...content.qualityManufacturing, eyebrow: e.target.value },
                  })
                  setIsDirty(true)
                }}
                className="w-full p-2.5 bg-[#0B1220] border border-[#2A3649] rounded-xl text-white font-medium"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-bold mb-1 uppercase tracking-wider">Heading</label>
              <input
                type="text"
                value={content.qualityManufacturing.heading}
                onChange={(e) => {
                  setContent({
                    ...content,
                    qualityManufacturing: { ...content.qualityManufacturing, heading: e.target.value },
                  })
                  setIsDirty(true)
                }}
                className="w-full p-2.5 bg-[#0B1220] border border-[#2A3649] rounded-xl text-white font-medium"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-bold mb-1 uppercase tracking-wider">Paragraphs (One per line)</label>
            <textarea
              rows={3}
              value={content.qualityManufacturing.paragraphs.join('\n')}
              onChange={(e) => {
                const paragraphs = e.target.value.split('\n').filter(Boolean)
                setContent({
                  ...content,
                  qualityManufacturing: { ...content.qualityManufacturing, paragraphs },
                })
                setIsDirty(true)
              }}
              className="w-full p-2.5 bg-[#0B1220] border border-[#2A3649] rounded-xl text-white font-medium resize-y"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-bold mb-1 uppercase tracking-wider">Quality Features Checklist (One per line)</label>
            <textarea
              rows={3}
              value={content.qualityManufacturing.featureList.join('\n')}
              onChange={(e) => {
                const featureList = e.target.value.split('\n').filter(Boolean)
                setContent({
                  ...content,
                  qualityManufacturing: { ...content.qualityManufacturing, featureList },
                })
                setIsDirty(true)
              }}
              className="w-full p-2.5 bg-[#0B1220] border border-[#2A3649] rounded-xl text-white font-medium resize-y"
            />
          </div>

          {/* Quality Image Upload */}
          <div className="space-y-2">
            <label className="block text-slate-300 font-bold uppercase tracking-wider">Facility Image</label>
            <input
              type="file"
              ref={qualityFileInputRef}
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) handleQualityImageUpload(file)
              }}
              className="hidden"
            />
            <div className="flex items-center gap-4 p-3 bg-[#0B1220] rounded-xl border border-[#2A3649]">
              <div className="w-24 h-16 rounded-lg bg-[#1A2433] border border-[#2A3649] overflow-hidden shrink-0 relative">
                <img src={content.qualityManufacturing.imageSrc} alt="Quality" className="w-full h-full object-cover" />
                {isUploadingQualityImg && (
                  <div className="absolute inset-0 bg-[#0B1220]/80 flex items-center justify-center">
                    <Loader2 className="w-5 h-5 text-[#2F80ED] animate-spin" />
                  </div>
                )}
              </div>
              <button
                type="button"
                disabled={isUploadingQualityImg}
                onClick={() => qualityFileInputRef.current?.click()}
                className="px-4 py-2 bg-[#2F80ED] text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-md inline-flex items-center gap-2"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Upload Facility Image from Device</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 9: COMPANY JOURNEY & MILESTONES */}
      <div className="bg-[#1A2433] p-6 rounded-2xl border border-[#2A3649] space-y-4 shadow-xl text-xs">
        <div className="flex items-center justify-between border-b border-[#2A3649] pb-3">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-[#2F80ED]" />
            <h2 className="font-['Manrope'] font-bold text-base text-white">
              9. Company Journey & Timeline Milestones ({content.milestones.items.length})
            </h2>
          </div>
          <button
            type="button"
            onClick={() => {
              const newItem = {
                id: `m-${Date.now()}`,
                year: `Phase ${content.milestones.items.length + 1}`,
                title: 'New Milestone Title',
                description: 'Description of operational milestone.',
                displayOrder: content.milestones.items.length + 1,
                isVisible: true,
              }
              setContent({
                ...content,
                milestones: { ...content.milestones, items: [...content.milestones.items, newItem] },
              })
              setIsDirty(true)
            }}
            className="px-3.5 py-1.5 bg-[#2F80ED] hover:bg-[#1d6ed8] text-white text-xs font-bold rounded-lg transition-colors inline-flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Milestone</span>
          </button>
        </div>

        <div className="space-y-3">
          {content.milestones.items.map((ms, idx) => (
            <div key={ms.id || idx} className="p-4 bg-[#0B1220] rounded-xl border border-[#2A3649] space-y-2">
              <div className="flex items-center justify-between">
                <input
                  type="text"
                  value={ms.year}
                  onChange={(e) => {
                    const updated = [...content.milestones.items]
                    updated[idx] = { ...updated[idx], year: e.target.value }
                    setContent({ ...content, milestones: { ...content.milestones, items: updated } })
                    setIsDirty(true)
                  }}
                  className="p-1 bg-[#1A2433] border border-[#2A3649] rounded font-mono text-[#2F80ED] font-bold text-xs"
                />
                <button
                  type="button"
                  onClick={() => {
                    const updated = content.milestones.items.filter((_, i) => i !== idx)
                    setContent({ ...content, milestones: { ...content.milestones, items: updated } })
                    setIsDirty(true)
                  }}
                  className="p-1 text-slate-400 hover:text-rose-400 transition-colors"
                  title="Remove milestone"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <input
                type="text"
                value={ms.title}
                onChange={(e) => {
                  const updated = [...content.milestones.items]
                  updated[idx] = { ...updated[idx], title: e.target.value }
                  setContent({ ...content, milestones: { ...content.milestones, items: updated } })
                  setIsDirty(true)
                }}
                className="w-full p-2 bg-[#1A2433] border border-[#2A3649] rounded-lg text-white font-bold"
              />
              <textarea
                rows={2}
                value={ms.description}
                onChange={(e) => {
                  const updated = [...content.milestones.items]
                  updated[idx] = { ...updated[idx], description: e.target.value }
                  setContent({ ...content, milestones: { ...content.milestones, items: updated } })
                  setIsDirty(true)
                }}
                className="w-full p-2 bg-[#1A2433] border border-[#2A3649] rounded-lg text-slate-300 resize-y"
              />
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 10: BOTTOM CONTACT CTA BANNER */}
      <div className="bg-[#1A2433] p-6 rounded-2xl border border-[#2A3649] space-y-4 shadow-xl text-xs">
        <div className="flex items-center justify-between border-b border-[#2A3649] pb-3">
          <div className="flex items-center gap-2">
            <Mail className="w-5 h-5 text-[#2F80ED]" />
            <h2 className="font-['Manrope'] font-bold text-base text-white">
              10. Bottom Contact Call-to-Action Banner
            </h2>
          </div>
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">Section 10 of 10</span>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 font-bold mb-1 uppercase tracking-wider">CTA Eyebrow</label>
              <input
                type="text"
                value={content.cta.eyebrow}
                onChange={(e) => {
                  setContent({ ...content, cta: { ...content.cta, eyebrow: e.target.value } })
                  setIsDirty(true)
                }}
                className="w-full p-2.5 bg-[#0B1220] border border-[#2A3649] rounded-xl text-white font-medium"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-bold mb-1 uppercase tracking-wider">CTA Heading</label>
              <input
                type="text"
                value={content.cta.heading}
                onChange={(e) => {
                  setContent({ ...content, cta: { ...content.cta, heading: e.target.value } })
                  setIsDirty(true)
                }}
                className="w-full p-2.5 bg-[#0B1220] border border-[#2A3649] rounded-xl text-white font-medium"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-bold mb-1 uppercase tracking-wider">CTA Description</label>
            <textarea
              rows={2}
              value={content.cta.description}
              onChange={(e) => {
                setContent({ ...content, cta: { ...content.cta, description: e.target.value } })
                setIsDirty(true)
              }}
              className="w-full p-2.5 bg-[#0B1220] border border-[#2A3649] rounded-xl text-white font-medium resize-y"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-3 bg-[#0B1220] rounded-xl border border-[#2A3649] space-y-2">
              <span className="text-[10px] font-mono text-[#2F80ED] font-bold uppercase block">Primary Button</span>
              <input
                type="text"
                value={content.cta.primaryCtaText}
                onChange={(e) => {
                  setContent({ ...content, cta: { ...content.cta, primaryCtaText: e.target.value } })
                  setIsDirty(true)
                }}
                className="w-full p-2 bg-[#1A2433] border border-[#2A3649] rounded-lg text-white font-bold"
              />
              <input
                type="text"
                value={content.cta.primaryCtaHref}
                onChange={(e) => {
                  setContent({ ...content, cta: { ...content.cta, primaryCtaHref: e.target.value } })
                  setIsDirty(true)
                }}
                className="w-full p-2 bg-[#1A2433] border border-[#2A3649] rounded-lg text-slate-300 font-mono"
              />
            </div>

            <div className="p-3 bg-[#0B1220] rounded-xl border border-[#2A3649] space-y-2">
              <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase block">Secondary Button</span>
              <input
                type="text"
                value={content.cta.secondaryCtaText}
                onChange={(e) => {
                  setContent({ ...content, cta: { ...content.cta, secondaryCtaText: e.target.value } })
                  setIsDirty(true)
                }}
                className="w-full p-2 bg-[#1A2433] border border-[#2A3649] rounded-lg text-white font-bold"
              />
              <input
                type="text"
                value={content.cta.secondaryCtaHref}
                onChange={(e) => {
                  setContent({ ...content, cta: { ...content.cta, secondaryCtaHref: e.target.value } })
                  setIsDirty(true)
                }}
                className="w-full p-2 bg-[#1A2433] border border-[#2A3649] rounded-lg text-slate-300 font-mono"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
