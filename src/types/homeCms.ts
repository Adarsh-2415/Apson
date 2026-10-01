export interface HeroSlide {
  id: string
  title: string
  subtitle: string
  primaryCtaText: string
  primaryCtaHref: string
  secondaryCtaText: string
  secondaryCtaHref: string
  imageSrc: string
  imageAlt: string
}

export interface CompanyIntroContent {
  eyebrow: string
  heading: string
  descriptionParagraphs: string[]
  ctaText: string
  ctaHref: string
  imageSrc: string
  imageAlt: string
}

export interface ManpowerContent {
  eyebrow?: string
  heading: string
  description: string
  technical: number
  nonTechnical: number
  skilled: number
  semiUnskilled: number
}

export interface WhyApsonFeatureItem {
  number: string
  title: string
  description: string
  iconName?: string
}

export interface WhyApsonContent {
  eyebrow: string
  heading: string
  introduction: string
  features: WhyApsonFeatureItem[]
}

export interface HomeCTAContent {
  eyebrow: string
  heading: string
  description: string
  primaryCtaText: string
  primaryCtaHref: string
  secondaryCtaText: string
  secondaryCtaHref: string
}

export interface HomePageContentPayload {
  heroSlides: HeroSlide[]
  companyIntro: CompanyIntroContent
  manpower: ManpowerContent
  whyApson: WhyApsonContent
  cta: HomeCTAContent
}
