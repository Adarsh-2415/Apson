interface SliderPaginationProps {
  totalSlides: number
  currentIndex: number
  isPaused: boolean
  onSelect: (index: number) => void
}

export function SliderPagination({
  totalSlides,
  currentIndex,
  isPaused,
  onSelect,
}: SliderPaginationProps) {
  return (
    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center space-x-3 px-4 py-2.5 rounded-full bg-black/30 backdrop-blur-md border border-white/20 z-20 shadow-xl">
      {Array.from({ length: totalSlides }).map((_, i) => {
        const isActive = i === currentIndex

        return (
          <button
            key={i}
            type="button"
            onClick={() => onSelect(i)}
            className={`h-2 rounded-full transition-all relative overflow-hidden focus:outline-none focus:ring-1 focus:ring-[#2F80ED] ${
              isActive ? 'w-12 bg-white/20' : 'w-3 bg-white/40 hover:bg-white/70'
            }`}
            aria-label={`Go to slide ${i + 1}`}
          >
            {isActive && (
              <span
                key={`${currentIndex}-${isPaused}`}
                className={`absolute inset-y-0 left-0 bg-[#2F80ED] rounded-full transition-all ${
                  isPaused ? 'w-full duration-0' : 'w-full duration-[5000ms] ease-linear'
                }`}
                style={{
                  animationName: isPaused ? 'none' : undefined,
                }}
              />
            )}
          </button>
        )
      })}
    </div>
  )
}
