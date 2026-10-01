import { ChevronLeft, ChevronRight } from 'lucide-react'

interface SliderControlsProps {
  onPrev: () => void
  onNext: () => void
}

export function SliderControls({ onPrev, onNext }: SliderControlsProps) {
  return (
    <>
      {/* Previous Arrow Button */}
      <button
        type="button"
        onClick={onPrev}
        className="absolute left-4 sm:left-6 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white hover:scale-110 hover:bg-white/30 transition-all focus:outline-none focus:ring-2 focus:ring-[#2F80ED] z-20 shadow-lg"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>

      {/* Next Arrow Button */}
      <button
        type="button"
        onClick={onNext}
        className="absolute right-4 sm:right-6 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white hover:scale-110 hover:bg-white/30 transition-all focus:outline-none focus:ring-2 focus:ring-[#2F80ED] z-20 shadow-lg"
        aria-label="Next slide"
      >
        <ChevronRight className="w-6 h-6" />
      </button>
    </>
  )
}
