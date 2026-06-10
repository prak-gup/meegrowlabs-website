import { useEffect, useState } from 'react'
import { useAuth } from '../auth/AuthProvider'
import { useProgress } from '../learn/useProgress'
import { loadCourse, loadVideoMap, ytEmbed, type Level, type Lesson, type VideoMap } from '../learn/course'

function usePath() {
  const [path, setPath] = useState(typeof window !== 'undefined' ? window.location.pathname : '/app')
  useEffect(() => {
    const on = () => setPath(window.location.pathname)
    window.addEventListener('popstate', on)
    return () => window.removeEventListener('popstate', on)
  }, [])
  const go = (p: string) => { window.history.pushState({}, '', p); setPath(p); window.scrollTo(0, 0) }
  return { path, go }
}

export default function CourseApp() {
  const { user, loading, signOut } = useAuth()
  const { path, go } = usePath()
  const [levels, setLevels] = useState<Level[]>([])
  const [flat, setFlat] = useState<Lesson[]>([])
  const [vmap, setVmap] = useState<VideoMap>({})
  const { progress, markComplete } = useProgress(user?.id ?? null)
  const [lang, setLang] = useState<'en' | 'hi'>(() => (localStorage.getItem('hf_lang') as 'en' | 'hi') || 'en')

  useEffect(() => { loadCourse().then(({ levels, flat }) => { setLevels(levels); setFlat(flat) }); loadVideoMap().then(setVmap) }, [])
  useEffect(() => { localStorage.setItem('hf_lang', lang) }, [lang])

  if (loading) return <Center>Loading…</Center>
  if (!user) { window.location.href = '/login'; return <Center>Redirecting to sign in…</Center> }
  if (!flat.length) return <Center>Loading your course…</Center>

  const completed = flat.filter((l) => progress[l.id] === 'complete').length
  const slugMatch = path.match(/^\/app\/lesson\/([^/]+)/)
  const current = slugMatch ? flat.find((l) => l.slug === decodeURIComponent(slugMatch[1])) : null

  // ---- Lesson view ----
  if (current) {
    const idx = flat.findIndex((l) => l.id === current.id)
    const v = vmap[current.id]
    const src = ytEmbed(lang === 'hi' ? v?.hi : v?.en) || ytEmbed(v?.en)
    const prev = idx > 0 ? flat[idx - 1] : null
    const next = idx < flat.length - 1 ? flat[idx + 1] : null
    const done = progress[current.id] === 'complete'
    return (
      <Shell completed={completed} total={flat.length} onSignOut={signOut} onHome={() => go('/app')}>
        <button onClick={() => go('/app')} className="text-green-700 font-semibold">← All lessons</button>
        <div className="mt-2 font-mono text-xs text-slate-500">Level {current.level} · {current.levelTitle}</div>
        <h1 className="text-2xl md:text-3xl font-display font-bold text-slate-900">{current.title}</h1>
        <div className="mt-3 flex gap-2">
          <Tab on={lang === 'en'} onClick={() => setLang('en')}>English</Tab>
          {v?.hi?.ytId && <Tab on={lang === 'hi'} onClick={() => setLang('hi')}>हिंदी</Tab>}
        </div>
        <div className="mt-3 relative w-full rounded-xl overflow-hidden border-4 border-slate-900" style={{ paddingTop: '56.25%' }}>
          {src
            ? <iframe className="absolute inset-0 w-full h-full" src={src} allow="encrypted-media; fullscreen" allowFullScreen />
            : <div className="absolute inset-0 flex items-center justify-center text-slate-500">Video coming soon</div>}
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <button onClick={() => { markComplete(current.id); if (next) go(`/app/lesson/${next.slug}`) }}
            className="bg-green-700 text-white font-bold px-5 py-2.5 rounded-lg">
            {done ? '✓ Completed — next lesson' : 'Mark complete & continue →'}
          </button>
          {prev && <button onClick={() => go(`/app/lesson/${prev.slug}`)} className="font-semibold text-slate-700">← {prev.title}</button>}
          {next && <button onClick={() => go(`/app/lesson/${next.slug}`)} className="font-semibold text-slate-700 ml-auto">{next.title} →</button>}
        </div>
      </Shell>
    )
  }

  // ---- Dashboard ----
  const firstIncomplete = flat.find((l) => progress[l.id] !== 'complete') ?? flat[0]
  return (
    <Shell completed={completed} total={flat.length} onSignOut={signOut} onHome={() => go('/app')}>
      <div className="flex items-end justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-3xl font-display font-bold text-slate-900">Your course</h1>
          <p className="text-slate-600">{completed} of {flat.length} lessons complete</p>
        </div>
        <button onClick={() => go(`/app/lesson/${firstIncomplete.slug}`)} className="bg-green-700 text-white font-bold px-6 py-3 rounded-lg">
          {completed ? 'Continue →' : 'Start Lesson 1 →'}
        </button>
      </div>
      <div className="mt-3 h-2 bg-slate-200 rounded-full overflow-hidden">
        <div className="h-full bg-green-600" style={{ width: `${Math.round((completed / flat.length) * 100)}%` }} />
      </div>
      <div className="mt-8 space-y-6">
        {levels.map((lv) => {
          const c = lv.lessons.filter((l) => progress[l.id] === 'complete').length
          return (
            <section key={lv.level} className="border-4 border-slate-900 rounded-xl overflow-hidden bg-[#F7F3E9]">
              <h2 className="px-5 py-3 border-b-4 border-slate-900 font-display font-bold flex items-center gap-3">
                <span className="font-mono text-xs bg-slate-900 text-white px-2 py-1 rounded">L{lv.level}</span>
                {lv.levelTitle}
                <span className="ml-auto font-mono text-xs text-slate-500">{c}/{lv.lessons.length}</span>
              </h2>
              <div className="divide-y divide-[#e4ddc9]">
                {lv.lessons.map((l) => (
                  <button key={l.id} onClick={() => go(`/app/lesson/${l.slug}`)}
                    className="w-full flex items-center gap-3 px-5 py-3 text-left hover:bg-white">
                    <span className="font-mono text-sm w-9 text-green-700">{progress[l.id] === 'complete' ? '✓' : String(l.num).padStart(2, '0')}</span>
                    <span className="font-medium text-slate-900">{l.title}</span>
                    <span className="ml-auto text-[#D97757]">▶</span>
                  </button>
                ))}
              </div>
            </section>
          )
        })}
      </div>
    </Shell>
  )
}

