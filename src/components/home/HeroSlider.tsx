import { useState, useEffect, useCallback } from 'react'
import type { HeroSlide as HeroSlideType } from '@/types/homeCms'
import { HeroSlide } from './HeroSlide'
import { SliderControls } from './SliderControls'
import { SliderPagination } from './SliderPagination'

interface HeroSliderProps {
  slides?: HeroSlideType[]
}

const DEFAULT_SLIDES: HeroSlideType[] = [
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
]

const AUTO_PLAY_INTERVAL_MS = 5000

export function HeroSlider({ slides = DEFAULT_SLIDES }: HeroSliderProps) {
  const activeSlides = slides && slides.length > 0 ? slides : DEFAULT_SLIDES
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isPaused, setIsPaused] = useState(false)

  const handleNext = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % activeSlides.length)
  }, [activeSlides.length])

  const handlePrev = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + activeSlides.length) % activeSlides.length)
  }, [activeSlides.length])

  const handleSelect = useCallback((index: number) => {
    setCurrentSlide(index)
  }, [])

  // Auto-play timer (5 seconds)
  useEffect(() => {
    if (isPaused) return

    const timer = setInterval(() => {
      handleNext()
    }, AUTO_PLAY_INTERVAL_MS)

    return () => clearInterval(timer)
  }, [handleNext, isPaused])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        handlePrev()
      } else if (e.key === 'ArrowRight') {
        handleNext()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleNext, handlePrev])

  return (
    <div
      tabIndex={0}
      role="region"
      aria-label="Equipment Showcase Hero Slider"
      className="relative w-full h-[380px] sm:h-[480px] lg:h-[580px] xl:h-[640px] bg-[#0B1220] overflow-hidden select-none border-b border-[#2A3649] focus:outline-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={() => setIsPaused(true)}
      onTouchEnd={() => setIsPaused(false)}
    >
      {/* Stacked Slides */}
      {activeSlides.map((slide, idx) => (
        <HeroSlide
          key={slide.id || idx}
          imageSrc={slide.imageSrc}
          altText={slide.imageAlt || slide.title}
          isActive={idx === currentSlide}
        />
      ))}

      {/* Glassmorphism Navigation Arrow Controls */}
      <SliderControls onPrev={handlePrev} onNext={handleNext} />

      {/* Capsule Progress Pill Indicators */}
      <SliderPagination
        totalSlides={activeSlides.length}
        currentIndex={currentSlide}
        isPaused={isPaused}
        onSelect={handleSelect}
      />
    </div>
  )
}
