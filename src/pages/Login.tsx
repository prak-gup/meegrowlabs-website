import { useState } from 'react'
import { useAuth } from '../auth/AuthProvider'

export default function Login() {
  const { signInWithEmail, signInWithGoogle, configured } = useAuth()
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [err, setErr] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setBusy(true); setErr(null)
    const { error } = await signInWithEmail(email.trim())
    setBusy(false)
    if (error) setErr(error); else setSent(true)
  }

  return (
    <div className="min-h-screen bg-cream-100 flex items-center justify-center px-6">
      <div className="w-full max-w-md bg-white border-4 border-slate-900 rounded-2xl shadow-[8px_8px_0_#0F0F0F] p-8">
        <a href="/" className="font-mono font-bold tracking-widest text-slate-900">&gt;_ MEEGROW <span className="text-green-700">LABS</span></a>
        <h1 className="mt-6 text-3xl font-display font-bold text-slate-900">Sign in to Zero to AI Hero</h1>
        <p className="mt-2 text-slate-600">Track your progress, resume where you left off, and get every lesson — free.</p>

        {!configured && (
          <p className="mt-4 text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-lg p-3">Sign-in isn’t switched on yet. Check back shortly.</p>
        )}

        {sent ? (
          <div className="mt-6 text-green-800 font-semibold">✅ Check your email — we sent you a magic sign-in link.</div>
        ) : (
          <>
            <form onSubmit={submit} className="mt-6 space-y-3">
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                placeholder="you@email.com"
                className="w-full border-[3px] border-slate-900 rounded-lg px-4 py-3 outline-none" />
              <button type="submit" disabled={busy || !configured}
                className="w-full bg-green-700 text-white font-bold py-3 rounded-lg disabled:opacity-50">
                {busy ? 'Sending…' : 'Email me a magic link →'}
              </button>
            </form>
            <button onClick={signInWithGoogle} disabled={!configured}
              className="mt-3 w-full border-[3px] border-slate-900 font-bold py-3 rounded-lg disabled:opacity-50">
              Continue with Google
            </button>
            {err && <p className="mt-3 text-sm text-red-600">{err}</p>}
          </>
        )}
        <p className="mt-6 text-sm text-slate-500">New here? Same form — we’ll create your account automatically. No password.</p>
      </div>
    </div>
  )
}
