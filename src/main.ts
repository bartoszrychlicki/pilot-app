import './style.css'
import { renderChangelog } from './changelog.ts'
import { setupCounter } from './counter.ts'
import { renderFooter } from './footer.ts'
import { createSessionStats, formatDuration } from './stats.ts'
import { applyTheme, getPreferredTheme, renderThemeToggle, setupThemeToggle } from './theme.ts'

applyTheme(getPreferredTheme())

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
${renderThemeToggle()}
<section id="welcome">
  <p class="logo">pilot-app</p>
  <h1>Witamy w pilot-app</h1>
  <p>To prosta aplikacja demonstracyjna, w której rozwijamy i prezentujemy kolejne funkcje projektu.</p>
  <div class="counter-group">
    <button id="counter" type="button" class="counter" aria-live="polite"></button>
    <button id="copy" type="button" class="counter copy">Kopiuj</button>
    <button id="reset" type="button" class="counter reset">Reset</button>
  </div>
  <span id="copy-feedback" class="copy-feedback" aria-live="polite"></span>
  <p class="counter-hint">Skróty: + / = zwiększ, r reset (nieaktywne w polach tekstowych)</p>
  <div class="stats-panel" id="stats-panel"></div>
</section>

<div class="ticks"></div>

<section id="changelog">
  ${renderChangelog()}
</section>

<div class="ticks"></div>
<section id="spacer"></section>
${renderFooter()}
`

function setupStats(panel: HTMLElement) {
  const stats = createSessionStats()
  const render = () => {
    panel.textContent = `Kliknięcia: ${stats.getClicks()} · Resety: ${stats.getResets()} · Czas sesji: ${formatDuration(stats.getElapsedMs())}`
  }

  const onIncrement = () => {
    stats.recordIncrement()
    render()
  }
  const onReset = () => {
    stats.recordReset()
    render()
  }

  render()
  const intervalId = window.setInterval(render, 1000)

  return {
    onIncrement,
    onReset,
    dispose: () => window.clearInterval(intervalId),
  }
}

const statsHandlers = setupStats(document.querySelector<HTMLElement>('#stats-panel')!)
window.addEventListener('pagehide', (event) => {
  if (!event.persisted) statsHandlers.dispose()
})
setupCounter(
  document.querySelector<HTMLButtonElement>('#counter')!,
  document.querySelector<HTMLButtonElement>('#reset')!,
  document.querySelector<HTMLButtonElement>('#copy')!,
  document.querySelector<HTMLElement>('#copy-feedback')!,
  document,
  statsHandlers,
)

setupThemeToggle(document.querySelector<HTMLButtonElement>('#theme-toggle')!)
