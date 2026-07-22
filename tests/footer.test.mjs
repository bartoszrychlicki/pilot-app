import assert from 'node:assert/strict'
import test from 'node:test'

import { renderFooter } from '../src/footer.ts'

Object.defineProperties(globalThis, {
  __APP_NAME__: { configurable: true, value: 'Pilot App' },
  __APP_VERSION__: { configurable: true, value: '1.2.3' },
})

test('renders an accessible footer label', () => {
  assert.match(renderFooter(), /^<footer aria-label="Informacje o aplikacji">/)
})

test('keeps both footer links secure', () => {
  const links = renderFooter().match(/<a [^>]+>/g)

  assert.equal(links?.length, 2)
  for (const link of links ?? []) {
    assert.match(link, /target="_blank"/)
    assert.match(link, /rel="noopener"/)
  }
})

test('renders the current year', () => {
  assert.match(renderFooter(), new RegExp(`© ${new Date().getFullYear()}`))
})

test('keeps the footer content and structure unchanged apart from the accessible label', () => {
  const year = new Date().getFullYear()

  assert.equal(
    renderFooter(),
    `<footer aria-label="Informacje o aplikacji"><div class="footer-content">Pilot App <a href="https://github.com/bartoszrychlicki/pilot-app/releases" target="_blank" rel="noopener">v1.2.3</a> · © ${year} · <a href="https://github.com/bartoszrychlicki/pilot-app" target="_blank" rel="noopener">GitHub</a></div></footer>`,
  )
})
