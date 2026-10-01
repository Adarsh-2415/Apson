import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import type { ProductRecord, ProductsPageContentPayload } from '@/types/products'
import { INITIAL_PRODUCTS_LIST, DEFAULT_PRODUCTS_PAGE_DATA } from '@/config/cmsSeedData'

const MOCK_PRODUCTS_KEY = 'apson_cms_mock_products'
const MOCK_PRODUCTS_CONTENT_KEY = 'apson_cms_mock_products_page_content'

// Convert seed Product to ProductRecord
const INITIAL_PRODUCT_RECORDS: ProductRecord[] = INITIAL_PRODUCTS_LIST.map((p) => ({
  id: p.id,
  name: p.name,
  slug: p.slug,
  category: p.category,
  short_description: p.shortDescription,
  image_src: p.imageSrc,
  image_alt: p.imageAlt || p.name,
  highlights: p.highlights || [],
  is_published: p.isPublished,
  is_featured: p.isFeatured,
  display_order: p.displayOrder,
}))

function getLocalProducts(): ProductRecord[] {
  const stored = localStorage.getItem(MOCK_PRODUCTS_KEY)
  if (stored) {
    try {
      const parsed = JSON.parse(stored)
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed
      }
    } catch {
      // Fallback
    }
  }
  localStorage.setItem(MOCK_PRODUCTS_KEY, JSON.stringify(INITIAL_PRODUCT_RECORDS))
  return INITIAL_PRODUCT_RECORDS
}

function setLocalProducts(products: ProductRecord[]) {
  localStorage.setItem(MOCK_PRODUCTS_KEY, JSON.stringify(products))
}

function getLocalPageContent(): ProductsPageContentPayload {
  const stored = localStorage.getItem(MOCK_PRODUCTS_CONTENT_KEY)
  if (stored) {
    try {
      return JSON.parse(stored)
    } catch {
      // Fallback
    }
  }

  const initialPayload: ProductsPageContentPayload = {
    hero: {
      eyebrow: DEFAULT_PRODUCTS_PAGE_DATA.hero.eyebrow,
      heading: DEFAULT_PRODUCTS_PAGE_DATA.hero.heading,
      description: DEFAULT_PRODUCTS_PAGE_DATA.hero.description,
      breadcrumbText: DEFAULT_PRODUCTS_PAGE_DATA.hero.breadcrumbText,
      imageSrc: DEFAULT_PRODUCTS_PAGE_DATA.hero.imageSrc,
      imageAlt: DEFAULT_PRODUCTS_PAGE_DATA.hero.imageAlt,
    },
    categories: DEFAULT_PRODUCTS_PAGE_DATA.categories,
    brochures: [
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
    ],
    cta: {
      eyebrow: DEFAULT_PRODUCTS_PAGE_DATA.cta.eyebrow,
      heading: DEFAULT_PRODUCTS_PAGE_DATA.cta.heading,
      description: DEFAULT_PRODUCTS_PAGE_DATA.cta.description,
      primaryCtaText: DEFAULT_PRODUCTS_PAGE_DATA.cta.primaryCtaText,
      primaryCtaHref: DEFAULT_PRODUCTS_PAGE_DATA.cta.primaryCtaHref,
      secondaryCtaText: DEFAULT_PRODUCTS_PAGE_DATA.cta.secondaryCtaText,
      secondaryCtaHref: DEFAULT_PRODUCTS_PAGE_DATA.cta.secondaryCtaHref,
    },
  }

  localStorage.setItem(MOCK_PRODUCTS_CONTENT_KEY, JSON.stringify(initialPayload))
  return initialPayload
}

function setLocalPageContent(payload: ProductsPageContentPayload) {
  localStorage.setItem(MOCK_PRODUCTS_CONTENT_KEY, JSON.stringify(payload))
}

