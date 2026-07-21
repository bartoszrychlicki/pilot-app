import './style.css'
import { renderChangelog } from './changelog.ts'
import { setupCounter } from './counter.ts'
import { renderFooter } from './footer.ts'
import { setupStats } from './stats.ts'
import { applyTheme, getPreferredTheme, renderThemeToggle, setupThemeToggle } from './theme.ts'

applyTheme(getPreferredTheme())

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
${renderThemeToggle()}
<section id="welcome">
  <p class="logo">pilot-app</p>
  <h1>Witamy w pilot-app</h1>
  <p>To prosta aplikacja demonstracyjna, w której rozwijamy i prezentujemy kolejne funkcje projektu.</p>
  <div class="counter-group">
    <button id="counter" type="button" class="counter"></button>
    <button id="reset" type="button" class="counter reset">Reset</button>
  </div>
  <p id="stats-panel" class="stats-panel"></p>
</section>

<div class="ticks"></div>

<section id="changelog">
  ${renderChangelog()}
</section>

<div class="ticks"></div>
<section id="spacer"></section>
${renderFooter()}
`

setupCounter(
  document.querySelector<HTMLButtonElement>('#counter')!,
  document.querySelector<HTMLButtonElement>('#reset')!,
)

setupStats(
  document.querySelector<HTMLButtonElement>('#counter')!,
  document.querySelector<HTMLButtonElement>('#reset')!,
  document.querySelector<HTMLElement>('#stats-panel')!,
)

setupThemeToggle(document.querySelector<HTMLButtonElement>('#theme-toggle')!)
