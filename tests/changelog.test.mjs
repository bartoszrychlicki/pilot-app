import assert from 'node:assert/strict'
import { beforeEach, test } from 'node:test'

import { renderChangelog, setupChangelog } from '../src/changelog.ts'

let storedState
let savedState
let readError
let writeError

const localStorageMock = {
  getItem(key) {
    assert.equal(key, 'pilot-changelog-open')
    if (readError) {
      throw readError
    }
    return storedState
  },
  setItem(key, value) {
    assert.equal(key, 'pilot-changelog-open')
    if (writeError) {
      throw writeError
    }
    savedState = value
    storedState = value
  },
}

Object.defineProperty(globalThis, 'localStorage', {
  configurable: true,
  value: localStorageMock,
})

beforeEach(() => {
  storedState = null
  savedState = undefined
  readError = undefined
  writeError = undefined
})

test('renders the changelog collapsed when storage is empty', () => {
  const html = renderChangelog()

  assert.doesNotMatch(html, /<details[^>]*\sopen(?:\s|>)/)
})

test('renders the changelog open when storage contains true', () => {
  storedState = 'true'

  assert.match(renderChangelog(), /<details[^>]*\sopen(?:\s|>)/)
})

test('renders the changelog collapsed when reading localStorage throws', () => {
  readError = new Error('storage unavailable')

  assert.doesNotThrow(() => renderChangelog())
  assert.doesNotMatch(renderChangelog(), /<details[^>]*\sopen(?:\s|>)/)
})

test('persists the open state when the details element toggles', () => {
  let toggleHandler
  const details = {
    open: true,
    addEventListener(event, handler) {
      assert.equal(event, 'toggle')
      toggleHandler = handler
    },
  }

  setupChangelog(details)
  toggleHandler()

  assert.equal(savedState, 'true')
})

test('does not propagate errors when writing localStorage throws', () => {
  let toggleHandler
  const details = {
    open: false,
    addEventListener(_event, handler) {
      toggleHandler = handler
    },
  }
  writeError = new Error('storage quota exceeded')

  setupChangelog(details)

  assert.doesNotThrow(() => toggleHandler())
})

test('keeps the changelog entries unchanged', () => {
  const html = renderChangelog()
  const entries = [...html.matchAll(/<li>(.*?)<\/li>/g)].map((match) => match[1])

  assert.deepEqual(entries, [
    '<strong>TEST-2:</strong> Dodano stopkę z nazwą i wersją aplikacji.',
    '<strong>TEST-3:</strong> Dodano przycisk resetujący licznik.',
    '<strong>TEST-4:</strong> Dodano bieżący rok w stopce.',
    '<strong>BAR-95:</strong> Zastąpiono domyślny ekran Vite ekranem powitalnym.',
    '<strong>BAR-100:</strong> Dodano logo aplikacji (wordmark) na stronie głównej.',
    '<strong>BAR-106:</strong> Dodano animację kliknięcia i inteligentny stan przycisku Reset dla licznika.',
  ])
})
