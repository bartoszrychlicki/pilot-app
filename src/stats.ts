export interface StatsElements {
  clicks: HTMLElement
  resets: HTMLElement
  time: HTMLElement
}

interface StatsOptions {
  now?: () => number
  setIntervalFn?: typeof setInterval
  clearIntervalFn?: typeof clearInterval
}

export function formatElapsed(ms: number): string {
  const elapsedSeconds = Math.floor(ms / 1000)
  const minutes = Math.floor(elapsedSeconds / 60)
  const seconds = elapsedSeconds % 60

  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
}

export function renderStats(): string {
  return `
  <div id="stats" class="stats" aria-live="off">
    <span class="stats__item">Kliknięcia: <b id="stats-clicks">0</b></span>
    <span class="stats__item">Resety: <b id="stats-resets">0</b></span>
    <span class="stats__item">Czas: <b id="stats-time">00:00</b></span>
  </div>`
}

export function setupStats(
  counterButton: HTMLButtonElement,
  resetButton: HTMLButtonElement,
  elements: StatsElements,
  options: StatsOptions = {},
) {
  const now = options.now ?? Date.now
  const setIntervalFn = options.setIntervalFn ?? setInterval
  const clearIntervalFn = options.clearIntervalFn ?? clearInterval
  const startTime = now()
  let clicks = 0
  let resets = 0

  counterButton.addEventListener('click', () => {
    clicks += 1
    elements.clicks.textContent = String(clicks)
  })

  resetButton.addEventListener('click', () => {
    resets += 1
    elements.resets.textContent = String(resets)
  })

  const interval = setIntervalFn(() => {
    elements.time.textContent = formatElapsed(now() - startTime)
  }, 1000)

  return {
    stop() {
      clearIntervalFn(interval)
    },
  }
}
