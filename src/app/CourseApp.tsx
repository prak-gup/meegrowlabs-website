import { useEffect, useState } from 'react'
import { useAuth } from '../auth/AuthProvider'
import { useProgress } from '../learn/useProgress'
import { loadCourses, loadManifest, loadVideoMap, ytEmbed, type Course, type Level, type Lesson, type VideoMap } from '../learn/course'

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

const pkey = (courseId: string, lessonId: string) => `${courseId}:${lessonId}`

export default function CourseApp() {
  const { user, loading, signOut } = useAuth()
  const { path, go } = usePath()
  const { progress, markComplete } = useProgress(user?.id ?? null)
  const [courses, setCourses] = useState<Course[]>([])
  const [manifest, setManifest] = useState<{ slug: string; levels: Level[]; flat: Lesson[]; vmap: VideoMap } | null>(null)
  const [lang, setLang] = useState<'en' | 'hi'>(() => (localStorage.getItem('hf_lang') as 'en' | 'hi') || 'en')

  useEffect(() => { loadCourses().then(setCourses) }, [])
  useEffect(() => { localStorage.setItem('hf_lang', lang) }, [lang])

  // path: /app  |  /app/<courseSlug>  |  /app/<courseSlug>/lesson/<lessonSlug>
  const parts = path.replace(/^\/app\/?/, '').split('/').filter(Boolean)
  const courseSlug = parts[0] || null
  const lessonSlug = parts[1] === 'lesson' ? decodeURIComponent(parts[2] || '') : null
  const course = courseSlug ? courses.find((c) => c.slug === courseSlug) : null

  // load the selected course's manifest + video map
  useEffect(() => {
    if (!course) { setManifest(null); return }
    if (manifest?.slug === course.slug) return
    let cancelled = false
    Promise.all([loadManifest(course.manifest), loadVideoMap(course.videoMap)]).then(([m, vmap]) => {
      if (!cancelled) setManifest({ slug: course.slug, ...m, vmap })
    })
    return () => { cancelled = true }
  }, [course?.slug, courses])

  if (loading) return <Center>Loading…</Center>
  if (!user) { window.location.href = '/login'; return <Center>Redirecting to sign in…</Center> }

  // ---- Catalog ----
  if (!courseSlug) {
    const total = courses.length
    return (
      <Shell onHome={() => go('/app')} onSignOut={signOut} right={null}>
        <h1 className="text-3xl font-display font-bold text-slate-900">Your courses</h1>
        <p className="text-slate-600">{total} free course{total === 1 ? '' : 's'} — pick up where you left off.</p>
        <div className="mt-6 grid sm:grid-cols-2 gap-5">
          {courses.map((c) => (
            <button key={c.id} onClick={() => go(`/app/${c.slug}`)}
              className="text-left border-4 border-slate-900 rounded-2xl p-6 bg-[#F7F3E9] hover:bg-white shadow-[6px_6px_0_#0F0F0F]">
              <div className="h-2 w-16 rounded-full mb-4" style={{ background: c.accent }} />
              <div className="text-xl font-display font-bold text-slate-900">{c.title}</div>
              <p className="mt-1 text-slate-600 text-sm">{c.subtitle}</p>
              <span className="mt-4 inline-block font-semibold text-green-700">Open course →</span>
            </button>
          ))}
        </div>
      </Shell>
    )
  }

  if (!course) return <Center>Course not found. <a href="/app" className="text-green-700 ml-1">All courses</a></Center>
  if (!manifest || manifest.slug !== course.slug) return <Center>Loading {course.title}…</Center>

  const { flat, levels, vmap } = manifest
  const completed = flat.filter((l) => progress[pkey(course.id, l.id)] === 'complete').length
  const current = lessonSlug ? flat.find((l) => l.slug === lessonSlug) : null

  // ---- Lesson player ----
  if (current) {
    const idx = flat.findIndex((l) => l.id === current.id)
    const v = vmap[current.id]
    const src = ytEmbed(lang === 'hi' ? v?.hi : v?.en) || ytEmbed(v?.en)
    const prev = idx > 0 ? flat[idx - 1] : null
    const next = idx < flat.length - 1 ? flat[idx + 1] : null
    const done = progress[pkey(course.id, current.id)] === 'complete'
    return (
      <Shell onHome={() => go('/app')} onSignOut={signOut} right={<span className="font-mono text-xs text-slate-500">{completed}/{flat.length}</span>}>
        <button onClick={() => go(`/app/${course.slug}`)} className="text-green-700 font-semibold">← {course.title}</button>
        <div className="mt-2 font-mono text-xs text-slate-500">{current.levelTitle}</div>
        <h1 className="text-2xl md:text-3xl font-display font-bold text-slate-900">{current.title}</h1>
        {course.bilingual && (
          <div className="mt-3 flex gap-2">
            <Tab on={lang === 'en'} onClick={() => setLang('en')}>English</Tab>
            {v?.hi?.ytId && <Tab on={lang === 'hi'} onClick={() => setLang('hi')}>हिंदी</Tab>}
          </div>
        )}
        <div className="mt-3 relative w-full rounded-xl overflow-hidden border-4 border-slate-900" style={{ paddingTop: '56.25%' }}>
          {src
            ? <iframe className="absolute inset-0 w-full h-full" src={src} allow="encrypted-media; fullscreen" allowFullScreen />
            : <div className="absolute inset-0 flex items-center justify-center text-slate-500">Video coming soon</div>}
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <button onClick={() => { markComplete(pkey(course.id, current.id)); if (next) go(`/app/${course.slug}/lesson/${next.slug}`) }}
            className="bg-green-700 text-white font-bold px-5 py-2.5 rounded-lg">
            {done ? '✓ Completed — next' : 'Mark complete & continue →'}
          </button>
          {prev && <button onClick={() => go(`/app/${course.slug}/lesson/${prev.slug}`)} className="font-semibold text-slate-700">← {prev.title}</button>}
          {next && <button onClick={() => go(`/app/${course.slug}/lesson/${next.slug}`)} className="font-semibold text-slate-700 ml-auto">{next.title} →</button>}
        </div>
      </Shell>
    )
  }

  // ---- Course dashboard ----
  const firstIncomplete = flat.find((l) => progress[pkey(course.id, l.id)] !== 'complete') ?? flat[0]
  return (
    <Shell onHome={() => go('/app')} onSignOut={signOut} right={<span className="font-mono text-xs text-slate-500">{completed}/{flat.length}</span>}>
      <button onClick={() => go('/app')} className="text-green-700 font-semibold">← All courses</button>
      <div className="mt-2 flex items-end justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-3xl font-display font-bold text-slate-900">{course.title}</h1>
          <p className="text-slate-600">{completed} of {flat.length} complete</p>
        </div>
        <button onClick={() => go(`/app/${course.slug}/lesson/${firstIncomplete.slug}`)} className="bg-green-700 text-white font-bold px-6 py-3 rounded-lg">
          {completed ? 'Continue →' : 'Start →'}
        </button>
      </div>
      <div className="mt-3 h-2 bg-slate-200 rounded-full overflow-hidden">
        <div className="h-full bg-green-600" style={{ width: `${Math.round((completed / Math.max(flat.length, 1)) * 100)}%` }} />
      </div>
      <div className="mt-8 space-y-6">
        {levels.map((lv) => {
          const c = lv.lessons.filter((l) => progress[pkey(course.id, l.id)] === 'complete').length
          return (
            <section key={lv.level} className="border-4 border-slate-900 rounded-xl overflow-hidden bg-[#F7F3E9]">
              <h2 className="px-5 py-3 border-b-4 border-slate-900 font-display font-bold flex items-center gap-3">
                <span className="font-mono text-xs bg-slate-900 text-white px-2 py-1 rounded">L{lv.level}</span>
                {lv.levelTitle}
                <span className="ml-auto font-mono text-xs text-slate-500">{c}/{lv.lessons.length}</span>
              </h2>
              <div className="divide-y divide-[#e4ddc9]">
                {lv.lessons.map((l) => (
                  <button key={l.id} onClick={() => go(`/app/${course.slug}/lesson/${l.slug}`)}
                    className="w-full flex items-center gap-3 px-5 py-3 text-left hover:bg-white">
                    <span className="font-mono text-sm w-9 text-green-700">{progress[pkey(course.id, l.id)] === 'complete' ? '✓' : String(l.num).padStart(2, '0')}</span>
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

function Shell({ children, onSignOut, onHome, right }: { children: React.ReactNode; onSignOut: () => void; onHome: () => void; right: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-cream-100">
      <header className="border-b-4 border-slate-900 bg-cream-100 sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-5 py-3 flex items-center justify-between">
          <button onClick={onHome} className="font-mono font-bold tracking-widest text-slate-900">&gt;_ MEEGROW <span className="text-green-700">LABS</span></button>
          <div className="flex items-center gap-4">{right}<button onClick={onSignOut} className="font-semibold text-slate-700">Sign out</button></div>
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
