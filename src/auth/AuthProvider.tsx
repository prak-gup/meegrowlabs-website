import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import type { Session, User } from '@supabase/supabase-js'
import { supabase, supabaseConfigured } from '../lib/supabase'

type Result = { error: string | null }
type AuthCtx = {
  user: User | null
  session: Session | null
  loading: boolean
  configured: boolean
  signUpWithPassword: (email: string, password: string) => Promise<Result>
  signInWithPassword: (email: string, password: string) => Promise<Result>
  signInWithEmail: (email: string) => Promise<Result>
  signInWithGoogle: () => Promise<void>
  signOut: () => Promise<void>
}

const Ctx = createContext<AuthCtx | null>(null)

function toMailerLite(email: string) {
  fetch('/.netlify/functions/subscribe', {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email }),
  }).catch(() => {})
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!supabase) { setLoading(false); return }
    supabase.auth.getSession().then(({ data }) => { setSession(data.session); setLoading(false) })
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setSession(s))
    return () => sub.subscription.unsubscribe()
  }, [])

  const value: AuthCtx = {
    user: session?.user ?? null,
    session,
    loading,
    configured: supabaseConfigured,
    // Primary: email + password (instant, no email rate limit, reliable for repeat logins).
    async signUpWithPassword(email, password) {
      if (!supabase) return { error: 'Auth not configured yet.' }
      const { error } = await supabase.auth.signUp({ email, password, options: { emailRedirectTo: `${window.location.origin}/app` } })
      if (error) {
        // already registered → just log them in
        if (/already registered|already exists|User already/i.test(error.message)) {
          const { error: e2 } = await supabase.auth.signInWithPassword({ email, password })
          return { error: e2?.message ?? null }
        }
        return { error: error.message }
      }
      toMailerLite(email)
      return { error: null }
    },
    async signInWithPassword(email, password) {
      if (!supabase) return { error: 'Auth not configured yet.' }
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      return { error: error?.message ?? null }
    },
    // Optional: magic link (needs custom SMTP in Supabase to avoid rate limits / branded sender).
    async signInWithEmail(email) {
      if (!supabase) return { error: 'Auth not configured yet.' }
      const { error } = await supabase.auth.signInWithOtp({ email, options: { emailRedirectTo: `${window.location.origin}/app` } })
      if (!error) toMailerLite(email)
      return { error: error?.message ?? null }
    },
    async signInWithGoogle() {
      if (!supabase) return
      await supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: `${window.location.origin}/app` } })
    },
    async signOut() { await supabase?.auth.signOut() },
  }

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useAuth() {
  const c = useContext(Ctx)
  if (!c) throw new Error('useAuth must be used within AuthProvider')
  return c
}
