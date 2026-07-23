import { useCallback, useEffect, useRef, useState } from 'react'
import { createSessionStats } from '@/lib/stats'

export interface SessionStatsSnapshot {
  clicks: number
  resets: number
  elapsedMs: number
}

export interface SessionStatsController extends SessionStatsSnapshot {
  recordIncrement: () => void
  recordReset: () => void
}

export function useSessionStats(
  now: () => number = () => performance.now(),
): SessionStatsController {
  const nowRef = useRef(now)
  nowRef.current = now
  const [stats] = useState(() => createSessionStats(now()))
  const [snapshot, setSnapshot] = useState<SessionStatsSnapshot>(() => ({
    clicks: stats.getClicks(),
    resets: stats.getResets(),
    elapsedMs: stats.getElapsedMs(now()),
  }))

  const refresh = useCallback(() => {
    setSnapshot({
      clicks: stats.getClicks(),
      resets: stats.getResets(),
      elapsedMs: stats.getElapsedMs(nowRef.current()),
    })
  }, [stats])

  useEffect(() => {
    const intervalId = globalThis.setInterval(refresh, 1000)
    return () => globalThis.clearInterval(intervalId)
  }, [refresh])

  const recordIncrement = useCallback(() => {
    stats.recordIncrement()
    refresh()
  }, [refresh, stats])

  const recordReset = useCallback(() => {
    stats.recordReset()
    refresh()
  }, [refresh, stats])

  return { ...snapshot, recordIncrement, recordReset }
}
