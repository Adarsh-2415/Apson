export interface ProductRecord {
  id: string
  name: string
  slug: string
  category: string
  short_description: string
  image_src: string
  image_alt?: string
  highlights?: string[]
  is_published: boolean
  is_featured: boolean
  display_order: number
  created_at?: string
  updated_at?: string
}

export interface ProductsPageHeroContent {
  eyebrow: string
  heading: string
  description: string
  breadcrumbText: string
  imageSrc: string
  imageAlt: string
}

export interface ProductsPageCTAContent {
  eyebrow: string
  heading: string
  description: string
  primaryCtaText: string
  primaryCtaHref: string
  secondaryCtaText: string
  secondaryCtaHref: string
}

export interface ProductBrochureItem {
  id: string
  title: string
  description: string
  pdfUrl: string
  badge?: string
  fileSize?: string
}

export interface ProductsPageContentPayload {
  hero: ProductsPageHeroContent
  categories: string[]
  brochures?: ProductBrochureItem[]
  cta: ProductsPageCTAContent
}
