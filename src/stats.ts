import type { CounterStore } from './counter.ts'

export function formatElapsed(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000)
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60

  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
}

export function setupStats(
  counter: CounterStore,
  statsElement: HTMLElement,
) {
  const startedAt = Date.now()

  const render = () => {
    const { sessionClicks, sessionResets } = counter.getState()
    statsElement.textContent = `Kliknięcia: ${sessionClicks} · Resety: ${sessionResets} · Czas: ${formatElapsed(Date.now() - startedAt)}`
  }

  const unsubscribe = counter.subscribe(render)
  const intervalId = setInterval(render, 1000)

  return () => {
    clearInterval(intervalId)
    unsubscribe()
  }
}
