interface HeroSlideProps {
  imageSrc: string
  altText: string
  isActive: boolean
}

export function HeroSlide({ imageSrc, altText, isActive }: HeroSlideProps) {
  return (
    <div
      className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
        isActive ? 'opacity-100 z-0' : 'opacity-0 pointer-events-none'
      }`}
    >
      {/* Ken Burns Zoom Image */}
      <img
        src={imageSrc}
        alt={altText}
        className={`w-full h-full object-cover transition-transform duration-[6500ms] ease-out ${
          isActive ? 'scale-105' : 'scale-100'
        }`}
      />

      {/* Soft Bottom Vignette Gradient */}
      <div className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-[#0B1220]/80 via-[#0B1220]/30 to-transparent pointer-events-none" />
    </div>
  )
}
