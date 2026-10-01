import { useState, useEffect, useCallback, useMemo, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  ExternalLink,
  Save,
  Plus,
  Search,
  Pencil,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Loader2,
  FileText,
  Boxes,
  Star,
  Eye,
  EyeOff,
  Layers,
  Upload,
} from 'lucide-react'
import type { ProductRecord, ProductsPageContentPayload } from '@/types/products'
import { productService } from '@/services/productService'
import { storageService } from '@/services/storageService'
import { ProductEditorModal } from '@/components/admin/products/ProductEditorModal'
import { ProductDeleteDialog } from '@/components/admin/products/ProductDeleteDialog'
import { CategoryManagerModal } from '@/components/admin/products/CategoryManagerModal'

export function ProductsPageEditorPage() {
  const navigate = useNavigate()
  const heroFileInputRef = useRef<HTMLInputElement | null>(null)
  const pdfFileInputRefs = useRef<Record<string, HTMLInputElement | null>>({})

  const [activeTab, setActiveTab] = useState<'content' | 'catalogue'>('content')

  // Page Content State
  const [pageContent, setPageContent] = useState<ProductsPageContentPayload | null>(null)
  const [isContentDirty, setIsContentDirty] = useState(false)
  const [isSavingContent, setIsSavingContent] = useState(false)
  const [isUploadingHeroImg, setIsUploadingHeroImg] = useState(false)
  const [uploadingPdfId, setUploadingPdfId] = useState<string | null>(null)

  // Products Catalogue State
  const [products, setProducts] = useState<ProductRecord[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Filters
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCat, setSelectedCat] = useState('All')
  const [selectedStatus] = useState<'all' | 'published' | 'draft' | 'featured'>('all')

  // Modals
  const [isProductModalOpen, setIsProductModalOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<ProductRecord | null>(null)

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [deletingProduct, setDeletingProduct] = useState<ProductRecord | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const [isCatModalOpen, setIsCatModalOpen] = useState(false)

  // Toast Alerts
  const [toastMessage, setToastMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => setToastMessage(null), 3500)
      return () => clearTimeout(timer)
    }
  }, [toastMessage])

  // Fetch Products & Page Content
  const loadData = useCallback(async () => {
    setIsLoading(true)
    const [contentRes, productsRes] = await Promise.all([
      productService.getProductsPageContent(),
      productService.getAllProducts(),
    ])

    if (contentRes.data) {
      setPageContent(contentRes.data)
      setIsContentDirty(false)
    }
    if (productsRes.data) {
      setProducts(productsRes.data)
    }
    setIsLoading(false)
  }, [])

  useEffect(() => {
    loadData()
  }, [loadData])

  // Categories list derived from products or pageContent
  const availableCategories = useMemo(() => {
    const defaultCats = [
      'Vibration Testing Systems',
      'Mechanical Testing Equipment',
      'Environmental Testing Equipment',
      'Industrial Equipment',
    ]

    const fromProducts = Array.from(new Set(products.map((p) => p.category)))
    const fromContent = pageContent?.categories || []

    const merged = Array.from(new Set([...defaultCats, ...fromContent, ...fromProducts]))
    return merged.filter(Boolean)
  }, [products, pageContent?.categories])

  // Save Page Content Payload
  const handleSavePageContent = async () => {
    if (!pageContent) return
    setIsSavingContent(true)

    const res = await productService.saveProductsPageContent(pageContent)
    if (res.error) {
      setToastMessage({ type: 'error', text: 'Failed to save page content.' })
    } else {
      setIsContentDirty(false)
      setToastMessage({ type: 'success', text: 'Products page content saved successfully!' })
    }
    setIsSavingContent(false)
  }

  // Handle Hero Image File Upload
  const handleHeroImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !pageContent) return

    setIsUploadingHeroImg(true)
    const res = await storageService.uploadImage(file, 'heroes')

    if (res.url) {
      setPageContent({
        ...pageContent,
        hero: {
          ...pageContent.hero,
          imageSrc: res.url,
        },
      })
      setIsContentDirty(true)
      setToastMessage({ type: 'success', text: 'Hero background image uploaded!' })
    } else if (res.error) {
      setToastMessage({ type: 'error', text: res.error.message })
    }
    setIsUploadingHeroImg(false)
  }

  // Handle PDF Brochure Upload
  const handlePdfUpload = async (brochureId: string, file: File) => {
    if (!pageContent) return
    setUploadingPdfId(brochureId)

    const res = await storageService.uploadPdf(file, 'brochures')
    if (res.url) {
      const currentBrochures = pageContent.brochures || []
      const updated = currentBrochures.map((b) =>
        b.id === brochureId ? { ...b, pdfUrl: res.url! } : b
      )
      setPageContent({ ...pageContent, brochures: updated })
      setIsContentDirty(true)
      setToastMessage({ type: 'success', text: 'PDF Brochure uploaded successfully!' })
    } else if (res.error) {
      setToastMessage({ type: 'error', text: res.error.message })
    }
    setUploadingPdfId(null)
  }

  // Product CRUD Handlers
  const handleSaveProduct = async (productData: Omit<ProductRecord, 'id' | 'created_at' | 'updated_at'>) => {
    if (editingProduct) {
      const res = await productService.updateProduct(editingProduct.id, productData)
      if (res.data) {
        setProducts(products.map((p) => (p.id === editingProduct.id ? res.data! : p)))
        setToastMessage({ type: 'success', text: `Product "${res.data.name}" updated successfully.` })
      } else {
        setToastMessage({ type: 'error', text: 'Failed to update product.' })
      }
    } else {
      const res = await productService.createProduct(productData)
      if (res.data) {
        setProducts([...products, res.data])
        setToastMessage({ type: 'success', text: `Product "${res.data.name}" created successfully.` })
      } else {
        setToastMessage({ type: 'error', text: 'Failed to create product.' })
      }
    }
  }

  const handleTogglePublish = async (product: ProductRecord) => {
    const updatedStatus = !product.is_published
    const res = await productService.updateProduct(product.id, { is_published: updatedStatus })
    if (res.data) {
      setProducts(products.map((p) => (p.id === product.id ? res.data! : p)))
      setToastMessage({
        type: 'success',
        text: `Product "${product.name}" ${updatedStatus ? 'published' : 'unpublished'}.`,
      })
    }
  }

  const handleToggleFeatured = async (product: ProductRecord) => {
    const updatedFeatured = !product.is_featured
    const res = await productService.updateProduct(product.id, { is_featured: updatedFeatured })
    if (res.data) {
      setProducts(products.map((p) => (p.id === product.id ? res.data! : p)))
      setToastMessage({
        type: 'success',
        text: `Product "${product.name}" ${updatedFeatured ? 'marked as featured' : 'unfeatured'}.`,
      })
    }
  }

  const handleConfirmDelete = async () => {
    if (!deletingProduct) return
    setIsDeleting(true)
    const res = await productService.deleteProduct(deletingProduct.id)
    if (!res.error) {
      setProducts(products.filter((p) => p.id !== deletingProduct.id))
      setToastMessage({ type: 'success', text: `Product "${deletingProduct.name}" deleted.` })
    } else {
      setToastMessage({ type: 'error', text: 'Failed to delete product.' })
    }
    setIsDeleting(false)
    setIsDeleteModalOpen(false)
    setDeletingProduct(null)
  }

  const handleSaveCategories = async (newCategories: string[]) => {
    if (!pageContent) return
    const updated = { ...pageContent, categories: newCategories }
    setPageContent(updated)
    setIsContentDirty(true)
    await productService.saveProductsPageContent(updated)
    setToastMessage({ type: 'success', text: 'Categories list updated.' })
  }

  // Filtered products list
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesCat = selectedCat === 'All' || p.category === selectedCat

      let matchesStatus = true
      if (selectedStatus === 'published') matchesStatus = p.is_published
      if (selectedStatus === 'draft') matchesStatus = !p.is_published
      if (selectedStatus === 'featured') matchesStatus = p.is_featured

      const query = searchQuery.toLowerCase().trim()
      if (!query) return matchesCat && matchesStatus

      const matchesName = p.name.toLowerCase().includes(query)
      const matchesCategory = p.category.toLowerCase().includes(query)
      const matchesDesc = p.short_description.toLowerCase().includes(query)

      return matchesCat && matchesStatus && (matchesName || matchesCategory || matchesDesc)
    })
  }, [products, selectedCat, selectedStatus, searchQuery])

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

      {/* Header Banner */}
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
              Products Page Editor
            </h1>
            {isContentDirty && (
              <span className="px-2.5 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-400 font-mono text-[10px] font-bold uppercase tracking-wider animate-pulse">
                Unsaved Changes
              </span>
            )}
          </div>
          <p className="text-slate-400 text-xs pl-9">
            Manage page header content, PDF brochures, category filters, and product catalogue.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <a
            href="/products"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#0B1220] hover:bg-[#2F80ED] text-white text-xs font-bold rounded-xl border border-[#2A3649] transition-all"
          >
            <span>View Live Page</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          {activeTab === 'content' && (
            <button
              onClick={handleSavePageContent}
              disabled={isSavingContent}
              className="inline-flex items-center gap-2 px-5 py-2 bg-[#2F80ED] hover:bg-[#1d6ed8] text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-md transition-all disabled:opacity-50"
            >
              {isSavingContent ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
              <span>Save Content</span>
            </button>
          )}
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center border-b border-[#2A3649] gap-4 font-['Manrope'] font-bold text-xs uppercase tracking-wider">
        <button
          onClick={() => setActiveTab('content')}
          className={`pb-3 px-1 border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'content'
              ? 'border-[#2F80ED] text-[#2F80ED]'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Page Content & Headers</span>
        </button>

        <button
          onClick={() => setActiveTab('catalogue')}
          className={`pb-3 px-1 border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'catalogue'
              ? 'border-[#2F80ED] text-[#2F80ED]'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <Boxes className="w-4 h-4" />
          <span>Products Catalogue ({products.length})</span>
        </button>
      </div>

      {/* TAB 1: PAGE CONTENT EDITOR */}
      {activeTab === 'content' && pageContent && (
        <div className="space-y-6">
          {/* Hero Section Card */}
          <div className="bg-[#1A2433] p-6 rounded-2xl border border-[#2A3649] space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-[#2A3649] pb-3">
              <h2 className="font-['Manrope'] font-bold text-base text-white">
                Hero Section Content
              </h2>
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">
                Top Banner
              </span>
            </div>

            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-bold mb-1 uppercase tracking-wider">Eyebrow</label>
                  <input
                    type="text"
                    value={pageContent.hero.eyebrow}
                    onChange={(e) => {
                      setPageContent({ ...pageContent, hero: { ...pageContent.hero, eyebrow: e.target.value } })
                      setIsContentDirty(true)
                    }}
                    className="w-full p-2.5 bg-[#0B1220] border border-[#2A3649] rounded-xl text-white font-medium"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-bold mb-1 uppercase tracking-wider">Breadcrumb Text</label>
                  <input
                    type="text"
                    value={pageContent.hero.breadcrumbText}
                    onChange={(e) => {
                      setPageContent({ ...pageContent, hero: { ...pageContent.hero, breadcrumbText: e.target.value } })
                      setIsContentDirty(true)
                    }}
                    className="w-full p-2.5 bg-[#0B1220] border border-[#2A3649] rounded-xl text-white font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1 uppercase tracking-wider">Heading</label>
                <input
                  type="text"
                  value={pageContent.hero.heading}
                  onChange={(e) => {
                    setPageContent({ ...pageContent, hero: { ...pageContent.hero, heading: e.target.value } })
                    setIsContentDirty(true)
                  }}
                  className="w-full p-2.5 bg-[#0B1220] border border-[#2A3649] rounded-xl text-white font-medium"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1 uppercase tracking-wider">Description</label>
                <textarea
                  rows={3}
                  value={pageContent.hero.description}
                  onChange={(e) => {
                    setPageContent({ ...pageContent, hero: { ...pageContent.hero, description: e.target.value } })
                    setIsContentDirty(true)
                  }}
                  className="w-full p-2.5 bg-[#0B1220] border border-[#2A3649] rounded-xl text-white font-medium resize-y"
                />
              </div>

              {/* Hero Image File Upload */}
              <div className="space-y-2">
                <label className="block text-slate-300 font-bold uppercase tracking-wider">Hero Background Image</label>
                <input
                  type="file"
                  ref={heroFileInputRef}
                  accept="image/*"
                  onChange={handleHeroImageUpload}
                  className="hidden"
                />
                <div className="flex flex-col sm:flex-row items-center gap-4 p-4 bg-[#0B1220] rounded-xl border border-[#2A3649]">
                  <div className="w-24 h-16 rounded-lg bg-[#1A2433] border border-[#2A3649] overflow-hidden shrink-0 flex items-center justify-center relative">
                    <img src={pageContent.hero.imageSrc} alt="Hero Preview" className="w-full h-full object-cover opacity-60" />
                    {isUploadingHeroImg && (
                      <div className="absolute inset-0 bg-[#0B1220]/80 backdrop-blur-xs flex items-center justify-center">
                        <Loader2 className="w-5 h-5 text-[#2F80ED] animate-spin" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 space-y-2 text-center sm:text-left">
                    <button
                      type="button"
                      disabled={isUploadingHeroImg}
                      onClick={() => heroFileInputRef.current?.click()}
                      className="px-4 py-2 bg-[#2F80ED] hover:bg-[#1d6ed8] text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-md transition-all inline-flex items-center gap-2 disabled:opacity-50"
                    >
                      {isUploadingHeroImg ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
                      <span>Upload Hero Image from Device</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Product Brochures Manager Card */}
          <div className="bg-[#1A2433] p-6 rounded-2xl border border-[#2A3649] space-y-4 shadow-xl text-xs">
            <div className="flex items-center justify-between border-b border-[#2A3649] pb-3">
              <div>
                <h2 className="font-['Manrope'] font-bold text-base text-white">
                  Product PDF Brochures Manager
                </h2>
                <p className="text-slate-400 text-xs mt-0.5">Brochure titles, descriptions, and PDF document files.</p>
              </div>
              <span className="text-[10px] font-mono text-[#2F80ED] uppercase tracking-widest font-bold">
                {pageContent.brochures?.length || 0} Brochures Active
              </span>
            </div>

            <div className="space-y-4">
              {(pageContent.brochures || []).map((brochure, idx) => (
                <div key={brochure.id} className="p-4 bg-[#0B1220] rounded-xl border border-[#2A3649] space-y-3">
                  <div className="flex items-center justify-between font-mono text-[11px] font-bold text-[#2F80ED]">
                    <span>Brochure #{idx + 1}</span>
                    <span>{brochure.pdfUrl}</span>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-slate-300 font-bold uppercase tracking-wider">Brochure Title</label>
                    <input
                      type="text"
                      value={brochure.title}
                      onChange={(e) => {
                        const updated = (pageContent.brochures || []).map((b) =>
                          b.id === brochure.id ? { ...b, title: e.target.value } : b
                        )
                        setPageContent({ ...pageContent, brochures: updated })
                        setIsContentDirty(true)
                      }}
                      className="w-full p-2.5 bg-[#1A2433] border border-[#2A3649] rounded-xl text-white font-medium"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-slate-300 font-bold uppercase tracking-wider">Brochure Description</label>
                    <textarea
                      rows={2}
                      value={brochure.description}
                      onChange={(e) => {
                        const updated = (pageContent.brochures || []).map((b) =>
                          b.id === brochure.id ? { ...b, description: e.target.value } : b
                        )
                        setPageContent({ ...pageContent, brochures: updated })
                        setIsContentDirty(true)
                      }}
                      className="w-full p-2.5 bg-[#1A2433] border border-[#2A3649] rounded-xl text-white font-medium resize-y"
                    />
                  </div>

                  {/* Device PDF Upload Button */}
                  <div className="space-y-2 pt-1">
                    <input
                      type="file"
                      ref={(el) => {
                        pdfFileInputRefs.current[brochure.id] = el
                      }}
                      accept=".pdf,application/pdf"
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) handlePdfUpload(brochure.id, file)
                      }}
                      className="hidden"
                    />

                    <div className="flex flex-col sm:flex-row items-center gap-3 p-3 bg-[#1A2433] rounded-xl border border-[#2A3649]">
                      <button
                        type="button"
                        disabled={uploadingPdfId === brochure.id}
                        onClick={() => pdfFileInputRefs.current[brochure.id]?.click()}
                        className="px-4 py-2 bg-[#2F80ED] hover:bg-[#1d6ed8] text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-md transition-all inline-flex items-center gap-2 disabled:opacity-50"
                      >
                        {uploadingPdfId === brochure.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
                        <span>Upload PDF Brochure from Device</span>
                      </button>
                      <span className="text-slate-400 text-[11px] font-mono truncate">
                        Current: {brochure.pdfUrl}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Categories Manager Card */}
          <div className="bg-[#1A2433] p-6 rounded-2xl border border-[#2A3649] space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-[#2A3649] pb-3">
              <div>
                <h2 className="font-['Manrope'] font-bold text-base text-white">
                  Product Filter Categories
                </h2>
                <p className="text-slate-400 text-xs mt-0.5">Categories used for pills filter bar on public Products page.</p>
              </div>
              <button
                onClick={() => setIsCatModalOpen(true)}
                className="px-3.5 py-1.5 bg-[#0B1220] hover:bg-[#2F80ED] text-white text-xs font-bold rounded-lg border border-[#2A3649] transition-colors inline-flex items-center gap-1.5"
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Manage Categories</span>
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              {(pageContent.categories || []).map((cat) => (
                <span key={cat} className="px-3 py-1 bg-[#0B1220] border border-[#2A3649] text-slate-200 text-xs rounded-full font-medium">
                  {cat}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: PRODUCTS CATALOGUE MANAGER */}
      {activeTab === 'catalogue' && (
        <div className="space-y-6">
          {/* Controls & Filter Bar */}
          <div className="bg-[#1A2433] p-5 rounded-2xl border border-[#2A3649] flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 shadow-lg text-xs">
            <div className="relative flex-1 max-w-md">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Search className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products by name, category, or description..."
                className="w-full pl-9 pr-3 py-2.5 bg-[#0B1220] border border-[#2A3649] rounded-xl text-white font-medium focus:outline-none focus:border-[#2F80ED]"
              />
            </div>

            <div className="flex items-center gap-3">
              <select
                value={selectedCat}
                onChange={(e) => setSelectedCat(e.target.value)}
                className="px-3 py-2.5 bg-[#0B1220] border border-[#2A3649] rounded-xl text-white font-bold focus:outline-none focus:border-[#2F80ED]"
              >
                <option value="All">All Categories</option>
                {availableCategories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>

              <button
                onClick={() => {
                  setEditingProduct(null)
                  setIsProductModalOpen(true)
                }}
                className="px-4 py-2.5 bg-[#2F80ED] hover:bg-[#1d6ed8] text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-md transition-all inline-flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Product</span>
              </button>
            </div>
          </div>

          {/* Products Table */}
          <div className="bg-[#1A2433] rounded-2xl border border-[#2A3649] overflow-hidden shadow-xl">
            <div className="p-5 border-b border-[#2A3649] flex items-center justify-between">
              <h2 className="font-['Manrope'] font-bold text-base text-white">
                Catalogue Inventory ({filteredProducts.length} Items)
              </h2>
            </div>

            {isLoading ? (
              <div className="py-16 text-center space-y-2">
                <Loader2 className="w-8 h-8 text-[#2F80ED] animate-spin mx-auto" />
                <p className="text-slate-400 text-xs font-mono">Loading products inventory...</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-[#0B1220]/60 border-b border-[#2A3649] text-[11px] font-mono uppercase tracking-widest text-slate-400">
                      <th scope="col" className="py-4 px-6 font-bold">Product Item</th>
                      <th scope="col" className="py-4 px-6 font-bold">Category</th>
                      <th scope="col" className="py-4 px-6 font-bold">Status</th>
                      <th scope="col" className="py-4 px-6 font-bold">Featured</th>
                      <th scope="col" className="py-4 px-6 font-bold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#2A3649]/60 text-xs">
                    {filteredProducts.map((prod) => (
                      <tr key={prod.id} className="hover:bg-[#0B1220]/40 transition-colors group">
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <img
                              src={prod.image_src}
                              alt={prod.name}
                              className="w-12 h-10 object-cover rounded-lg border border-[#2A3649] bg-[#0B1220]"
                            />
                            <div>
                              <p className="font-['Manrope'] font-bold text-white text-sm group-hover:text-[#2F80ED] transition-colors">
                                {prod.name}
                              </p>
                              <span className="font-mono text-[10px] text-slate-400">{prod.slug}</span>
                            </div>
                          </div>
                        </td>

                        <td className="py-4 px-6 text-slate-300 font-medium">
                          {prod.category}
                        </td>

                        <td className="py-4 px-6">
                          <button
                            type="button"
                            onClick={() => handleTogglePublish(prod)}
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider transition-colors ${
                              prod.is_published
                                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 hover:bg-emerald-500/30'
                                : 'bg-amber-500/20 text-amber-400 border border-amber-500/40 hover:bg-amber-500/30'
                            }`}
                          >
                            {prod.is_published ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                            <span>{prod.is_published ? 'Published' : 'Draft'}</span>
                          </button>
                        </td>

                        <td className="py-4 px-6">
                          <button
                            type="button"
                            onClick={() => handleToggleFeatured(prod)}
                            className={`p-1.5 rounded-lg border transition-colors ${
                              prod.is_featured
                                ? 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                                : 'bg-[#0B1220] text-slate-500 border-[#2A3649] hover:text-white'
                            }`}
                            title={prod.is_featured ? 'Remove from Featured' : 'Mark as Featured'}
                          >
                            <Star className="w-4 h-4 fill-current" />
                          </button>
                        </td>

                        <td className="py-4 px-6 text-right space-x-2">
                          <button
                            type="button"
                            onClick={() => {
                              setEditingProduct(prod)
                              setIsProductModalOpen(true)
                            }}
                            className="p-2 rounded-lg bg-[#2F80ED]/15 text-[#2F80ED] hover:bg-[#2F80ED] hover:text-white border border-[#2F80ED]/30 transition-colors inline-flex items-center gap-1 font-bold"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                            <span>Edit</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              setDeletingProduct(prod)
                              setIsDeleteModalOpen(true)
                            }}
                            className="p-2 rounded-lg bg-[#0B1220] text-slate-400 hover:text-rose-400 hover:bg-rose-950/40 border border-[#2A3649] transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Product Add/Edit Modal */}
      <ProductEditorModal
        isOpen={isProductModalOpen}
        initialData={editingProduct}
        categories={availableCategories}
        onClose={() => setIsProductModalOpen(false)}
        onSave={handleSaveProduct}
      />

      {/* Product Delete Confirmation Dialog */}
      <ProductDeleteDialog
        isOpen={isDeleteModalOpen}
        productName={deletingProduct?.name || ''}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        isDeleting={isDeleting}
      />

      {/* Category Manager Modal */}
      <CategoryManagerModal
        isOpen={isCatModalOpen}
        categories={pageContent?.categories || availableCategories}
        onClose={() => setIsCatModalOpen(false)}
        onSaveCategories={handleSaveCategories}
      />
    </div>
  )
}
