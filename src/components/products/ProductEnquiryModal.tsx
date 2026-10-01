import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  X,
  Package,
  User,
  Building,
  Mail,
  Phone,
  MessageSquare,
  RefreshCw,
  Send,
  Loader2,
  CheckCircle,
} from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const enquirySchema = z.object({
  productName: z.string().min(1, 'Product is required'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  company: z.string().min(2, 'Company / Location is required'),
  email: z.string().email('Please enter a valid email address'),
  phone: z
    .string()
    .min(10, 'Phone number must be at least 10 digits')
    .max(15, 'Invalid phone number format'),
  message: z.string().min(10, 'Message must be at least 10 characters long'),
  captchaAnswer: z.string().min(1, 'Please solve the captcha verification'),
})

type EnquiryInputs = z.infer<typeof enquirySchema>

interface ProductEnquiryModalProps {
  productName: string | null
  onClose: () => void
}

interface CaptchaState {
  num1: number
  num2: number
  expectedAnswer: number
}

export function ProductEnquiryModal({ productName, onClose }: ProductEnquiryModalProps) {
  const [captcha, setCaptcha] = useState<CaptchaState>({ num1: 0, num2: 0, expectedAnswer: 0 })
  const [captchaError, setCaptchaError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

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

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<EnquiryInputs>({
    resolver: zodResolver(enquirySchema),
    defaultValues: {
      productName: productName || '',
    },
  })

  useEffect(() => {
    if (productName) {
      setValue('productName', productName)
    }
  }, [productName, setValue])

  useEffect(() => {
    if (!toast) return
    const timer = setTimeout(() => {
      setToast(null)
      onClose()
    }, 4000)
    return () => clearTimeout(timer)
  }, [toast, onClose])

  if (!productName) return null

  const onSubmit = async (data: EnquiryInputs) => {
    setCaptchaError(null)

    if (parseInt(data.captchaAnswer, 10) !== captcha.expectedAnswer) {
      setCaptchaError('Incorrect captcha answer. Please try again.')
      generateCaptcha()
      return
    }

    setIsSubmitting(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsSubmitting(false)

    setToast({
      type: 'success',
      message: `Your inquiry for "${data.productName}" has been submitted successfully. Our engineering team will get back to you shortly.`,
    })
  }

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-[#0B1220]/80 backdrop-blur-sm"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.3 }}
          className="relative w-full max-w-2xl bg-white rounded-2xl border border-slate-200 shadow-2xl overflow-hidden z-10 my-8"
        >
          {/* Header */}
          <div className="bg-[#0B1220] text-white p-6 flex items-start justify-between gap-4 border-b border-[#2A3649]">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#2F80ED]/20 text-[#2F80ED] text-[11px] font-bold tracking-wider uppercase mb-1">
                <Package className="w-3.5 h-3.5" />
                <span>PRODUCT ENQUIRY</span>
              </div>
              <h3 className="font-['Manrope'] text-xl font-extrabold text-white">
                Request Product Specifications &amp; Quote
              </h3>
              <p className="text-slate-300 text-xs mt-1">
                Selected Product: <span className="font-bold text-[#2F80ED]">{productName}</span>
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-white/10 text-slate-300 hover:text-white hover:bg-white/20 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form Content */}
          <div className="p-6 sm:p-8">
            {toast ? (
              <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-xl text-center space-y-3">
                <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto" />
                <h4 className="font-['Manrope'] font-bold text-lg text-emerald-900">
                  Inquiry Submitted Successfully!
                </h4>
                <p className="text-emerald-700 text-sm">{toast.message}</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
                {/* Product Name (Pre-filled) */}
                <div className="space-y-1">
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#0B1220]">
                    Target Product
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <Package className="w-4 h-4 text-[#2F80ED]" />
                    </div>
                    <input
                      type="text"
                      readOnly
                      {...register('productName')}
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-100 border border-slate-300 rounded-lg text-sm font-bold text-[#0B1220] cursor-not-allowed"
                    />
                  </div>
                </div>

                {/* Name & Company Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Name */}
                  <div className="space-y-1">
                    <label htmlFor="modal-name" className="block text-xs font-bold uppercase tracking-wider text-[#0B1220]">
                      Full Name <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        <User className="w-4 h-4" />
                      </div>
                      <input
                        id="modal-name"
                        type="text"
                        placeholder="Your full name"
                        {...register('name')}
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#2F80ED]"
                      />
                    </div>
                    {errors.name && <p className="text-xs text-rose-500 font-medium">{errors.name.message}</p>}
                  </div>

                  {/* Company */}
                  <div className="space-y-1">
                    <label htmlFor="modal-company" className="block text-xs font-bold uppercase tracking-wider text-[#0B1220]">
                      Company / Organization <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        <Building className="w-4 h-4" />
                      </div>
                      <input
                        id="modal-company"
                        type="text"
                        placeholder="Company or facility location"
                        {...register('company')}
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#2F80ED]"
                      />
                    </div>
                    {errors.company && <p className="text-xs text-rose-500 font-medium">{errors.company.message}</p>}
                  </div>
                </div>

                {/* Email & Phone Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Email */}
                  <div className="space-y-1">
                    <label htmlFor="modal-email" className="block text-xs font-bold uppercase tracking-wider text-[#0B1220]">
                      Email Address <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        <Mail className="w-4 h-4" />
                      </div>
                      <input
                        id="modal-email"
                        type="email"
                        placeholder="name@company.com"
                        {...register('email')}
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#2F80ED]"
                      />
                    </div>
                    {errors.email && <p className="text-xs text-rose-500 font-medium">{errors.email.message}</p>}
                  </div>

                  {/* Phone */}
                  <div className="space-y-1">
                    <label htmlFor="modal-phone" className="block text-xs font-bold uppercase tracking-wider text-[#0B1220]">
                      Phone Number <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        <Phone className="w-4 h-4" />
                      </div>
                      <input
                        id="modal-phone"
                        type="tel"
                        placeholder="10-digit mobile number"
                        {...register('phone')}
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#2F80ED]"
                      />
                    </div>
                    {errors.phone && <p className="text-xs text-rose-500 font-medium">{errors.phone.message}</p>}
                  </div>
                </div>

                {/* Message */}
                <div className="space-y-1">
                  <label htmlFor="modal-message" className="block text-xs font-bold uppercase tracking-wider text-[#0B1220]">
                    Testing Requirement / Inquiry Message <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute top-3 left-3 flex items-start pointer-events-none text-slate-400">
                      <MessageSquare className="w-4 h-4" />
                    </div>
                    <textarea
                      id="modal-message"
                      rows={3}
                      placeholder="Specify your testing requirements, dimensions, force ratings, or technical questions..."
                      {...register('message')}
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#2F80ED]"
                    />
                  </div>
                  {errors.message && <p className="text-xs text-rose-500 font-medium">{errors.message.message}</p>}
                </div>

                {/* Captcha */}
                <div className="p-3 bg-slate-100 rounded-xl border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <label htmlFor="modal-captcha" className="text-xs font-bold uppercase tracking-wider text-[#0B1220] flex items-center gap-2">
                      <span>Captcha Security:</span>
                      <span className="font-mono text-sm font-black text-[#2F80ED] bg-white px-2.5 py-0.5 rounded border border-slate-300">
                        {captcha.num1} + {captcha.num2} = ?
                      </span>
                    </label>
                    <button
                      type="button"
                      onClick={generateCaptcha}
                      className="text-xs text-slate-500 hover:text-[#2F80ED] inline-flex items-center gap-1"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Refresh</span>
                    </button>
                  </div>
                  <input
                    id="modal-captcha"
                    type="text"
                    placeholder="Enter result"
                    {...register('captchaAnswer')}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#2F80ED]"
                  />
                  {errors.captchaAnswer && <p className="text-xs text-rose-500 font-medium">{errors.captchaAnswer.message}</p>}
                  {captchaError && <p className="text-xs text-rose-500 font-medium">{captchaError}</p>}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 px-6 bg-[#0B1220] hover:bg-[#2F80ED] text-white text-sm font-bold tracking-wide uppercase rounded-lg shadow-md hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-[#2F80ED] disabled:opacity-70"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Submitting Inquiry...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Submit Product Inquiry</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
