import { useEffect, useState } from 'react'
import { useAuth } from '../auth/AuthProvider'
import { useProgress } from '../learn/useProgress'
import { loadCatalog, loadManifest, loadVideoMap, embedUrl, lessonCount, type Course, type Path, type Featured, type Level, type Lesson, type VideoMap } from '../learn/course'

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
  const [featured, setFeatured] = useState<Featured[]>([])
  const [paths, setPaths] = useState<Path[]>([])
  const [courses, setCourses] = useState<Course[]>([])
  const [manifest, setManifest] = useState<{ slug: string; levels: Level[]; flat: Lesson[]; vmap: VideoMap } | null>(null)
  const [lang, setLang] = useState<'en' | 'hi'>(() => (localStorage.getItem('hf_lang') as 'en' | 'hi') || 'en')
  const [expFilter, setExpFilter] = useState<string>('All')

  useEffect(() => { loadCatalog().then((d) => { setFeatured(d.featured); setPaths(d.paths); setCourses(d.courses) }) }, [])
  useEffect(() => { localStorage.setItem('hf_lang', lang) }, [lang])

  // /app | /app/path/<slug> | /app/<courseSlug> | /app/<courseSlug>/lesson/<slug>
  const parts = path.replace(/^\/app\/?/, '').split('/').filter(Boolean)
  const isPath = parts[0] === 'path'
  const pathSlug = isPath ? parts[1] : null
  const courseSlug = !isPath ? parts[0] || null : null
  const lessonSlug = parts[1] === 'lesson' ? decodeURIComponent(parts[2] || '') : null
  const course = courseSlug ? courses.find((c) => c.slug === courseSlug) : null
  const courseDone = (id: string) => Object.keys(progress).filter((k) => k.startsWith(id + ':') && progress[k] === 'complete').length

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

  // ---------- Catalog: smart home ----------
  if (!courseSlug && !isPath) {
    const byId = Object.fromEntries(courses.map((c) => [c.id, c]))
    const pathBySlug = Object.fromEntries(paths.map((p) => [p.slug, p]))
    const inProgress = courses.filter((c) => { const d = courseDone(c.id); return d > 0 && d < lessonCount(c) })
    const expLevels = ['All', 'Beginner', 'Intermediate', 'Advanced']
    const shown = expFilter === 'All' ? courses : courses.filter((c) => c.experience === expFilter)
    return (
      <Shell onHome={() => go('/app')} onSignOut={signOut} right={null}>
        <h1 className="text-3xl font-display font-bold text-slate-900">Explore courses</h1>
        <p className="text-slate-600">Free, 2-minute video lessons — हिंदी & English.</p>

        {/* 🔥 New & Trending */}
        {featured.length > 0 && (
          <section className="mt-6">
            <h2 className="font-display font-bold text-lg text-slate-900">🔥 New &amp; Trending</h2>
            <div className="mt-3 flex gap-4 overflow-x-auto pb-2 -mx-1 px-1">
              {featured.map((f) => {
                const p = f.type === 'path' ? pathBySlug[f.slug] : null
                const c = f.type === 'course' ? courses.find((x) => x.slug === f.slug) : null
                const item = p || c; if (!item) return null
                const href = p ? `/app/path/${p.slug}` : `/app/${c!.slug}`
                const badge = p?.badge || c?.badge
                return (
                  <button key={f.slug} onClick={() => go(href)}
                    className="flex-none w-72 text-left border-4 border-slate-900 rounded-2xl p-5 shadow-[6px_6px_0_#0F0F0F]" style={{ background: `${item.accent}1a` }}>
                    {badge && <span className="inline-block text-xs font-bold bg-slate-900 text-white px-2 py-1 rounded-full">{badge}</span>}
                    <div className="mt-2 text-lg font-display font-bold text-slate-900">{p ? p.name : c!.title}</div>
                    <p className="mt-1 text-sm text-slate-600">{p ? p.blurb : c!.subtitle}</p>
                    <span className="mt-3 inline-block font-semibold text-green-700">Start →</span>
                  </button>
                )
              })}
            </div>
          </section>
        )}

        {/* Continue learning */}
        {inProgress.length > 0 && (
          <section className="mt-8">
            <h2 className="font-display font-bold text-lg text-slate-900">Continue learning</h2>
            <div className="mt-3 grid sm:grid-cols-2 gap-3">
              {inProgress.map((c) => (
                <button key={c.id} onClick={() => go(`/app/${c.slug}`)} className="text-left border-2 border-slate-900 rounded-xl p-4 bg-white hover:bg-[#F7F3E9]">
                  <div className="font-display font-bold text-slate-900">{c.title}</div>
                  <div className="text-xs text-green-700 font-mono">{courseDone(c.id)}/{lessonCount(c)} done · Continue →</div>
                </button>
              ))}
            </div>
          </section>
        )}

        {/* Guided paths */}
        <section className="mt-8">
          <h2 className="font-display font-bold text-lg text-slate-900">Guided paths</h2>
          <div className="mt-3 space-y-3">
            {paths.map((p) => {
              const pc = p.courseIds.map((id) => byId[id]).filter(Boolean)
              const totalLessons = pc.reduce((s, c) => s + lessonCount(c), 0)
              const done = pc.reduce((s, c) => s + courseDone(c.id), 0)
              return (
                <button key={p.id} onClick={() => go(`/app/path/${p.slug}`)}
                  className="w-full text-left border-4 border-slate-900 rounded-2xl p-5 bg-[#F7F3E9] hover:bg-white shadow-[6px_6px_0_#0F0F0F]">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-12 rounded-full" style={{ background: p.accent }} />
                    <span className="font-mono text-xs uppercase tracking-wider text-slate-500">{p.kind} · {p.difficulty}</span>
                    {p.badge && <span className="text-xs font-bold bg-slate-900 text-white px-2 py-0.5 rounded-full">{p.badge}</span>}
                  </div>
                  <div className="mt-2 text-xl font-display font-bold text-slate-900">{p.name}</div>
                  <p className="mt-1 text-slate-600 text-sm">{p.blurb}</p>
                  <div className="mt-3 flex items-center gap-3 text-sm">
                    <span className="font-semibold text-slate-700">{pc.length} course{pc.length === 1 ? '' : 's'} · {totalLessons} lessons</span>
                    {done > 0 && <span className="font-mono text-xs text-green-700">{done}/{totalLessons} done</span>}
                    <span className="ml-auto font-semibold text-green-700">View →</span>
                  </div>
                </button>
              )
            })}
          </div>
        </section>

        {/* Browse all by experience */}
        <section className="mt-8">
          <h2 className="font-display font-bold text-lg text-slate-900">All courses</h2>
          <div className="mt-2 flex gap-2 flex-wrap">
            {expLevels.map((l) => (
              <button key={l} onClick={() => setExpFilter(l)}
                className={`text-sm font-bold border-2 border-slate-900 rounded-full px-3 py-1 ${expFilter === l ? 'bg-slate-900 text-white' : 'bg-white'}`}>{l}</button>
            ))}
          </div>
          <div className="mt-4 grid sm:grid-cols-2 gap-3">
            {shown.map((c) => (
              <button key={c.id} onClick={() => go(`/app/${c.slug}`)} className="text-left border-2 border-slate-900 rounded-xl p-4 bg-white hover:bg-[#F7F3E9]">
                <div className="flex items-center gap-2">
                  <span className="font-display font-bold text-slate-900">{c.title}</span>
                  {c.isNew && <span className="text-[10px] font-bold bg-[#D97757] text-white px-1.5 py-0.5 rounded">NEW</span>}
                </div>
                <div className="text-xs text-slate-500">{c.experience} · {c.subtitle}{courseDone(c.id) ? ` · ${courseDone(c.id)} done` : ''}</div>
              </button>
            ))}
          </div>
        </section>
      </Shell>
    )
  }

  // ---------- Path detail ----------
  if (isPath) {
    const p = paths.find((x) => x.slug === pathSlug)
    if (!p) return <Center>Path not found. <a href="/app" className="text-green-700 ml-1">All paths</a></Center>
    const byId = Object.fromEntries(courses.map((c) => [c.id, c]))
    const pc = p.courseIds.map((id) => byId[id]).filter(Boolean)
    return (
      <Shell onHome={() => go('/app')} onSignOut={signOut} right={null}>
        <button onClick={() => go('/app')} className="text-green-700 font-semibold">← All paths</button>
        <div className="mt-2 font-mono text-xs uppercase tracking-wider text-slate-500">{p.kind} · {p.difficulty}</div>
        <h1 className="text-3xl font-display font-bold text-slate-900">{p.name}</h1>
        <p className="text-slate-600">{p.blurb}</p>
        <div className="mt-6 space-y-3">
          {pc.map((c, i) => {
            const total = lessonCount(c), done = courseDone(c.id)
            const complete = total > 0 && done >= total
            return (
              <button key={c.id} onClick={() => go(`/app/${c.slug}`)}
                className="w-full flex items-center gap-4 text-left border-4 border-slate-900 rounded-xl p-4 bg-[#F7F3E9] hover:bg-white">
                <span className="font-mono font-bold w-8 h-8 flex items-center justify-center rounded-full border-[3px] border-slate-900" style={{ background: complete ? '#1F8A4C' : '#fff', color: complete ? '#fff' : '#0F0F0F' }}>{complete ? '✓' : i + 1}</span>
                <span className="flex-1">
                  <span className="block font-display font-bold text-slate-900">{c.title}</span>
                  <span className="block text-xs text-slate-500">{total} lessons{done ? ` · ${done}/${total} done` : ''}</span>
                </span>
                <span className="text-green-700 font-semibold">{done ? (complete ? 'Review' : 'Continue') : 'Start'} →</span>
              </button>
            )
          })}
        </div>
      </Shell>
    )
  }

  if (!course) return <Center>Course not found. <a href="/app" className="text-green-700 ml-1">All paths</a></Center>
  if (!manifest || manifest.slug !== course.slug) return <Center>Loading {course.title}…</Center>

  const { flat, levels, vmap } = manifest
  const completed = flat.filter((l) => progress[pkey(course.id, l.id)] === 'complete').length
  const current = lessonSlug ? flat.find((l) => l.slug === lessonSlug) : null

  // ---------- Lesson player ----------
  if (current) {
    const idx = flat.findIndex((l) => l.id === current.id)
    const v = vmap[current.id]
    const src = embedUrl(lang === 'hi' ? v?.hi : v?.en, course) || embedUrl(v?.en, course)
    const prev = idx > 0 ? flat[idx - 1] : null
    const next = idx < flat.length - 1 ? flat[idx + 1] : null
    const done = progress[pkey(course.id, current.id)] === 'complete'
    return (
      <Shell onHome={() => go('/app')} onSignOut={signOut} right={<span className="font-mono text-xs text-slate-500">{completed}/{flat.length}</span>}>
        <button onClick={() => go(`/app/${course.slug}`)} className="text-green-700 font-semibold">← {course.title}</button>
        <h1 className="mt-2 text-2xl md:text-3xl font-display font-bold text-slate-900">{current.title}</h1>
        {course.bilingual && (
          <div className="mt-3 flex gap-2">
            <Tab on={lang === 'en'} onClick={() => setLang('en')}>English</Tab>
            {(v?.hi?.ytId || v?.hi?.bunny) && <Tab on={lang === 'hi'} onClick={() => setLang('hi')}>हिंदी</Tab>}
          </div>
        )}
        <div className="mt-3 relative w-full rounded-xl overflow-hidden border-4 border-slate-900" style={{ paddingTop: '56.25%' }}>
          {src ? <iframe className="absolute inset-0 w-full h-full" src={src} allow="encrypted-media; fullscreen" allowFullScreen />
            : <div className="absolute inset-0 flex items-center justify-center text-slate-500">Video coming soon</div>}
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <button onClick={() => { markComplete(pkey(course.id, current.id)); if (next) go(`/app/${course.slug}/lesson/${next.slug}`) }}
            className="bg-green-700 text-white font-bold px-5 py-2.5 rounded-lg">{done ? '✓ Completed — next' : 'Mark complete & continue →'}</button>
          {prev && <button onClick={() => go(`/app/${course.slug}/lesson/${prev.slug}`)} className="font-semibold text-slate-700">← {prev.title}</button>}
          {next && <button onClick={() => go(`/app/${course.slug}/lesson/${next.slug}`)} className="font-semibold text-slate-700 ml-auto">{next.title} →</button>}
        </div>
      </Shell>
    )
  }

  // ---------- Course dashboard ----------
  const firstIncomplete = flat.find((l) => progress[pkey(course.id, l.id)] !== 'complete') ?? flat[0]
  return (
    <Shell onHome={() => go('/app')} onSignOut={signOut} right={<span className="font-mono text-xs text-slate-500">{completed}/{flat.length}</span>}>
      <button onClick={() => go('/app')} className="text-green-700 font-semibold">← All paths</button>
      <div className="mt-2 flex items-end justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-3xl font-display font-bold text-slate-900">{course.title}</h1>
          <p className="text-slate-600">{completed} of {flat.length} complete</p>
        </div>
        <button onClick={() => go(`/app/${course.slug}/lesson/${firstIncomplete.slug}`)} className="bg-green-700 text-white font-bold px-6 py-3 rounded-lg">{completed ? 'Continue →' : 'Start →'}</button>
      </div>
      <div className="mt-3 h-2 bg-slate-200 rounded-full overflow-hidden"><div className="h-full bg-green-600" style={{ width: `${Math.round((completed / Math.max(flat.length, 1)) * 100)}%` }} /></div>
      <div className="mt-8 space-y-6">
        {levels.map((lv) => (
          <section key={lv.level} className="border-4 border-slate-900 rounded-xl overflow-hidden bg-[#F7F3E9]">
            <div className="divide-y divide-[#e4ddc9]">
              {lv.lessons.map((l) => (
                <button key={l.id} onClick={() => go(`/app/${course.slug}/lesson/${l.slug}`)} className="w-full flex items-center gap-3 px-5 py-3 text-left hover:bg-white">
                  <span className="font-mono text-sm w-9 text-green-700">{progress[pkey(course.id, l.id)] === 'complete' ? '✓' : String(l.num).padStart(2, '0')}</span>
                  <span className="font-medium text-slate-900">{l.title}</span>
                  <span className="ml-auto text-[#D97757]">▶</span>
                </button>
              ))}
            </div>
          </section>
        ))}
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
