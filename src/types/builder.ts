import type { ComponentType } from 'react'
import type { LucideIcon } from 'lucide-react'
import type { z } from 'zod'

export type PageStatus = 'draft' | 'published'

export interface PageRecord {
  id: string
  title: string
  slug: string
  status: PageStatus
  seo_title?: string
  seo_description?: string
  created_at: string
  updated_at: string
  published_at?: string
}

export interface PageSection<T = Record<string, any>> {
  id: string
  page_id: string
  section_type: string
  content: T
  display_order: number
  is_visible: boolean
  created_at?: string
  updated_at?: string
}

export interface SectionDefinition<T = any> {
  type: string
  label: string
  category: 'Content' | 'Company' | 'Products' | 'Conversion' | 'Layout'
  description: string
  icon: LucideIcon
  defaultContent: T
  validationSchema: z.ZodTypeAny
  editor: ComponentType<{
    value: T
    onChange: (val: T) => void
  }>
  renderer: ComponentType<{
    content: T
    isPreview?: boolean
  }>
}
