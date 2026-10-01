import { motion } from 'framer-motion'
import { ContactInfoCards } from '@/components/contact/ContactInfoCards'
import { ContactForm } from '@/components/contact/ContactForm'
import { FullWidthMap } from '@/components/contact/FullWidthMap'

export function ContactPage() {
  return (
    <main className="flex-1 w-full bg-[#F7F8FA] text-[#111827]">
      {/* 1. Header Hero Banner */}
      <section className="bg-[#0B1220] text-white py-12 sm:py-16 border-b border-[#2A3649] relative overflow-hidden">
        <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-[#2F80ED] to-transparent opacity-80 absolute top-0 left-0" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#2F80ED]/15 border border-[#2F80ED]/30 text-[#2F80ED] text-xs font-bold tracking-wider uppercase">
            <span>GET IN TOUCH</span>
          </div>

          <h1 className="font-['Manrope'] text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white">
            Contact APSON Industries
          </h1>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Have a requirement for electrodynamic vibration systems, environmental test chambers, shock equipment, or custom mechanical/electrical assemblies? Connect with our engineering specialists.
          </p>
        </div>
      </section>

      {/* 2. Main Interactive Section (Contact Info + Query Form) */}
      <section className="py-12 sm:py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start"
          >
            {/* Left Column: Contact Details Cards */}
            <div className="lg:col-span-5">
              <ContactInfoCards />
            </div>

            {/* Right Column: Query Submission Form */}
            <div className="lg:col-span-7">
              <ContactForm />
            </div>
          </motion.div>
        </div>
      </section>

      {/* 3. Full-Width Embedded Interactive Map Section */}
      <FullWidthMap />
    </main>
  )
}
