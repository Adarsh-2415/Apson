import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import type { PageRecord, PageSection } from '@/types/builder'
import type { HomePageContentPayload } from '@/types/homeCms'
import type { AboutPageContentPayload } from '@/types/aboutCms'
import {
  DEFAULT_COMPANY_INTRO_DATA,
  DEFAULT_WHY_APSON_DATA,
  DEFAULT_MANPOWER_DATA,
  DEFAULT_ABOUT_PAGE_DATA,
} from '@/config/cmsSeedData'

const MOCK_PAGES_KEY = 'apson_cms_mock_pages'
const MOCK_SECTIONS_KEY = 'apson_cms_mock_sections'
const MOCK_HOME_CONTENT_KEY = 'apson_cms_mock_home_page_content'
const MOCK_ABOUT_CONTENT_KEY = 'apson_cms_mock_about_page_content'

// Seed pages for initial dev fallback mode
const INITIAL_PAGES: PageRecord[] = [
  {
    id: 'page-1',
    title: 'Home',
    slug: '/',
    status: 'published',
    seo_title: 'APSON Industries — Engineering & Industrial Solutions',
    seo_description: 'Leading industrial manufacturer & testing equipment solutions provider.',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    published_at: new Date().toISOString(),
  },
  {
    id: 'page-2',
    title: 'About Us',
    slug: '/about',
    status: 'published',
    seo_title: 'About APSON Industries — Quality & Innovation',
    seo_description: 'Learn about APSON Industries mission, vision, workforce, and manufacturing capabilities.',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    published_at: new Date().toISOString(),
  },
  {
    id: 'page-3',
    title: 'Products',
    slug: '/products',
    status: 'published',
    seo_title: 'Industrial Equipment & Products — APSON Industries',
    seo_description: 'Browse APSON Industries full range of testing and engineering equipment.',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    published_at: new Date().toISOString(),
  },
]

function getLocalPages(): PageRecord[] {
  const stored = localStorage.getItem(MOCK_PAGES_KEY)
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
  localStorage.setItem(MOCK_PAGES_KEY, JSON.stringify(INITIAL_PAGES))
  return INITIAL_PAGES
}

function setLocalPages(pages: PageRecord[]) {
  localStorage.setItem(MOCK_PAGES_KEY, JSON.stringify(pages))
}

function getLocalSections(pageId: string): PageSection[] {
  const stored = localStorage.getItem(`${MOCK_SECTIONS_KEY}_${pageId}`)
  if (stored) {
    try {
      return JSON.parse(stored)
    } catch {
      // Fallback
    }
  }
  return []
}

function setLocalSections(pageId: string, sections: PageSection[]) {
  localStorage.setItem(`${MOCK_SECTIONS_KEY}_${pageId}`, JSON.stringify(sections))
}

