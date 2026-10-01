import { useState } from 'react'
import { useNavigate, Navigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { Eye, EyeOff, Lock, Mail, Loader2, AlertCircle } from 'lucide-react'

export function AdminLoginPage() {
  const navigate = useNavigate()
  const { session, signIn } = useAuth()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  // Redirect to dashboard if already authenticated
  if (session) {
    return <Navigate to="/admin/dashboard" replace />
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage(null)

    if (!email || !password) {
      setErrorMessage('Please enter both email and password.')
      return
    }

    setIsSubmitting(true)

    try {
      const { error } = await signIn(email, password)
      if (error) {
        setErrorMessage(error.message || 'Invalid email or password. Please try again.')
      } else {
        navigate('/admin/dashboard', { replace: true })
      }
    } catch {
      setErrorMessage('Unable to sign in right now. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0B1220] flex items-center justify-center p-4 sm:p-6 lg:p-8 font-sans selection:bg-[#2F80ED] selection:text-white">
      {/* Background Subtle Grid Texture */}
      <div
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(rgba(47, 128, 237, 0.4) 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
      />

      <div className="relative z-10 w-full max-w-md bg-[#1A2433] rounded-2xl border border-[#2A3649] shadow-2xl p-8 sm:p-10 space-y-6">
        
        {/* Header */}
        <div className="space-y-1">
          <h2 className="font-['Manrope'] text-2xl sm:text-3xl font-extrabold text-white">
            Sign In to Admin Panel
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm">
            Enter your credentials to manage website content and view inquiries.
          </p>
        </div>

        {/* Form Error Message */}
        {errorMessage && (
          <div className="p-3.5 bg-rose-950/80 border border-rose-600/50 rounded-xl flex items-center gap-3 text-xs text-rose-200">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5" noValidate>
          {/* Email Field */}
          <div className="space-y-1.5">
            <label htmlFor="admin-email" className="block text-xs font-bold uppercase tracking-wider text-slate-300">
              Admin Email <span className="text-rose-400">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Mail className="w-4 h-4" />
              </div>
              <input
                id="admin-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter admin email"
                required
                autoComplete="email"
                className="w-full pl-10 pr-4 py-3 bg-[#0B1220] border border-[#2A3649] rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#2F80ED] focus:border-transparent transition-all"
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="space-y-1.5">
            <label htmlFor="admin-password" className="block text-xs font-bold uppercase tracking-wider text-slate-300">
              Password <span className="text-rose-400">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                id="admin-password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                required
                autoComplete="current-password"
                className="w-full pl-10 pr-11 py-3 bg-[#0B1220] border border-[#2A3649] rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#2F80ED] focus:border-transparent transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-white transition-colors"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 px-6 bg-[#2F80ED] hover:bg-[#1d6ed8] text-white font-bold text-xs sm:text-sm uppercase tracking-wider rounded-xl shadow-lg shadow-[#2F80ED]/25 transition-all focus:outline-none focus:ring-2 focus:ring-[#2F80ED] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-white" />
                <span>Signing in...</span>
              </>
            ) : (
              <span>Sign In</span>
            )}
          </button>
        </form>
      </div>
    </div>
  )
}
