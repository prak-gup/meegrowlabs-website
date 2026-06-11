import { useState } from 'react'
import { useAuth, friendlyAuthError } from '../auth/AuthProvider'

export default function Login() {
  const { signUpWithPassword, signInWithPassword, signInWithEmail, resetPassword, signInWithGoogle, configured } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [show, setShow] = useState(false)
  const [mode, setMode] = useState<'signin' | 'signup'>('signup')
  const [err, setErr] = useState<string | null>(null)
  const [note, setNote] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setBusy(true); setErr(null); setNote(null)
    const fn = mode === 'signup' ? signUpWithPassword : signInWithPassword
    const { error } = await fn(email.trim(), password)
    setBusy(false)
    if (error) setErr(friendlyAuthError(error))
    else window.location.href = '/app'
  }

  async function forgot() {
    if (!email.trim()) { setErr('Enter your email first, then tap “Forgot password”.'); return }
    setBusy(true); setErr(null); setNote(null)
    const { error } = await resetPassword(email.trim())
    setBusy(false)
    error ? setErr(friendlyAuthError(error)) : setNote('If that email has an account, we’ve sent a reset link.')
  }

  async function magicLink() {
    if (!email.trim()) { setErr('Enter your email first.'); return }
    setBusy(true); setErr(null); setNote(null)
    const { error } = await signInWithEmail(email.trim())
    setBusy(false)
    error ? setErr(friendlyAuthError(error)) : setNote('✅ Check your email for a sign-in link.')
  }

  return (
    <div className="min-h-screen bg-cream-100 flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md bg-white border-4 border-slate-900 rounded-2xl shadow-[8px_8px_0_#0F0F0F] p-8">
        <a href="/" className="font-mono font-bold tracking-widest text-slate-900">&gt;_ MEEGROW <span className="text-green-700">LABS</span></a>
        <h1 className="mt-6 text-3xl font-display font-bold text-slate-900">{mode === 'signup' ? 'Create your free account' : 'Welcome back'}</h1>
        <p className="mt-2 text-slate-600">Track your progress and resume any lesson — free, हिंदी &amp; English.</p>

        {!configured && <p className="mt-4 text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-lg p-3">Sign-in isn’t switched on yet.</p>}

        <button onClick={signInWithGoogle} disabled={!configured}
          className="mt-6 w-full border-[3px] border-slate-900 font-bold py-3 rounded-lg disabled:opacity-50 hover:bg-cream-100">
          Continue with Google
        </button>
        <div className="my-4 flex items-center gap-3 text-xs text-slate-400"><div className="h-px bg-slate-200 flex-1" />or use email<div className="h-px bg-slate-200 flex-1" /></div>

        <form onSubmit={submit} className="space-y-3">
          <input type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@email.com"
            className="w-full border-[3px] border-slate-900 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-green-600" />
          <div className="relative">
            <input type={show ? 'text' : 'password'} autoComplete={mode === 'signup' ? 'new-password' : 'current-password'} required minLength={8}
              value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password (min 8 characters)"
              className="w-full border-[3px] border-slate-900 rounded-lg px-4 py-3 pr-16 outline-none focus:ring-2 focus:ring-green-600" />
            <button type="button" onClick={() => setShow(!show)} className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-semibold text-slate-500">{show ? 'Hide' : 'Show'}</button>
          </div>
          <button type="submit" disabled={busy || !configured} className="w-full bg-green-700 text-white font-bold py-3 rounded-lg disabled:opacity-50 hover:bg-green-800">
            {busy ? 'Please wait…' : mode === 'signup' ? 'Create account & start →' : 'Sign in →'}
          </button>
        </form>

        {err && <p className="mt-3 text-sm text-red-600">{err}</p>}
        {note && <p className="mt-3 text-sm text-green-700">{note}</p>}

        <div className="mt-4 flex items-center justify-between text-sm">
          <button onClick={() => { setMode(mode === 'signup' ? 'signin' : 'signup'); setErr(null); setNote(null) }} className="font-semibold text-green-700">
            {mode === 'signup' ? 'Already have an account? Sign in' : 'New here? Create account'}
          </button>
          {mode === 'signin' && <button onClick={forgot} disabled={busy} className="text-slate-500 underline underline-offset-2">Forgot password?</button>}
        </div>
        <button onClick={magicLink} disabled={busy} className="mt-3 text-xs text-slate-400 underline underline-offset-2">Prefer a one-time email link?</button>
      </div>
    </div>
  )
}
