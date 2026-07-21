import './style.css'
import { renderChangelog } from './changelog.ts'
import { setupCounter } from './counter.ts'
import { renderFooter } from './footer.ts'
import { renderLogo } from './logo.ts'

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
<section id="welcome">
  ${renderLogo()}
  <h1>Witamy w pilot-app</h1>
  <p>To prosta aplikacja demonstracyjna, w której rozwijamy i prezentujemy kolejne funkcje projektu.</p>
  <div class="counter-group">
    <button id="counter" type="button" class="counter"></button>
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
)
