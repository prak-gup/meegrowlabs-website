// Loads the multi-course catalog + per-course manifest/video-map (all in /public/learn/).
export type Lesson = { id: string; num: number; title: string; slug: string; level: number; levelTitle: string }
export type Level = { level: number; levelTitle: string; lessons: Lesson[] }
export type VideoRef = { ytId: string | null; start: number }
export type VideoMap = Record<string, { level: number; en?: VideoRef; hi?: VideoRef }>
export type Course = {
  id: string; slug: string; title: string; subtitle: string
  manifest: string; videoMap: string; accent: string; bilingual: boolean
}

export async function loadCourses(): Promise<Course[]> {
  try { return await (await fetch('/learn/courses.json')).json() } catch { return [] }
}

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

export function ytEmbed(v: VideoRef | undefined): string | null {
  if (!v?.ytId) return null
  return `https://www.youtube.com/embed/${v.ytId}?rel=0&modestbranding=1${v.start ? `&start=${v.start}` : ''}`
}