export const productService = {
  // Fetch all products (for Admin Panel)
  async getAllProducts(): Promise<{ data: ProductRecord[]; error: Error | null }> {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .order('display_order', { ascending: true })

        if (!error && data && data.length > 0) {
          return { data, error: null }
        }
      } catch {
        // Fallback
      }
    }

    return { data: getLocalProducts(), error: null }
  },

  // Fetch published products (for Public Website)
  async getPublishedProducts(): Promise<{ data: ProductRecord[]; error: Error | null }> {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('is_published', true)
          .order('display_order', { ascending: true })

        if (!error && data && data.length > 0) {
          return { data, error: null }
        }
      } catch {
        // Fallback
      }
    }

    const published = getLocalProducts().filter((p) => p.is_published)
    return { data: published, error: null }
  },

  // Create Product
  async createProduct(
    input: Omit<ProductRecord, 'id' | 'created_at' | 'updated_at'>
  ): Promise<{ data: ProductRecord | null; error: Error | null }> {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('products')
          .insert(input)
          .select()
          .single()

        if (!error && data) {
          return { data, error: null }
        }
      } catch {
        // Fallback
      }
    }

    const newProduct: ProductRecord = {
      ...input,
      id: `prod-${Date.now()}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    const products = getLocalProducts()
    products.push(newProduct)
    setLocalProducts(products)
    return { data: newProduct, error: null }
  },

  // Update Product
  async updateProduct(
    id: string,
    updates: Partial<ProductRecord>
  ): Promise<{ data: ProductRecord | null; error: Error | null }> {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('products')
          .update({ ...updates, updated_at: new Date().toISOString() })
          .eq('id', id)
          .select()
          .single()

        if (!error && data) {
          return { data, error: null }
        }
      } catch {
        // Fallback
      }
    }

    const products = getLocalProducts()
    const idx = products.findIndex((p) => p.id === id)
    if (idx !== -1) {
      products[idx] = {
        ...products[idx],
        ...updates,
        updated_at: new Date().toISOString(),
      }
      setLocalProducts(products)
      return { data: products[idx], error: null }
    }

    return { data: null, error: new Error('Product not found') }
  },

  // Delete Product
  async deleteProduct(id: string): Promise<{ error: Error | null }> {
    if (isSupabaseConfigured) {
      try {
        const { error } = await supabase.from('products').delete().eq('id', id)
        if (!error) return { error: null }
      } catch {
        // Fallback
      }
    }

    const products = getLocalProducts().filter((p) => p.id !== id)
    setLocalProducts(products)
    return { error: null }
  },

  // Fetch Page Content Payload
  async getProductsPageContent(): Promise<{ data: ProductsPageContentPayload; error: Error | null }> {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('page_sections')
          .select('content')
          .eq('section_type', 'products_page_content')
          .single()

        if (!error && data?.content) {
          return { data: data.content as ProductsPageContentPayload, error: null }
        }
      } catch {
        // Fallback
      }
    }

    return { data: getLocalPageContent(), error: null }
  },

  // Save Page Content Payload
  async saveProductsPageContent(
    payload: ProductsPageContentPayload
  ): Promise<{ error: Error | null }> {
    if (isSupabaseConfigured) {
      try {
        // Ensure products page record exists first
        let pageId = ''
        const { data: pageData } = await supabase
          .from('pages')
          .select('id')
          .eq('slug', '/products')
          .single()

        if (pageData?.id) {
          pageId = pageData.id
        } else {
          const { data: newPage } = await supabase
            .from('pages')
            .insert({ title: 'Products', slug: '/products', status: 'published' })
            .select('id')
            .single()
          if (newPage?.id) pageId = newPage.id
        }

        if (pageId) {
          await supabase.from('page_sections').delete().eq('page_id', pageId)
          await supabase.from('page_sections').insert({
            page_id: pageId,
            section_type: 'products_page_content',
            content: payload,
            display_order: 1,
            is_visible: true,
          })
        }
        return { error: null }
      } catch {
        setLocalPageContent(payload)
        return { error: null }
      }
    }

    setLocalPageContent(payload)
    return { error: null }
  },
}
