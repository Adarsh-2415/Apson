import type { SectionDefinition } from '@/types/builder'
import { heroSectionDefinition } from './definitions/heroSection'
import { richTextSectionDefinition } from './definitions/richTextSection'
import { textImageSectionDefinition } from './definitions/textImageSection'
import { whyApsonSectionDefinition } from './definitions/whyApsonSection'
import { manpowerSectionDefinition } from './definitions/manpowerSection'
import { featuredProductsSectionDefinition } from './definitions/featuredProductsSection'
import { ctaSectionDefinition } from './definitions/ctaSection'
import { dividerSectionDefinition } from './definitions/dividerSection'
import { spacerSectionDefinition } from './definitions/spacerSection'

export const sectionRegistry: Record<string, SectionDefinition> = {
  hero: heroSectionDefinition,
  rich_text: richTextSectionDefinition,
  text_image: textImageSectionDefinition,
  why_apson: whyApsonSectionDefinition,
  manpower: manpowerSectionDefinition,
  featured_products: featuredProductsSectionDefinition,
  contact_cta: ctaSectionDefinition,
  divider: dividerSectionDefinition,
  spacer: spacerSectionDefinition,
}

export const registeredSectionList: SectionDefinition[] = Object.values(sectionRegistry)

export function getSectionDefinition(type: string): SectionDefinition | undefined {
  return sectionRegistry[type]
}
