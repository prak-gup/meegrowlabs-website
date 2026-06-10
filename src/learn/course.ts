// Loads the multi-course catalog + per-course manifest/video-map (all in /public/learn/).
export type Lesson = { id: string; num: number; title: string; slug: string; level: number; levelTitle: string }
export type Level = { level: number; levelTitle: string; lessons: Lesson[] }
export type VideoRef = { ytId?: string | null; bunny?: string | null; start?: number }
export type VideoMap = Record<string, { level: number; en?: VideoRef; hi?: VideoRef }>
export type Course = {
  id: string; slug: string; title: string; subtitle: string
  category?: string; difficulty?: string; order?: number
  manifest: string; videoMap: string; accent: string; bilingual: boolean
  bunnyLibrary?: string | null // set once videos are hosted on Bunny Stream
}
export type Path = { id: string; slug: string; kind: string; name: string; blurb: string; difficulty: string; accent: string; courseIds: string[] }

export async function loadCatalog(): Promise<{ paths: Path[]; courses: Course[] }> {
  try {
    const d = await (await fetch('/learn/courses.json')).json()
    return Array.isArray(d) ? { paths: [], courses: d } : { paths: d.paths ?? [], courses: d.courses ?? [] }
  } catch { return { paths: [], courses: [] } }
}

// "N two-minute lessons" -> N
export const lessonCount = (c: Course) => parseInt(c.subtitle.match(/\d+/)?.[0] || '0', 10)

export async function loadManifest(file: string): Promise<{ levels: Level[]; flat: Lesson[] }> {
  const data = await (await fetch(`/learn/${file}`)).json()
  const levels: Level[] = data.levels.map((lv: any) => ({
    level: lv.level,
    levelTitle: lv.levelTitle,
    lessons: lv.lessons.map((ls: any) => ({ ...ls, level: lv.level, levelTitle: lv.levelTitle })),
  }))
  return { levels, flat: levels.flatMap((lv) => lv.lessons) }
}

export async function loadVideoMap(file: string): Promise<VideoMap> {
  try { return await (await fetch(`/learn/${file}`)).json() } catch { return {} }
}

// Build the player iframe src: Bunny Stream if hosted, else YouTube embed, else null.
export function embedUrl(v: VideoRef | undefined, course: Course): string | null {
  if (v?.bunny && course.bunnyLibrary) {
    return `https://iframe.mediadelivery.net/embed/${course.bunnyLibrary}/${v.bunny}?autoplay=false&preload=true`
  }
  if (v?.ytId) {
    return `https://www.youtube.com/embed/${v.ytId}?rel=0&modestbranding=1${v.start ? `&start=${v.start}` : ''}`
  }
  return null
}
