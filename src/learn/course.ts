// Loads the course manifest + per-lesson video map (both live in /public/learn/).
export type Lesson = { id: string; num: number; title: string; slug: string; level: number; levelTitle: string }
export type Level = { level: number; levelTitle: string; lessons: Lesson[] }
export type VideoRef = { ytId: string | null; start: number }
export type VideoMap = Record<string, { level: number; en?: VideoRef; hi?: VideoRef }>

export async function loadCourse(): Promise<{ levels: Level[]; flat: Lesson[] }> {
  const data = await (await fetch('/learn/learn-data.json')).json()
  const levels: Level[] = data.levels.map((lv: any) => ({
    level: lv.level,
    levelTitle: lv.levelTitle,
    lessons: lv.lessons.map((ls: any) => ({ ...ls, level: lv.level, levelTitle: lv.levelTitle })),
  }))
  const flat = levels.flatMap((lv) => lv.lessons)
  return { levels, flat }
}

export async function loadVideoMap(): Promise<VideoMap> {
  try { return await (await fetch('/learn/lesson-video-map.json')).json() } catch { return {} }
}

export function ytEmbed(v: VideoRef | undefined): string | null {
  if (!v?.ytId) return null
  return `https://www.youtube.com/embed/${v.ytId}?rel=0&modestbranding=1${v.start ? `&start=${v.start}` : ''}`
}
