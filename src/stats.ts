export function formatElapsed(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000)
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60

  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
}

export function setupStats(
  counterButton: HTMLButtonElement,
  resetButton: HTMLButtonElement,
  statsElement: HTMLElement,
) {
  let clicks = 0
  let resets = 0
  const startedAt = Date.now()

  const render = () => {
    statsElement.innerHTML = `Kliknięcia: ${clicks} · Resety: ${resets} · Czas: ${formatElapsed(Date.now() - startedAt)}`
  }

  counterButton.addEventListener('click', () => {
    clicks++
    render()
  })
  resetButton.addEventListener('click', () => {
    resets++
    render()
  })
  setInterval(render, 1000)
  render()
}
