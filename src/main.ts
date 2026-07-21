import './style.css'
import { renderChangelog } from './changelog.ts'
import { setupCounter } from './counter.ts'
import { renderFooter } from './footer.ts'

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
<section id="welcome">
  <h1>Witamy w pilot-app</h1>
  <p>To prosta aplikacja demonstracyjna, w której rozwijamy i prezentujemy kolejne funkcje projektu.</p>
  <div class="counter-group">
    <button id="decrement" type="button" class="counter counter-step" aria-label="Zmniejsz licznik">−</button>
    <button id="counter" type="button" class="counter" aria-live="polite"></button>
    <button id="reset" type="button" class="counter reset">Reset</button>
  </div>
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
  document.querySelector<HTMLButtonElement>('#decrement')!,
)
