import { useState, useEffect } from 'react'
import type { AboutPageContentPayload } from '@/types/aboutCms'
import { cmsService } from '@/services/cmsService'
import { AboutHero } from '@/components/about/AboutHero'
import { AboutCompanyIntro } from '@/components/about/AboutCompanyIntro'
import { AboutStats } from '@/components/about/AboutStats'
import { AboutMissionVision } from '@/components/about/AboutMissionVision'
import { AboutWhyChoose } from '@/components/about/AboutWhyChoose'
import { AboutCoreValues } from '@/components/about/AboutCoreValues'
import { AboutIndustries } from '@/components/about/AboutIndustries'
import { AboutQualityManufacturing } from '@/components/about/AboutQualityManufacturing'
import { AboutMilestones } from '@/components/about/AboutMilestones'
import { AboutCTA } from '@/components/about/AboutCTA'

export function AboutPage() {
  const [content, setContent] = useState<AboutPageContentPayload | null>(null)

  useEffect(() => {
    let isMounted = true
    async function loadContent() {
      const res = await cmsService.getAboutPageContent()
      if (isMounted && res.data) {
        setContent(res.data)
      }
    }
    loadContent()
    return () => {
      isMounted = false
    }
  }, [])

  if (!content) return null

  return (
    <main className="flex-1 w-full bg-[#F7F8FA] text-[#111827]">
      {/* 1. Hero Section */}
      <AboutHero data={content.hero} />

      {/* 2. Company Introduction */}
      <AboutCompanyIntro data={content.intro} />

      {/* 3. Company Statistics / Highlights */}
      <AboutStats statistics={content.statistics} />

      {/* 4. Mission & Vision */}
      <AboutMissionVision data={content.missionVision} />

      {/* 5. Why Choose APSON */}
      <AboutWhyChoose data={content.whyChoose} />

      {/* 6. Core Values */}
      <AboutCoreValues data={content.coreValues} />

      {/* 7. Industries We Serve */}
      <AboutIndustries data={content.industries} />

      {/* 8. Quality & Manufacturing */}
      <AboutQualityManufacturing data={content.qualityManufacturing} />

      {/* 9. Company Journey / Milestones */}
      <AboutMilestones data={content.milestones} />

      {/* 10. Contact CTA */}
      <AboutCTA data={content.cta} />
    </main>
  )
}
