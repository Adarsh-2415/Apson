export interface CompanyIntroData {
  eyebrow: string
  heading: string
  descriptionParagraphs: string[]
  ctaText: string
  ctaHref: string
  imageSrc: string
  imageAlt: string
}

export interface Product {
  id: string
  name: string
  slug: string
  category: string
  shortDescription: string
  imageSrc: string
  imageAlt: string
  highlights?: string[]
  isPublished: boolean
  isFeatured: boolean
  displayOrder: number
}

export interface FeaturedProductsSectionData {
  eyebrow: string
  heading: string
  description: string
  ctaText: string
  ctaHref: string
  products: Product[]
}

export interface WhyApsonFeatureItem {
  number: string
  title: string
  description: string
  iconName?: string
}

export interface WhyApsonSectionData {
  eyebrow: string
  heading: string
  introduction: string
  features: WhyApsonFeatureItem[]
}

export interface ContactCTASectionData {
  eyebrow: string
  heading: string
  description: string
  primaryCtaText: string
  primaryCtaHref: string
  secondaryCtaText: string
  secondaryCtaHref: string
}

export interface ManpowerSectionData {
  eyebrow?: string
  heading: string
  description: string
  technical: number
  nonTechnical: number
  skilled: number
  semiUnskilled: number
  totalManpower?: number
}

/* ==========================================================================
   ABOUT PAGE CMS DATA CONTRACTS
   ========================================================================== */

export interface AboutHeroData {
  eyebrow: string
  heading: string
  description: string
  breadcrumbText: string
  imageSrc: string
  imageAlt: string
}

export interface AboutIntroData {
  eyebrow: string
  heading: string
  paragraphs: string[]
  imageSrc: string
  imageAlt: string
  highlights?: string[]
}

export interface AboutStatItem {
  id: string
  label: string
  value: string
  suffix?: string
  iconName?: string
  isVisible: boolean
}

export interface AboutMissionVisionItem {
  heading: string
  description: string
  iconName?: string
}

export interface AboutMissionVisionData {
  mission: AboutMissionVisionItem
  vision: AboutMissionVisionItem
}

export interface AboutWhyChooseItem {
  id: string
  title: string
  description: string
  iconName?: string
  displayOrder: number
  isVisible: boolean
}

export interface AboutWhyChooseData {
  eyebrow: string
  heading: string
  items: AboutWhyChooseItem[]
}

export interface AboutCoreValueItem {
  id: string
  title: string
  description: string
  iconName?: string
  displayOrder: number
  isVisible: boolean
}

export interface AboutCoreValuesData {
  eyebrow: string
  heading: string
  items: AboutCoreValueItem[]
}

export interface AboutIndustryItem {
  id: string
  name: string
  description: string
  imageSrc?: string
  iconName?: string
  displayOrder: number
  isActive: boolean
}

export interface AboutIndustriesData {
  eyebrow: string
  heading: string
  description: string
  items: AboutIndustryItem[]
}

export interface AboutQualityManufacturingData {
  eyebrow: string
  heading: string
  paragraphs: string[]
  imageSrc: string
  imageAlt: string
  featureList: string[]
}

export interface AboutMilestoneItem {
  id: string
  year: string
  title: string
  description: string
  imageSrc?: string
  displayOrder: number
  isVisible: boolean
}

export interface AboutMilestonesData {
  eyebrow: string
  heading: string
  description: string
  items: AboutMilestoneItem[]
  isVisible: boolean
}

export interface AboutCTAData {
  eyebrow: string
  heading: string
  description: string
  primaryCtaText: string
  primaryCtaHref: string
  secondaryCtaText: string
  secondaryCtaHref: string
  isVisible: boolean
}

export interface AboutPageData {
  hero: AboutHeroData
  intro: AboutIntroData
  statistics: AboutStatItem[]
  missionVision: AboutMissionVisionData
  whyChoose: AboutWhyChooseData
  coreValues: AboutCoreValuesData
  industries: AboutIndustriesData
  qualityManufacturing: AboutQualityManufacturingData
  milestones: AboutMilestonesData
  cta: AboutCTAData
}

export interface ProductsHeroData {
  eyebrow: string
  heading: string
  description: string
  breadcrumbText: string
  imageSrc: string
  imageAlt: string
}

export interface ProductsPageData {
  hero: ProductsHeroData
  categories: string[]
  products: Product[]
  cta: ContactCTASectionData
}