function Shell({ children, completed, total, onSignOut, onHome }: { children: React.ReactNode; completed: number; total: number; onSignOut: () => void; onHome: () => void }) {
  return (
    <div className="min-h-screen bg-cream-100">
      <header className="border-b-4 border-slate-900 bg-cream-100 sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-5 py-3 flex items-center justify-between">
          <button onClick={onHome} className="font-mono font-bold tracking-widest text-slate-900">&gt;_ MEEGROW <span className="text-green-700">LABS</span></button>
          <div className="flex items-center gap-4">
            <span className="font-mono text-xs text-slate-500">{completed}/{total}</span>
            <button onClick={onSignOut} className="font-semibold text-slate-700">Sign out</button>
          </div>
        </div>
      </header>
      <main className="max-w-3xl mx-auto px-5 py-8">{children}</main>
    </div>
  )
}

const Center = ({ children }: { children: React.ReactNode }) => <div className="min-h-screen bg-cream-100 flex items-center justify-center text-slate-600">{children}</div>
const Tab = ({ on, onClick, children }: { on: boolean; onClick: () => void; children: React.ReactNode }) => (
  <button onClick={onClick} className={`font-bold border-[3px] border-slate-900 rounded-full px-4 py-1.5 ${on ? 'bg-green-700 text-white' : 'bg-[#F7F3E9]'}`}>{children}</button>
)
