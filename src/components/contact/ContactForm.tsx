import { useState, useEffect, useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion, AnimatePresence } from 'framer-motion'
import {
  User,
  Mail,
  Phone,
  MapPin,
  MessageSquare,
  RefreshCw,
  Send,
  Loader2,
  CheckCircle,
  AlertCircle,
  X,
} from 'lucide-react'
import { contactFormSchema, type ContactFormInputs } from '@/types/contact'
import { inquiryService } from '@/services/inquiryService'

interface CaptchaState {
  num1: number
  num2: number
  expectedAnswer: number
}

export function ContactForm() {
  const [captcha, setCaptcha] = useState<CaptchaState>({ num1: 0, num2: 0, expectedAnswer: 0 })
  const [captchaError, setCaptchaError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

  // Generate dynamic math captcha
  const generateCaptcha = useCallback(() => {
    const n1 = Math.floor(Math.random() * 9) + 1
    const n2 = Math.floor(Math.random() * 9) + 1
    setCaptcha({
      num1: n1,
      num2: n2,
      expectedAnswer: n1 + n2,
    })
    setCaptchaError(null)
  }, [])

  useEffect(() => {
    generateCaptcha()
  }, [generateCaptcha])

  // React Hook Form initialization
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormInputs>({
    resolver: zodResolver(contactFormSchema),
  })

  // Auto-dismiss toast notification
  useEffect(() => {
    if (!toast) return
    const timer = setTimeout(() => {
      setToast(null)
    }, 5000)
    return () => clearTimeout(timer)
  }, [toast])

  const onSubmit = async (data: ContactFormInputs) => {
    setCaptchaError(null)

    // Verify Captcha
    if (parseInt(data.captchaAnswer, 10) !== captcha.expectedAnswer) {
      setCaptchaError('Incorrect captcha answer. Please try again.')
      generateCaptcha()
      return
    }

    setIsSubmitting(true)

    // Persist Inquiry via inquiryService
    const res = await inquiryService.createInquiry({
      name: data.name,
      email: data.email,
      phone: data.phone,
      address: data.address,
      message: data.message,
    })

    setIsSubmitting(false)

    if (res.error) {
      setToast({
        type: 'error',
        message: 'Failed to submit inquiry. Please try again.',
      })
    } else {
      setToast({
        type: 'success',
        message: 'Thank you! Your inquiry has been submitted successfully. Our team will contact you shortly.',
      })
      reset()
      generateCaptcha()
    }
  }

  return (
    <div className="relative">
      {/* Animated Notification Toast Alert */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className={`fixed top-5 right-5 z-50 max-w-md w-full p-4 rounded-xl shadow-2xl border flex items-start justify-between gap-3 text-sm ${toast.type === 'success'
                ? 'bg-[#0B1220] border-emerald-500 text-white'
                : 'bg-rose-950 border-rose-500 text-white'
              }`}
          >
            <div className="flex items-start gap-3">
              {toast.type === 'success' ? (
                <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
              )}
              <div>
                <h4 className="font-bold font-['Manrope'] mb-0.5">
                  {toast.type === 'success' ? 'Inquiry Received' : 'Submission Error'}
                </h4>
                <p className="text-slate-300 text-xs leading-relaxed">{toast.message}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setToast(null)}
              className="text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Form Container Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 lg:p-10 shadow-lg">
        <div className="mb-6 space-y-1">
          <h2 className="font-['Manrope'] text-2xl font-extrabold text-[#0B1220]">
            Send Us a Query
          </h2>
          <p className="text-slate-600 text-sm">
            Fill out the technical inquiry form below and our engineering specialists will respond promptly.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
          {/* Field 1: Name */}
          <div className="space-y-1.5">
            <label htmlFor="name" className="block text-xs font-bold uppercase tracking-wider text-[#0B1220]">
              Full Name <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <User className="w-4 h-4" />
              </div>
              <input
                id="name"
                type="text"
                placeholder="Your full name"
                {...register('name')}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#2F80ED] focus:bg-white transition-all"
              />
            </div>
            {errors.name && <p className="text-xs text-rose-500 font-medium">{errors.name.message}</p>}
          </div>

          {/* Field 2 & 3: Email & Phone Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Field 2: Email */}
            <div className="space-y-1.5">
              <label htmlFor="email" className="block text-xs font-bold uppercase tracking-wider text-[#0B1220]">
                Email Address <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  id="email"
                  type="email"
                  placeholder="name@company.com"
                  {...register('email')}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#2F80ED] focus:bg-white transition-all"
                />
              </div>
              {errors.email && <p className="text-xs text-rose-500 font-medium">{errors.email.message}</p>}
            </div>

            {/* Field 4: Phone Number */}
            <div className="space-y-1.5">
              <label htmlFor="phone" className="block text-xs font-bold uppercase tracking-wider text-[#0B1220]">
                Phone Number <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Phone className="w-4 h-4" />
                </div>
                <input
                  id="phone"
                  type="tel"
                  placeholder="Your 10-digit mobile number"
                  {...register('phone')}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#2F80ED] focus:bg-white transition-all"
                />
              </div>
              {errors.phone && <p className="text-xs text-rose-500 font-medium">{errors.phone.message}</p>}
            </div>
          </div>

          {/* Field 3: Address */}
          <div className="space-y-1.5">
            <label htmlFor="address" className="block text-xs font-bold uppercase tracking-wider text-[#0B1220]">
              Address / Location <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <MapPin className="w-4 h-4" />
              </div>
              <input
                id="address"
                type="text"
                placeholder="City, State / Company Location"
                {...register('address')}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#2F80ED] focus:bg-white transition-all"
              />
            </div>
            {errors.address && <p className="text-xs text-rose-500 font-medium">{errors.address.message}</p>}
          </div>

          {/* Field 5: Message */}
          <div className="space-y-1.5">
            <label htmlFor="message" className="block text-xs font-bold uppercase tracking-wider text-[#0B1220]">
              Query / Message <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute top-3 left-3 flex items-start pointer-events-none text-slate-400">
                <MessageSquare className="w-4 h-4" />
              </div>
              <textarea
                id="message"
                rows={4}
                placeholder="Please describe your testing equipment requirements or technical inquiry..."
                {...register('message')}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#2F80ED] focus:bg-white transition-all"
              />
            </div>
            {errors.message && <p className="text-xs text-rose-500 font-medium">{errors.message.message}</p>}
          </div>

          {/* Field 6: Math Verification Captcha Challenge */}
          <div className="p-4 bg-slate-100 rounded-xl border border-slate-200 space-y-2">
            <div className="flex items-center justify-between">
              <label htmlFor="captchaAnswer" className="text-xs font-bold uppercase tracking-wider text-[#0B1220] flex items-center gap-2">
                <span>Security Verification:</span>
                <span className="font-mono text-sm font-black text-[#2F80ED] bg-white px-2.5 py-0.5 rounded border border-slate-300">
                  {captcha.num1} + {captcha.num2} = ?
                </span>
              </label>

              <button
                type="button"
                onClick={generateCaptcha}
                className="text-xs text-slate-500 hover:text-[#2F80ED] inline-flex items-center gap-1 transition-colors"
                title="Generate new captcha"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Refresh</span>
              </button>
            </div>

            <input
              id="captchaAnswer"
              type="text"
              placeholder="Enter result"
              {...register('captchaAnswer')}
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#2F80ED]"
            />
            {errors.captchaAnswer && (
              <p className="text-xs text-rose-500 font-medium">{errors.captchaAnswer.message}</p>
            )}
            {captchaError && <p className="text-xs text-rose-500 font-medium">{captchaError}</p>}
          </div>

          {/* Field 7: Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 px-6 bg-[#0B1220] hover:bg-[#2F80ED] text-white text-sm font-bold tracking-wide uppercase rounded-lg shadow-md hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-[#2F80ED] focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-white" />
                <span>Submitting Inquiry...</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>Submit Technical Inquiry</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  )
}
