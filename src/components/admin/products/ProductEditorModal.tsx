import { useState, useEffect, useRef } from 'react'
import { X, Boxes, Plus, Trash2, Check, Loader2, AlertCircle, Upload, Image as ImageIcon, Link as LinkIcon } from 'lucide-react'
import type { ProductRecord } from '@/types/products'
import { storageService } from '@/services/storageService'

interface ProductEditorModalProps {
  isOpen: boolean
  initialData?: ProductRecord | null
  categories: string[]
  onClose: () => void
  onSave: (product: Omit<ProductRecord, 'id' | 'created_at' | 'updated_at'> & { id?: string }) => Promise<void>
}

export function ProductEditorModal({
  isOpen,
  initialData,
  categories,
  onClose,
  onSave,
}: ProductEditorModalProps) {
  const isEditing = Boolean(initialData?.id)
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const [name, setName] = useState('')
  const [slug, setSlug] = useState('')
  const [category, setCategory] = useState('')
  const [customCategory, setCustomCategory] = useState('')
  const [useCustomCat, setUseCustomCat] = useState(false)
  const [shortDescription, setShortDescription] = useState('')
  const [imageSrc, setImageSrc] = useState('')
  const [imageAlt, setImageAlt] = useState('')
  const [highlights, setHighlights] = useState<string[]>([])
  const [newHighlightText, setNewHighlightText] = useState('')
  const [isPublished, setIsPublished] = useState(true)
  const [isFeatured, setIsFeatured] = useState(true)
  const [displayOrder, setDisplayOrder] = useState(1)

  const [isUploadingImage, setIsUploadingImage] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setName(initialData.name || '')
        setSlug(initialData.slug || '')
        setCategory(initialData.category || categories[0] || 'Vibration Testing Systems')
        setShortDescription(initialData.short_description || '')
        setImageSrc(initialData.image_src || '')
        setImageAlt(initialData.image_alt || initialData.name || '')
        setHighlights(initialData.highlights || [])
        setIsPublished(initialData.is_published ?? true)
        setIsFeatured(initialData.is_featured ?? true)
        setDisplayOrder(initialData.display_order || 1)
        setUseCustomCat(false)
      } else {
        setName('')
        setSlug('')
        setCategory(categories[0] || 'Vibration Testing Systems')
        setShortDescription('')
        setImageSrc('')
        setImageAlt('')
        setHighlights(['High Precision Testing Capability', 'Digital Control Interface'])
        setIsPublished(true)
        setIsFeatured(true)
        setDisplayOrder(1)
        setUseCustomCat(false)
      }
      setError(null)
    }
  }, [isOpen, initialData, categories])

  if (!isOpen) return null

  const handleNameChange = (val: string) => {
    setName(val)
    if (!isEditing && !slug) {
      const autoSlug = val
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
      setSlug(autoSlug)
    }
  }

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploadingImage(true)
    setError(null)

    const res = await storageService.uploadImage(file, 'products')
    if (res.url) {
      setImageSrc(res.url)
      if (!imageAlt) setImageAlt(name || file.name.split('.')[0])
    } else if (res.error) {
      setError(res.error.message)
    }
    setIsUploadingImage(false)
  }

  const handleAddHighlight = () => {
    if (newHighlightText.trim()) {
      setHighlights([...highlights, newHighlightText.trim()])
      setNewHighlightText('')
    }
  }

  const handleRemoveHighlight = (index: number) => {
    setHighlights(highlights.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!name.trim()) {
      setError('Product Name is required.')
      return
    }

    if (!slug.trim()) {
      setError('Product Slug is required.')
      return
    }

    const selectedCat = useCustomCat ? customCategory.trim() : category
    if (!selectedCat) {
      setError('Please select or specify a Product Category.')
      return
    }

    if (!shortDescription.trim()) {
      setError('Short Description is required.')
      return
    }

    if (!imageSrc.trim()) {
      setError('Please upload a product image from your device.')
      return
    }

    const formattedSlug = slug.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')

    setIsSubmitting(true)
    try {
      await onSave({
        id: initialData?.id,
        name: name.trim(),
        slug: formattedSlug,
        category: selectedCat,
        short_description: shortDescription.trim(),
        image_src: imageSrc.trim(),
        image_alt: imageAlt.trim() || name.trim(),
        highlights,
        is_published: isPublished,
        is_featured: isFeatured,
        display_order: Number(displayOrder) || 1,
      })
      onClose()
    } catch (err: any) {
      setError(err?.message || 'Failed to save product. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-[#0B1220]/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#1A2433] border border-[#2A3649] rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-6 border-b border-[#2A3649] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-[#2F80ED]/20 text-[#2F80ED]">
              <Boxes className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-['Manrope'] font-extrabold text-white text-lg">
                {isEditing ? 'Edit Product' : 'Add New Product'}
              </h2>
              <p className="text-slate-400 text-xs">Configure industrial equipment specifications and upload product photos.</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-[#0B1220]">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mx-6 mt-4 p-3.5 bg-rose-950/80 border border-rose-600/50 rounded-xl text-xs text-rose-200 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5 text-xs flex-1" noValidate>
          
          {/* Product Name & Slug */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 font-bold mb-1 uppercase tracking-wider">
                Product Name <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="e.g. Vibration Test Head Expander"
                required
                className="w-full p-2.5 bg-[#0B1220] border border-[#2A3649] rounded-xl text-white font-medium focus:outline-none focus:border-[#2F80ED]"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-bold mb-1 uppercase tracking-wider">
                Product Slug <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="vibration-test-head-expander"
                required
                className="w-full p-2.5 bg-[#0B1220] border border-[#2A3649] rounded-xl text-white font-mono text-xs focus:outline-none focus:border-[#2F80ED]"
              />
            </div>
          </div>

          {/* Category Selection */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-slate-300 font-bold uppercase tracking-wider">
                Category <span className="text-rose-400">*</span>
              </label>
              <button
                type="button"
                onClick={() => setUseCustomCat(!useCustomCat)}
                className="text-[#2F80ED] hover:underline font-bold text-[11px]"
              >
                {useCustomCat ? 'Select Existing Category' : '+ Enter Custom Category'}
              </button>
            </div>
            {useCustomCat ? (
              <input
                type="text"
                value={customCategory}
                onChange={(e) => setCustomCategory(e.target.value)}
                placeholder="e.g. Thermal Chamber Equipment"
                className="w-full p-2.5 bg-[#0B1220] border border-[#2A3649] rounded-xl text-white font-medium"
              />
            ) : (
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full p-2.5 bg-[#0B1220] border border-[#2A3649] rounded-xl text-white font-medium"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Short Description */}
          <div>
            <label className="block text-slate-300 font-bold mb-1 uppercase tracking-wider">
              Short Description <span className="text-rose-400">*</span>
            </label>
            <textarea
              rows={3}
              value={shortDescription}
              onChange={(e) => setShortDescription(e.target.value)}
              placeholder="Brief overview of technical specifications and application..."
              required
              className="w-full p-2.5 bg-[#0B1220] border border-[#2A3649] rounded-xl text-white font-medium resize-y"
            />
          </div>

          {/* Product Image Upload from Device & Dynamic Live Preview */}
          <div className="space-y-2">
            <label className="block text-slate-300 font-bold uppercase tracking-wider">
              Product Image <span className="text-rose-400">*</span>
            </label>

            {/* Hidden File Input */}
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />

            <div className="flex flex-col sm:flex-row items-center gap-4 p-4 bg-[#0B1220] rounded-xl border border-[#2A3649]">
              {/* Dynamic Live Image Preview Box */}
              <div className="w-24 h-24 rounded-xl bg-[#1A2433] border border-[#2A3649] overflow-hidden shrink-0 flex items-center justify-center relative group">
                {imageSrc ? (
                  <>
                    <img src={imageSrc} alt="Product Preview" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => setImageSrc('')}
                      className="absolute top-1 right-1 p-1 bg-rose-600/90 hover:bg-rose-600 text-white rounded-md opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Remove Photo"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </>
                ) : (
                  <div className="text-center p-2 text-slate-500">
                    <ImageIcon className="w-8 h-8 mx-auto mb-1" />
                    <span className="text-[9px] block">No Image</span>
                  </div>
                )}
                {isUploadingImage && (
                  <div className="absolute inset-0 bg-[#0B1220]/80 backdrop-blur-xs flex items-center justify-center">
                    <Loader2 className="w-6 h-6 text-[#2F80ED] animate-spin" />
                  </div>
                )}
              </div>

              {/* Upload Actions & URL Input */}
              <div className="flex-1 space-y-3 text-center sm:text-left w-full">
                <div className="flex flex-wrap items-center gap-2 justify-center sm:justify-start">
                  <button
                    type="button"
                    disabled={isUploadingImage}
                    onClick={() => fileInputRef.current?.click()}
                    className="px-5 py-2.5 bg-[#2F80ED] hover:bg-[#1d6ed8] text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-md transition-all inline-flex items-center gap-2 disabled:opacity-50"
                  >
                    {isUploadingImage ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                    <span>Upload Image from Device</span>
                  </button>

                  {imageSrc && (
                    <button
                      type="button"
                      onClick={() => setImageSrc('')}
                      className="px-3 py-2.5 bg-[#1A2433] hover:bg-rose-950/50 text-slate-300 hover:text-rose-300 text-xs font-bold rounded-xl border border-[#2A3649] transition-all"
                    >
                      Clear Image
                    </button>
                  )}
                </div>

                {/* Editable Image URL Input */}
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-slate-500">
                    <LinkIcon className="w-3.5 h-3.5" />
                  </div>
                  <input
                    type="text"
                    value={imageSrc}
                    onChange={(e) => setImageSrc(e.target.value)}
                    placeholder="Or enter image URL (e.g. /images/products/shaker.jpg)"
                    className="w-full pl-8 pr-3 py-1.5 bg-[#1A2433] border border-[#2A3649] rounded-lg text-white font-mono text-[11px] focus:outline-none focus:border-[#2F80ED]"
                  />
                </div>

                <p className="text-slate-400 text-[11px]">
                  Select photo directly from your computer/phone or enter image URL.
                </p>
              </div>
            </div>

            {/* Image Alt Text */}
            <div className="pt-1">
              <label className="block text-slate-400 font-bold mb-1 uppercase tracking-wider text-[10px]">
                Image Alt Text
              </label>
              <input
                type="text"
                value={imageAlt}
                onChange={(e) => setImageAlt(e.target.value)}
                placeholder="Product description for image accessibility"
                className="w-full p-2 bg-[#0B1220] border border-[#2A3649] rounded-lg text-white font-medium text-xs"
              />
            </div>
          </div>

          {/* Key Highlights Checklist */}
          <div className="space-y-2">
            <label className="block text-slate-300 font-bold uppercase tracking-wider">Key Highlights Checklist</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={newHighlightText}
                onChange={(e) => setNewHighlightText(e.target.value)}
                placeholder="Add key feature bullet (e.g. Up to +4000 Kgf Thrust Rating)"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    handleAddHighlight()
                  }
                }}
                className="flex-1 p-2.5 bg-[#0B1220] border border-[#2A3649] rounded-xl text-white font-medium"
              />
              <button
                type="button"
                onClick={handleAddHighlight}
                className="px-4 py-2.5 bg-[#2F80ED] hover:bg-[#1d6ed8] text-white font-bold rounded-xl"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-1.5 pt-1">
              {highlights.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between p-2 bg-[#0B1220] rounded-lg border border-[#2A3649] text-slate-200">
                  <span className="truncate">{item}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveHighlight(idx)}
                    className="p-1 text-slate-400 hover:text-rose-400"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Status & Display Order */}
          <div className="pt-3 border-t border-[#2A3649] grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="is-published"
                checked={isPublished}
                onChange={(e) => setIsPublished(e.target.checked)}
                className="w-4 h-4 rounded bg-[#0B1220] border-[#2A3649] text-[#2F80ED] focus:ring-[#2F80ED]"
              />
              <label htmlFor="is-published" className="text-slate-300 font-bold cursor-pointer">
                Published Live
              </label>
            </div>

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="is-featured"
                checked={isFeatured}
                onChange={(e) => setIsFeatured(e.target.checked)}
                className="w-4 h-4 rounded bg-[#0B1220] border-[#2A3649] text-[#2F80ED] focus:ring-[#2F80ED]"
              />
              <label htmlFor="is-featured" className="text-slate-300 font-bold cursor-pointer">
                Featured on Home
              </label>
            </div>

            <div>
              <label className="block text-slate-300 font-bold mb-1 uppercase tracking-wider">Display Order</label>
              <input
                type="number"
                min={1}
                value={displayOrder}
                onChange={(e) => setDisplayOrder(Number(e.target.value) || 1)}
                className="w-full p-2 bg-[#0B1220] border border-[#2A3649] rounded-lg text-white font-medium"
              />
            </div>
          </div>

          {/* Modal Actions Footer */}
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
              disabled={isSubmitting || isUploadingImage}
              className="px-5 py-2.5 bg-[#2F80ED] hover:bg-[#1d6ed8] text-white rounded-xl font-bold uppercase tracking-wider shadow-md flex items-center gap-2"
            >
              {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
              <span>{isEditing ? 'Update Product' : 'Save Product'}</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  )
}
