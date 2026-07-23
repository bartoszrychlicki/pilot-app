import assert from 'node:assert/strict'
import { beforeEach, describe, test } from 'node:test'
import {
  applyTheme,
  getCurrentTheme,
  getPreferredTheme,
  getThemeBootstrapScript,
  resolveTheme,
  THEME_STORAGE_KEY,
} from '../src/lib/theme.ts'

let storedTheme
let prefersDark

const documentMock = { documentElement: { dataset: {} } }
const localStorageMock = {
  getItem(key) {
    assert.equal(key, THEME_STORAGE_KEY)
    return storedTheme
  },
}

Object.defineProperties(globalThis, {
  document: { configurable: true, value: documentMock },
  localStorage: { configurable: true, value: localStorageMock },
  window: {
    configurable: true,
    value: {
      matchMedia(query) {
        assert.equal(query, '(prefers-color-scheme: dark)')
        return { matches: prefersDark }
      },
    },
  },
})

beforeEach(() => {
  storedTheme = null
  prefersDark = false
  documentMock.documentElement.dataset = {}
})

describe('getPreferredTheme', () => {
  test('uses a valid stored theme', () => {
    storedTheme = 'dark'
    assert.equal(getPreferredTheme(), 'dark')
  })

  test('falls back to the system preference', () => {
    prefersDark = true
    assert.equal(getPreferredTheme(), 'dark')
  })
})

test('resolveTheme stays self-contained for bootstrap serialization', () => {
  const serializedResolver = resolveTheme.toString()
  assert.doesNotMatch(serializedResolver, /THEME_STORAGE_KEY/)
  assert.doesNotMatch(serializedResolver, /DARK_THEME_QUERY/)
})

test('the bootstrap script resolves identically to resolveTheme', () => {
  const runBootstrap = new Function(
    'localStorage',
    'matchMedia',
    'document',
    getThemeBootstrapScript(),
  )

  for (const storedValue of [null, 'light', 'dark', 'invalid']) {
    for (const prefersDarkValue of [true, false]) {
      storedTheme = storedValue
      prefersDark = prefersDarkValue
      const bootstrapDocument = { documentElement: { dataset: {} } }
      runBootstrap(localStorageMock, () => ({ matches: prefersDark }), bootstrapDocument)
      assert.equal(
        bootstrapDocument.documentElement.dataset.theme,
        resolveTheme(storedTheme, prefersDark),
      )
    }
  }
})

test('applyTheme and getCurrentTheme keep the safe light fallback', () => {
  applyTheme('dark')
  assert.equal(getCurrentTheme(), 'dark')
  documentMock.documentElement.dataset.theme = 'legacy-theme'
  assert.equal(getCurrentTheme(), 'light')
})
