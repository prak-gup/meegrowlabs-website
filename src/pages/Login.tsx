import { useState } from 'react'
import { useAuth } from '../auth/AuthProvider'

export default function Login() {
  const { signUpWithPassword, signInWithPassword, signInWithEmail, signInWithGoogle, configured } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [mode, setMode] = useState<'signin' | 'signup'>('signup')
  const [err, setErr] = useState<string | null>(null)
  const [linkSent, setLinkSent] = useState(false)
  const [busy, setBusy] = useState(false)

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setBusy(true); setErr(null)
    const fn = mode === 'signup' ? signUpWithPassword : signInWithPassword
    const { error } = await fn(email.trim(), password)
    setBusy(false)
    if (error) setErr(error)
    else window.location.href = '/app'
  }

  async function magicLink() {
    if (!email.trim()) { setErr('Enter your email first.'); return }
    setBusy(true); setErr(null)
    const { error } = await signInWithEmail(email.trim())
    setBusy(false)
    if (error) setErr(error); else setLinkSent(true)
  }

  return (
    <div className="min-h-screen bg-cream-100 flex items-center justify-center px-6">
      <div className="w-full max-w-md bg-white border-4 border-slate-900 rounded-2xl shadow-[8px_8px_0_#0F0F0F] p-8">
        <a href="/" className="font-mono font-bold tracking-widest text-slate-900">&gt;_ MEEGROW <span className="text-green-700">LABS</span></a>
        <h1 className="mt-6 text-3xl font-display font-bold text-slate-900">{mode === 'signup' ? 'Create your free account' : 'Welcome back'}</h1>
        <p className="mt-2 text-slate-600">Track your progress and resume any lesson — free.</p>

        {!configured && <p className="mt-4 text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-lg p-3">Sign-in isn’t switched on yet.</p>}

        {linkSent ? (
          <div className="mt-6 text-green-800 font-semibold">✅ Check your email for a sign-in link.</div>
        ) : (
          <>
            <button onClick={signInWithGoogle} disabled={!configured}
              className="mt-6 w-full border-[3px] border-slate-900 font-bold py-3 rounded-lg disabled:opacity-50 flex items-center justify-center gap-2">
              <span>Continue with Google</span>
            </button>
            <div className="my-4 flex items-center gap-3 text-xs text-slate-400"><div className="h-px bg-slate-200 flex-1" />or<div className="h-px bg-slate-200 flex-1" /></div>

            <form onSubmit={submit} className="space-y-3">
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@email.com"
                className="w-full border-[3px] border-slate-900 rounded-lg px-4 py-3 outline-none" />
              <input type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password (min 6 characters)"
                className="w-full border-[3px] border-slate-900 rounded-lg px-4 py-3 outline-none" />
              <button type="submit" disabled={busy || !configured}
                className="w-full bg-green-700 text-white font-bold py-3 rounded-lg disabled:opacity-50">
                {busy ? 'Please wait…' : mode === 'signup' ? 'Create account & start →' : 'Sign in →'}
              </button>
            </form>
            {err && <p className="mt-3 text-sm text-red-600">{err}</p>}

            <div className="mt-4 text-sm text-slate-600 flex items-center justify-between">
              <button onClick={() => { setMode(mode === 'signup' ? 'signin' : 'signup'); setErr(null) }} className="font-semibold text-green-700">
                {mode === 'signup' ? 'Already have an account? Sign in' : 'New here? Create account'}
              </button>
              <button onClick={magicLink} disabled={busy} className="text-slate-500 underline underline-offset-2">Email me a link</button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
