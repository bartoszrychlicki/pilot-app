export function formatDuration(ms: number): string {
  const totalSeconds = Math.floor(Math.max(0, ms) / 1000)
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60

  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
}

export function createSessionStats(startTime: number = performance.now()) {
  let clicks = 0
  let resets = 0

  return {
    recordIncrement() {
      clicks += 1
    },
    recordReset() {
      resets += 1
    },
    getClicks() {
      return clicks
    },
    getResets() {
      return resets
    },
    getElapsedMs(now: number = performance.now()) {
      return Math.max(0, now - startTime)
    },
  }
}
