import { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import { Search, ChevronRight, CheckCircle2, ArrowRight, X, Mail } from 'lucide-react'
import type { ProductRecord, ProductsPageContentPayload, ProductBrochureItem } from '@/types/products'
import { productService } from '@/services/productService'
import { DEFAULT_PRODUCTS_PAGE_DATA } from '@/config/cmsSeedData'
import { ProductBrochuresSection } from '@/components/products/ProductBrochuresSection'
import { PdfViewerModal } from '@/components/products/PdfViewerModal'

export function ProductsPage() {
  const shouldReduceMotion = useReducedMotion()

  const [pageContent, setPageContent] = useState<ProductsPageContentPayload | null>(null)
  const [products, setProducts] = useState<ProductRecord[]>([])

  const [selectedCategory, setSelectedCategory] = useState<string>('All Products')
  const [searchQuery, setSearchQuery] = useState<string>('')

  // In-Page PDF Viewer Modal State
  const [selectedBrochure, setSelectedBrochure] = useState<ProductBrochureItem | null>(null)
  const [isPdfModalOpen, setIsPdfModalOpen] = useState<boolean>(false)

  // Load page content and published products from Service Layer
  useEffect(() => {
    let isMounted = true

    async function fetchData() {
      const [contentRes, productsRes] = await Promise.all([
        productService.getProductsPageContent(),
        productService.getPublishedProducts(),
      ])

      if (isMounted) {
        if (contentRes.data) {
          setPageContent(contentRes.data)
        }
        if (productsRes.data) {
          setProducts(productsRes.data)
        }
      }
    }

    fetchData()
    return () => {
      isMounted = false
    }
  }, [])

  // Derived content or fallbacks
  const hero = pageContent?.hero || DEFAULT_PRODUCTS_PAGE_DATA.hero
  const cta = pageContent?.cta || DEFAULT_PRODUCTS_PAGE_DATA.cta
  const brochuresList = pageContent?.brochures || [
    {
      id: 'brochure-1',
      title: 'Electrodynamic Vibration Systems Catalogue',
      description: 'Complete technical specifications for electrodynamic shaker systems up to +4000 Kgf, digital controllers, and modular power amplifiers.',
      pdfUrl: '/brochure1.pdf',
      badge: 'Technical Catalogue',
      fileSize: '6.1 MB',
    },
    {
      id: 'brochure-2',
      title: 'Environmental Test Enclosures & Assemblies Brochure',
      description: 'Detailed operational specs for rain, dust ingress, thermal shock test chambers, and specialized mechanical/electrical assemblies.',
      pdfUrl: '/brochure2.pdf',
      badge: 'Products Brochure',
      fileSize: '3.1 MB',
    },
  ]

  const categoriesList = useMemo(() => {
    const customCats = pageContent?.categories || DEFAULT_PRODUCTS_PAGE_DATA.categories
    if (!customCats.includes('All Products')) {
      return ['All Products', ...customCats]
    }
    return customCats
  }, [pageContent?.categories])

  // Filter products based on selected category and search query
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesCategory =
        selectedCategory === 'All Products' || product.category === selectedCategory

      const query = searchQuery.toLowerCase().trim()
      if (!query) return matchesCategory

      const matchesName = product.name.toLowerCase().includes(query)
      const matchesCategoryName = product.category.toLowerCase().includes(query)
      const matchesDescription = product.short_description.toLowerCase().includes(query)
      const matchesHighlights = (product.highlights || []).some((h) =>
        h.toLowerCase().includes(query)
      )

      return matchesCategory && (matchesName || matchesCategoryName || matchesDescription || matchesHighlights)
    })
  }, [products, selectedCategory, searchQuery])

  // Compute product count per category
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {
      'All Products': products.length,
    }

    products.forEach((p) => {
      counts[p.category] = (counts[p.category] || 0) + 1
    })

    return counts
  }, [products])

  const clearFilters = () => {
    setSelectedCategory('All Products')
    setSearchQuery('')
  }

  const handleViewBrochure = (item: ProductBrochureItem) => {
    setSelectedBrochure(item)
    setIsPdfModalOpen(true)
  }

  return (
    <main className="flex-1 w-full bg-[#F7F8FA] text-[#111827]">
      {/* 1. Hero Section */}
      <section className="relative w-full bg-[#0B1220] text-white py-16 sm:py-24 border-b border-[#2A3649] overflow-hidden">
        {/* Background Image with Dark Vignette */}
        <div className="absolute inset-0 z-0">
          <img
            src={hero.imageSrc}
            alt={hero.imageAlt}
            className="w-full h-full object-cover object-center opacity-25"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0B1220] via-[#0B1220]/90 to-[#0B1220]/70" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B1220] via-transparent to-transparent" />
        </div>

        {/* Top Hairline Accent */}
        <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-[#2F80ED] to-transparent opacity-80 absolute top-0 left-0" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0, 0, 0.2, 1] }}
            className="max-w-3xl space-y-4"
          >
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              <Link to="/" className="hover:text-white transition-colors">
                Home
              </Link>
              <ChevronRight className="w-3.5 h-3.5 text-[#2F80ED]" />
              <span className="text-[#2F80ED]">Products</span>
            </nav>

            {/* Eyebrow */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#2F80ED]/15 border border-[#2F80ED]/30 text-[#2F80ED] text-xs font-bold tracking-wider uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-[#2F80ED] animate-pulse" />
              <span>{hero.eyebrow}</span>
            </div>

            {/* Main Heading */}
            <h1 className="font-['Manrope'] text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
              {hero.heading}
            </h1>

            {/* Description */}
            <p className="text-slate-300 text-base sm:text-lg leading-relaxed pt-1">
              {hero.description}
            </p>
          </motion.div>
        </div>
      </section>

      {/* 2. Main Product Catalog Area */}
      <section className="py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          
          {/* TECHNICAL BROCHURES & CATALOGUES BANNER */}
          <ProductBrochuresSection
            brochures={brochuresList}
            onViewBrochure={handleViewBrochure}
          />

          {/* Controls Bar: Category Navigation + Search Input */}
          <div className="space-y-6">
            {/* Search Input Bar */}
            <div className="max-w-md w-full relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Search className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products by name, category, or application..."
                className="w-full pl-10 pr-10 py-3 bg-white border border-slate-300 rounded-xl text-sm text-[#111827] shadow-xs focus:outline-none focus:ring-2 focus:ring-[#2F80ED] transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
              {categoriesList.map((category) => {
                const isSelected = selectedCategory === category
                const count = categoryCounts[category] || 0

                return (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-bold whitespace-nowrap transition-all duration-200 ${
                      isSelected
                        ? 'bg-[#0B1220] text-white shadow-md'
                        : 'bg-white text-slate-600 border border-slate-200 hover:border-[#2F80ED]/40 hover:text-[#0B1220]'
                    }`}
                  >
                    <span>{category}</span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-mono ${
                        isSelected ? 'bg-[#2F80ED] text-white' : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Active Filter Info / Clear Action */}
          {(selectedCategory !== 'All Products' || searchQuery) && (
            <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-200">
              <div>
                Showing <strong className="text-[#0B1220]">{filteredProducts.length}</strong> product{filteredProducts.length === 1 ? '' : 's'}
                {selectedCategory !== 'All Products' && (
                  <span> in <strong className="text-[#2F80ED]">{selectedCategory}</strong></span>
                )}
                {searchQuery && (
                  <span> matching "<strong className="text-[#0B1220]">{searchQuery}</strong>"</span>
                )}
              </div>
              <button
                onClick={clearFilters}
                className="text-[#2F80ED] hover:underline font-bold inline-flex items-center gap-1"
              >
                <X className="w-3.5 h-3.5" />
                <span>Clear Filters</span>
              </button>
            </div>
          )}

          {/* 3. Product Grid */}
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            /* 4. Empty State */
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-lg mx-auto space-y-4 shadow-sm my-8">
              <div className="p-4 rounded-full bg-slate-100 text-slate-400 inline-block">
                <Search className="w-8 h-8" />
              </div>
              <h3 className="font-['Manrope'] text-xl font-bold text-[#0B1220]">
                No Products Found
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                No products match your selected category or search term. Please adjust your search criteria or browse all products.
              </p>
              <button
                onClick={clearFilters}
                className="px-6 py-2.5 bg-[#2F80ED] hover:bg-[#1d6ed8] text-white text-xs font-semibold rounded-md shadow-sm transition-colors"
              >
                Reset Search Filters
              </button>
            </div>
          )}

        </div>
      </section>

      {/* 5. Bottom Contact CTA */}
      <section className="bg-[#0B1220] text-white py-16 sm:py-20 relative overflow-hidden border-t border-[#2A3649]">
        <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-[#2F80ED] to-transparent opacity-80 absolute top-0 left-0" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#2F80ED]/15 border border-[#2F80ED]/30 text-[#2F80ED] text-xs font-bold tracking-wider uppercase">
            <Mail className="w-3.5 h-3.5" />
            <span>{cta.eyebrow}</span>
          </div>

          <h2 className="font-['Manrope'] text-3xl sm:text-4xl font-extrabold text-white leading-tight">
            {cta.heading}
          </h2>

          <p className="text-slate-300 text-base leading-relaxed">
            {cta.description}
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
            <Link
              to={cta.secondaryCtaHref || '/contact'}
              className="inline-flex items-center gap-2 px-7 py-3.5 bg-[#2F80ED] hover:bg-[#1d6ed8] text-white text-sm font-semibold rounded-md shadow-lg shadow-[#2F80ED]/25 transition-all"
            >
              <span>{cta.secondaryCtaText || 'Contact Us'}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* In-Page Interactive PDF Viewer Modal */}
      <PdfViewerModal
        isOpen={isPdfModalOpen}
        brochure={selectedBrochure}
        onClose={() => setIsPdfModalOpen(false)}
      />
    </main>
  )
}

// Individual Product Card Component
function ProductCard({ product }: { product: ProductRecord }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.4, ease: [0, 0, 0.2, 1] }}
      className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-xl hover:border-[#2F80ED]/40 transition-all duration-300 flex flex-col justify-between group"
    >
      <div className="space-y-4">
        {/* Product Image Frame */}
        <div className="relative h-56 sm:h-60 bg-[#0B1220] overflow-hidden">
          <img
            src={product.image_src}
            alt={product.image_alt || product.name}
            className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B1220]/70 via-transparent to-transparent pointer-events-none" />

          {/* Category Badge */}
          <div className="absolute top-3 left-3">
            <span className="inline-block px-3 py-1 rounded-md bg-[#0B1220]/90 backdrop-blur-md text-white text-[11px] font-bold tracking-wide uppercase border border-slate-700">
              {product.category}
            </span>
          </div>
        </div>

        {/* Details & Description */}
        <div className="p-6 space-y-4">
          <h3 className="font-['Manrope'] font-bold text-xl text-[#0B1220] leading-snug group-hover:text-[#2F80ED] transition-colors">
            {product.name}
          </h3>

          <p className="text-slate-600 text-sm leading-relaxed line-clamp-3">
            {product.short_description}
          </p>

          {/* Key Highlights Checklist */}
          {product.highlights && product.highlights.length > 0 && (
            <div className="pt-3 border-t border-slate-100 space-y-2">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 font-mono">
                Key Highlights
              </div>
              <div className="space-y-1.5">
                {product.highlights.slice(0, 3).map((h, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs font-semibold text-[#0B1220]">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#2F80ED] shrink-0" />
                    <span className="truncate">{h}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Card Action Button — ENQUIRE NOW */}
      <div className="p-6 pt-0">
        <Link
          to="/contact"
          className="w-full py-3 px-4 bg-[#0B1220] group-hover:bg-[#2F80ED] text-white text-xs font-bold tracking-wider uppercase rounded-lg shadow-sm group-hover:shadow-md transition-all duration-200 flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-[#2F80ED]"
        >
          <span>Enquire Now</span>
          <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    </motion.div>
  )
}