// Initial Home Page Content Payload
const INITIAL_HOME_CONTENT: HomePageContentPayload = {
  heroSlides: [
    {
      id: 'slide-1',
      title: 'Electrodynamic Vibration Testing Systems',
      subtitle: 'Advanced Shaker Systems, Controllers & Power Amplifiers Engineered for Precision Testing up to +4000 Kgf.',
      primaryCtaText: 'Explore Shaker Systems',
      primaryCtaHref: '/products',
      secondaryCtaText: 'Technical Inquiry',
      secondaryCtaHref: '/contact',
      imageSrc: '/images/slider-1.jpg',
      imageAlt: 'Electrodynamic Vibration Testing Systems',
    },
    {
      id: 'slide-2',
      title: 'Custom Environmental Test Chambers',
      subtitle: 'High-Performance Rain, Dust, Thermal & Humidity Chambers Built for Harsh Industrial Operations.',
      primaryCtaText: 'View Environmental Line',
      primaryCtaHref: '/products',
      secondaryCtaText: 'Discuss Requirements',
      secondaryCtaHref: '/contact',
      imageSrc: '/images/slider-2.jpg',
      imageAlt: 'Custom Environmental Test Chambers',
    },
    {
      id: 'slide-3',
      title: 'Specialized Mechanical & Electronics Assemblies',
      subtitle: 'Delivering Rugged Mechanical Fixtures, Cable Harnessing & Electronics Assemblies for Industrial Applications.',
      primaryCtaText: 'Our Capabilities',
      primaryCtaHref: '/about',
      secondaryCtaText: 'Get In Touch',
      secondaryCtaHref: '/contact',
      imageSrc: '/images/slider-3.jpg',
      imageAlt: 'Specialized Mechanical & Electronics Assemblies',
    },
  ],
  companyIntro: {
    eyebrow: DEFAULT_COMPANY_INTRO_DATA.eyebrow,
    heading: DEFAULT_COMPANY_INTRO_DATA.heading,
    descriptionParagraphs: DEFAULT_COMPANY_INTRO_DATA.descriptionParagraphs,
    ctaText: DEFAULT_COMPANY_INTRO_DATA.ctaText,
    ctaHref: DEFAULT_COMPANY_INTRO_DATA.ctaHref,
    imageSrc: DEFAULT_COMPANY_INTRO_DATA.imageSrc,
    imageAlt: DEFAULT_COMPANY_INTRO_DATA.imageAlt,
  },
  manpower: {
    eyebrow: DEFAULT_MANPOWER_DATA.eyebrow,
    heading: DEFAULT_MANPOWER_DATA.heading,
    description: DEFAULT_MANPOWER_DATA.description,
    technical: DEFAULT_MANPOWER_DATA.technical,
    nonTechnical: DEFAULT_MANPOWER_DATA.nonTechnical,
    skilled: DEFAULT_MANPOWER_DATA.skilled,
    semiUnskilled: DEFAULT_MANPOWER_DATA.semiUnskilled,
  },
  whyApson: {
    eyebrow: DEFAULT_WHY_APSON_DATA.eyebrow,
    heading: DEFAULT_WHY_APSON_DATA.heading,
    introduction: DEFAULT_WHY_APSON_DATA.introduction,
    features: DEFAULT_WHY_APSON_DATA.features,
  },
  cta: {
    eyebrow: 'READY TO ELEVATE YOUR TESTING CAPABILITIES?',
    heading: 'Partner with APSON Industries',
    description: 'Discuss your vibration shaker, environmental chamber, or custom engineering requirements with our specialists in Roorkee.',
    primaryCtaText: 'Explore Products',
    primaryCtaHref: '/products',
    secondaryCtaText: 'Contact Us',
    secondaryCtaHref: '/contact',
  },
}

function getLocalHomeContent(): HomePageContentPayload {
  const stored = localStorage.getItem(MOCK_HOME_CONTENT_KEY)
  if (stored) {
    try {
      return JSON.parse(stored)
    } catch {
      // Fallback
    }
  }
  localStorage.setItem(MOCK_HOME_CONTENT_KEY, JSON.stringify(INITIAL_HOME_CONTENT))
  return INITIAL_HOME_CONTENT
}

// Initial About Us Page Content Payload
const INITIAL_ABOUT_CONTENT: AboutPageContentPayload = DEFAULT_ABOUT_PAGE_DATA

function getLocalAboutContent(): AboutPageContentPayload {
  const stored = localStorage.getItem(MOCK_ABOUT_CONTENT_KEY)
  if (stored) {
    try {
      return JSON.parse(stored)
    } catch {
      // Fallback
    }
  }
  localStorage.setItem(MOCK_ABOUT_CONTENT_KEY, JSON.stringify(INITIAL_ABOUT_CONTENT))
  return INITIAL_ABOUT_CONTENT
}

