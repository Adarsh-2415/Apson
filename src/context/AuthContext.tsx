import { useEffect, useState, type ReactNode } from 'react'
import type { Session, User } from '@supabase/supabase-js'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import { AuthContext } from '@/context/AuthContextObject'

const MOCK_SESSION_KEY = 'apson_admin_mock_session'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (isSupabaseConfigured) {
      // 1. Real Supabase Auth Flow
      supabase.auth.getSession().then(({ data: { session } }) => {
        setSession(session)
        setUser(session?.user ?? null)
        setIsLoading(false)
      })

      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        setSession(session)
        setUser(session?.user ?? null)
        setIsLoading(false)
      })

      return () => subscription.unsubscribe()
    } else {
      // 2. Development Mode Mock Session Fallback
      const stored = localStorage.getItem(MOCK_SESSION_KEY)
      if (stored) {
        try {
          const parsed = JSON.parse(stored) as { email: string; id: string }
          const mockUser = {
            id: parsed.id,
            email: parsed.email,
            app_metadata: {},
            user_metadata: { role: 'admin' },
            aud: 'authenticated',
            created_at: new Date().toISOString(),
          } as User

          const mockSession = {
            access_token: 'mock-token',
            token_type: 'bearer',
            user: mockUser,
          } as Session

          setUser(mockUser)
          setSession(mockSession)
        } catch {
          localStorage.removeItem(MOCK_SESSION_KEY)
        }
      }
      setIsLoading(false)
    }
  }, [])

  const signIn = async (email: string, pass: string): Promise<{ error: Error | null }> => {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password: pass,
      })

      if (error) {
        return { error: new Error('Invalid email or password. Please try again.') }
      }

      setUser(data.user)
      setSession(data.session)
      return { error: null }
    } else {
      // Mock auth validation for testing prior to Supabase connection
      if (!email || !pass || pass.length < 6) {
        return { error: new Error('Invalid email or password. Please try again.') }
      }

      const mockUser = {
        id: 'dev-admin-id',
        email,
        app_metadata: {},
        user_metadata: { role: 'admin' },
        aud: 'authenticated',
        created_at: new Date().toISOString(),
      } as User

      const mockSession = {
        access_token: 'mock-token',
        token_type: 'bearer',
        user: mockUser,
      } as Session

      localStorage.setItem(MOCK_SESSION_KEY, JSON.stringify({ email, id: 'dev-admin-id' }))
      setUser(mockUser)
      setSession(mockSession)
      return { error: null }
    }
  }

  const signOut = async () => {
    if (isSupabaseConfigured) {
      await supabase.auth.signOut()
    } else {
      localStorage.removeItem(MOCK_SESSION_KEY)
    }
    setUser(null)
    setSession(null)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        isLoading,
        isConfigured: isSupabaseConfigured,
        signIn,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
