import { useState, useEffect } from 'react'
import type { HomePageContentPayload } from '@/types/homeCms'
import type { ProductRecord } from '@/types/products'
import { cmsService } from '@/services/cmsService'
import { productService } from '@/services/productService'
import { HeroSlider } from '@/components/home/HeroSlider'
import { CompanyIntro } from '@/components/home/CompanyIntro'
import { ManpowerStrength } from '@/components/home/ManpowerStrength'
import { FeaturedProducts } from '@/components/home/FeaturedProducts'
import { WhyApson } from '@/components/home/WhyApson'
import { ContactCTA } from '@/components/home/ContactCTA'

export function HomePage() {
  const [content, setContent] = useState<HomePageContentPayload | null>(null)
  const [publishedProducts, setPublishedProducts] = useState<ProductRecord[]>([])

  useEffect(() => {
    let isMounted = true

    async function loadData() {
      const [cmsRes, productsRes] = await Promise.all([
        cmsService.getHomePageContent(),
        productService.getPublishedProducts(),
      ])

      if (isMounted) {
        if (cmsRes.data) setContent(cmsRes.data)
        if (productsRes.data) setPublishedProducts(productsRes.data)
      }
    }

    loadData()
    return () => {
      isMounted = false
    }
  }, [])

  return (
    <main className="flex-1 w-full">
      {/* 1. Hero Showcase Slider */}
      <HeroSlider slides={content?.heroSlides} />

      {/* 2. Company Introduction Section */}
      <CompanyIntro data={content?.companyIntro} />

      {/* 3. Manpower Strength Workforce Section */}
      <ManpowerStrength data={content?.manpower} />

      {/* 4. Dynamic Featured Products Section */}
      <FeaturedProducts products={publishedProducts} />

      {/* 5. Why APSON Section */}
      <WhyApson data={content?.whyApson} />

      {/* 6. Contact CTA Section */}
      <ContactCTA data={content?.cta} />
    </main>
  )
}