export const cmsService = {
  // Fetch all pages
  async getPages(): Promise<{ data: PageRecord[]; error: Error | null }> {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('pages')
          .select('*')
          .order('created_at', { ascending: false })

        if (error) {
          console.warn('Supabase getPages warning/error:', error.message)
        }

        if (error || !data || data.length === 0) {
          return { data: getLocalPages(), error: null }
        }

        return { data, error: null }
      } catch (err) {
        console.warn('Supabase getPages exception:', err)
        return { data: getLocalPages(), error: null }
      }
    }

    return { data: getLocalPages(), error: null }
  },

  // Fetch page by ID
  async getPageById(id: string): Promise<{ data: PageRecord | null; error: Error | null }> {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase.from('pages').select('*').eq('id', id).single()
        if (!error && data) return { data, error: null }
      } catch (err) {
        console.warn('Supabase getPageById exception:', err)
      }
    }

    const pages = getLocalPages()
    const page = pages.find((p) => p.id === id) || null
    return { data: page, error: null }
  },

  // Fetch page by slug
  async getPageBySlug(slug: string): Promise<{ data: PageRecord | null; error: Error | null }> {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('pages')
          .select('*')
          .eq('slug', slug)
          .eq('status', 'published')
          .single()

        if (!error && data) return { data, error: null }
      } catch (err) {
        console.warn('Supabase getPageBySlug exception:', err)
      }
    }

    const pages = getLocalPages()
    const normalized = slug.startsWith('/') ? slug : `/${slug}`
    const page = pages.find((p) => p.slug === normalized && p.status === 'published') || null
    return { data: page, error: null }
  },

  // Create page
  async createPage(input: {
    title: string
    slug: string
    seo_title?: string
    seo_description?: string
  }): Promise<{ data: PageRecord | null; error: Error | null }> {
    const formattedSlug = input.slug.startsWith('/') ? input.slug : `/${input.slug}`

    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('pages')
          .insert({
            title: input.title,
            slug: formattedSlug,
            status: 'draft',
            seo_title: input.seo_title || input.title,
            seo_description: input.seo_description || '',
          })
          .select()
          .single()

        if (error) {
          console.error('Supabase createPage RLS/DB Error:', error.message)
        } else if (data) {
          return { data, error: null }
        }
      } catch (err) {
        console.error('Supabase createPage Exception:', err)
      }
    }

    const newPage: PageRecord = {
      id: `page-${Date.now()}`,
      title: input.title,
      slug: formattedSlug,
      status: 'draft',
      seo_title: input.seo_title || input.title,
      seo_description: input.seo_description || '',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    const pages = getLocalPages()
    pages.unshift(newPage)
    setLocalPages(pages)
    return { data: newPage, error: null }
  },

  // Update page details or status
  async updatePage(
    id: string,
    updates: Partial<PageRecord>
  ): Promise<{ data: PageRecord | null; error: Error | null }> {
    if (isSupabaseConfigured) {
      try {
        const payload: Record<string, any> = { ...updates, updated_at: new Date().toISOString() }
        if (updates.status === 'published') {
          payload.published_at = new Date().toISOString()
        }

        const { data, error } = await supabase
          .from('pages')
          .update(payload)
          .eq('id', id)
          .select()
          .single()

        if (error) {
          console.error('Supabase updatePage Error:', error.message)
        } else if (data) {
          return { data, error: null }
        }
      } catch (err) {
        console.error('Supabase updatePage Exception:', err)
      }
    }

    const pages = getLocalPages()
    const idx = pages.findIndex((p) => p.id === id)
    if (idx !== -1) {
      pages[idx] = {
        ...pages[idx],
        ...updates,
        updated_at: new Date().toISOString(),
        published_at: updates.status === 'published' ? new Date().toISOString() : pages[idx].published_at,
      }
      setLocalPages(pages)
      return { data: pages[idx], error: null }
    }

    return { data: null, error: new Error('Page not found') }
  },

  // Fetch page sections ordered by display_order
  async getPageSections(pageId: string): Promise<{ data: PageSection[]; error: Error | null }> {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('page_sections')
          .select('*')
          .eq('page_id', pageId)
          .order('display_order', { ascending: true })

        if (!error && data && data.length > 0) return { data, error: null }
      } catch (err) {
        console.warn('Supabase getPageSections Exception:', err)
      }
    }

    return { data: getLocalSections(pageId), error: null }
  },

  // Save page sections bulk
  async savePageSections(
    pageId: string,
    sections: PageSection[]
  ): Promise<{ error: Error | null }> {
    if (isSupabaseConfigured) {
      try {
        await supabase.from('page_sections').delete().eq('page_id', pageId)

        if (sections.length > 0) {
          const insertPayload = sections.map((s, index) => ({
            page_id: pageId,
            section_type: s.section_type,
            content: s.content,
            display_order: index + 1,
            is_visible: s.is_visible,
          }))

          const { error } = await supabase.from('page_sections').insert(insertPayload)
          if (error) {
            console.error('Supabase savePageSections Insert Error:', error.message)
            setLocalSections(pageId, sections)
          }
        }
        return { error: null }
      } catch (err) {
        console.error('Supabase savePageSections Exception:', err)
        setLocalSections(pageId, sections)
        return { error: null }
      }
    }

    setLocalSections(pageId, sections)
    return { error: null }
  },

  // Atomic reorder RPC call
  async reorderPageSections(
    pageId: string,
    orders: Array<{ id: string; display_order: number }>
  ): Promise<{ error: Error | null }> {
    if (isSupabaseConfigured) {
      try {
        const { error } = await supabase.rpc('reorder_page_sections', {
          p_page_id: pageId,
          p_section_orders: orders,
        })
        if (!error) return { error: null }
        console.warn('Supabase reorderPageSections Error:', error.message)
      } catch (err) {
        console.warn('Supabase reorderPageSections Exception:', err)
      }
    }

    const sections = getLocalSections(pageId)
    const map = new Map(orders.map((o) => [o.id, o.display_order]))
    sections.forEach((s) => {
      if (map.has(s.id)) {
        s.display_order = map.get(s.id)!
      }
    })
    sections.sort((a, b) => a.display_order - b.display_order)
    setLocalSections(pageId, sections)
    return { error: null }
  },

  // Fetch Home Page Content Payload
  async getHomePageContent(): Promise<{ data: HomePageContentPayload; error: Error | null }> {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('page_sections')
          .select('content')
          .eq('section_type', 'home_page_content')
          .single()

        if (!error && data?.content) {
          return { data: data.content as HomePageContentPayload, error: null }
        }
      } catch {
        // Fallback
      }
    }

    return { data: getLocalHomeContent(), error: null }
  },

  // Save Home Page Content Payload
  async saveHomePageContent(payload: HomePageContentPayload): Promise<{ error: Error | null }> {
    if (isSupabaseConfigured) {
      try {
        let pageId = ''
        const { data: pageData } = await supabase
          .from('pages')
          .select('id')
          .eq('slug', '/')
          .single()

        if (pageData?.id) {
          pageId = pageData.id
        } else {
          const { data: newPage } = await supabase
            .from('pages')
            .insert({ title: 'Home', slug: '/', status: 'published' })
            .select('id')
            .single()
          if (newPage?.id) pageId = newPage.id
        }

        if (pageId) {
          await supabase.from('page_sections').delete().eq('page_id', pageId)
          await supabase.from('page_sections').insert({
            page_id: pageId,
            section_type: 'home_page_content',
            content: payload,
            display_order: 1,
            is_visible: true,
          })
        }
        return { error: null }
      } catch {
        localStorage.setItem(MOCK_HOME_CONTENT_KEY, JSON.stringify(payload))
        return { error: null }
      }
    }

    localStorage.setItem(MOCK_HOME_CONTENT_KEY, JSON.stringify(payload))
    return { error: null }
  },

  // Fetch About Page Content Payload
  async getAboutPageContent(): Promise<{ data: AboutPageContentPayload; error: Error | null }> {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('page_sections')
          .select('content')
          .eq('section_type', 'about_page_content')
          .single()

        if (!error && data?.content) {
          return { data: data.content as AboutPageContentPayload, error: null }
        }
      } catch {
        // Fallback
      }
    }

    return { data: getLocalAboutContent(), error: null }
  },

  // Save About Page Content Payload
  async saveAboutPageContent(payload: AboutPageContentPayload): Promise<{ error: Error | null }> {
    if (isSupabaseConfigured) {
      try {
        let pageId = ''
        const { data: pageData } = await supabase
          .from('pages')
          .select('id')
          .eq('slug', '/about')
          .single()

        if (pageData?.id) {
          pageId = pageData.id
        } else {
          const { data: newPage } = await supabase
            .from('pages')
            .insert({ title: 'About Us', slug: '/about', status: 'published' })
            .select('id')
            .single()
          if (newPage?.id) pageId = newPage.id
        }

        if (pageId) {
          await supabase.from('page_sections').delete().eq('page_id', pageId)
          await supabase.from('page_sections').insert({
            page_id: pageId,
            section_type: 'about_page_content',
            content: payload,
            display_order: 1,
            is_visible: true,
          })
        }
        return { error: null }
      } catch {
        localStorage.setItem(MOCK_ABOUT_CONTENT_KEY, JSON.stringify(payload))
        return { error: null }
      }
    }

    localStorage.setItem(MOCK_ABOUT_CONTENT_KEY, JSON.stringify(payload))
    return { error: null }
  },
}
