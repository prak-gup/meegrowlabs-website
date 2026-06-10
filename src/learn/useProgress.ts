import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export type ProgressMap = Record<string, 'in_progress' | 'complete'>

// Per-user lesson progress backed by Supabase `lesson_progress`.
export function useProgress(userId: string | null) {
  const [progress, setProgress] = useState<ProgressMap>({})
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    let cancelled = false
    if (!supabase || !userId) { setProgress({}); setLoaded(true); return }
    supabase.from('lesson_progress').select('lesson_id,status').eq('user_id', userId).then(({ data }) => {
      if (cancelled) return
      const m: ProgressMap = {}
      for (const r of data ?? []) m[r.lesson_id] = r.status as ProgressMap[string]
      setProgress(m); setLoaded(true)
    })
    return () => { cancelled = true }
  }, [userId])

  const setStatus = useCallback(async (lessonId: string, status: 'in_progress' | 'complete') => {
    setProgress((p) => ({ ...p, [lessonId]: status }))
    if (!supabase || !userId) return
    await supabase.from('lesson_progress').upsert(
      { user_id: userId, lesson_id: lessonId, status, updated_at: new Date().toISOString() },
      { onConflict: 'user_id,lesson_id' },
    )
  }, [userId])

  return { progress, loaded, markComplete: (id: string) => setStatus(id, 'complete'), markStarted: (id: string) => setStatus(id, 'in_progress') }
}
