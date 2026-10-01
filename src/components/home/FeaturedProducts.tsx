import { Link } from 'react-router-dom'
import { motion, useReducedMotion, type Variants } from 'framer-motion'
import { ArrowRight, Boxes } from 'lucide-react'
import type { ProductRecord } from '@/types/products'

interface FeaturedProductsProps {
  eyebrow?: string
  heading?: string
  description?: string
  products?: ProductRecord[]
  ctaText?: string
  ctaHref?: string
}

export function FeaturedProducts({
  eyebrow = 'OUR PRODUCTS',
  heading = 'Featured Testing & Engineering Solutions',
  description = "Explore APSON Industries' range of testing systems, environmental chambers, vibration equipment and specialized engineering solutions.",
  products = [],
  ctaText = 'View All Products',
  ctaHref = '/products',
}: FeaturedProductsProps) {
  const shouldReduceMotion = useReducedMotion()

  // Filter only published and featured products, ordered by display_order
  const displayProducts = (products || [])
    .filter((p) => p.is_published && p.is_featured)
    .sort((a, b) => a.display_order - b.display_order)
    .slice(0, 6)

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : 0.1,
        delayChildren: 0.05,
      },
    },
  }

  const cardVariants: Variants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: [0, 0, 0.2, 1] },
    },
  }

  return (
    <section className="bg-[#F7F8FA] text-[#111827] py-16 sm:py-24 border-b border-slate-200 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 lg:mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 justify-center">
            <span className="w-2 h-2 rounded-full bg-[#2F80ED]" />
            <span className="font-['Manrope'] text-xs font-bold tracking-widest text-[#2F80ED] uppercase">
              {eyebrow}
            </span>
          </div>

          <h2 className="font-['Manrope'] text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#0B1220] tracking-tight">
            {heading}
          </h2>

          <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
            {description}
          </p>
        </div>

        {/* Product Cards Grid */}
        {displayProducts.length > 0 ? (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {displayProducts.map((product) => (
              <motion.div key={product.id} variants={cardVariants}>
                <Link
                  to="/products"
                  className="group flex flex-col h-full bg-white rounded-xl border border-slate-200 hover:border-[#2F80ED]/40 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden"
                >
                  {/* Equipment Photo */}
                  <div className="relative aspect-[4/3] bg-[#0B1220] overflow-hidden">
                    <img
                      src={product.image_src}
                      alt={product.image_alt || product.name}
                      className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0B1220]/60 via-transparent to-transparent opacity-60 group-hover:opacity-30 transition-opacity" />
                  </div>

                  {/* Card Content Body */}
                  <div className="p-6 flex flex-col flex-1 justify-between space-y-4">
                    <div className="space-y-2">
                      {product.category && (
                        <span className="inline-block px-2.5 py-0.5 rounded-full bg-[#2F80ED]/10 text-[#2F80ED] text-[10px] font-bold tracking-wider uppercase">
                          {product.category}
                        </span>
                      )}
                      <h3 className="font-['Manrope'] font-bold text-lg text-[#0B1220] group-hover:text-[#2F80ED] transition-colors leading-snug">
                        {product.name}
                      </h3>
                      <p className="text-slate-600 text-sm leading-relaxed line-clamp-2">
                        {product.short_description}
                      </p>
                    </div>

                    {/* Industrial Action Link */}
                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-[#0B1220] group-hover:text-[#2F80ED] transition-colors">
                      <span>View Solution</span>
                      <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          /* Clean CMS-ready Empty State */
          <div className="bg-white rounded-xl border border-slate-200 p-12 text-center max-w-xl mx-auto space-y-3">
            <Boxes className="w-10 h-10 text-slate-400 mx-auto" />
            <h3 className="font-['Manrope'] font-bold text-lg text-[#0B1220]">
              Catalogue Updating
            </h3>
            <p className="text-slate-500 text-sm">
              No featured products are currently published in the system. Check back soon or view our full catalogue.
            </p>
          </div>
        )}

        {/* Section Bottom CTA Button */}
        <div className="mt-12 lg:mt-16 text-center">
          <Link
            to={ctaHref}
            className="inline-flex items-center gap-3 px-8 py-3.5 bg-[#0B1220] hover:bg-[#2F80ED] text-white text-sm font-semibold rounded-md shadow-md hover:shadow-lg transition-all duration-200 group focus:outline-none focus:ring-2 focus:ring-[#2F80ED]"
          >
            <span>{ctaText}</span>
            <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-white transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  )
}
