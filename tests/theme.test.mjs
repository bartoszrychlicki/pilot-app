import assert from 'node:assert/strict'
import { beforeEach, describe, test } from 'node:test'
import {
  applyTheme,
  getCurrentTheme,
  getPreferredTheme,
  getThemeBootstrapScript,
  renderThemeToggle,
  resolveTheme,
  setupThemeToggle,
} from '../src/theme.ts'

let storedTheme
let prefersDark
let savedTheme

const documentMock = {
  documentElement: {
    dataset: {},
  },
}

const localStorageMock = {
  getItem(key) {
    assert.equal(key, 'pilot-theme')
    return storedTheme
  },
  setItem(key, value) {
    assert.equal(key, 'pilot-theme')
    savedTheme = value
    storedTheme = value
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
  savedTheme = undefined
  documentMock.documentElement.dataset = {}
})

describe('getPreferredTheme', () => {
  test('uses a valid stored theme', () => {
    storedTheme = 'dark'

    assert.equal(getPreferredTheme(), 'dark')
  })

  test('falls back to the system preference when storage is empty', () => {
    prefersDark = true

    assert.equal(getPreferredTheme(), 'dark')
  })

  test('falls back to the system preference when storage is invalid', () => {
    storedTheme = 'legacy-theme'

    assert.equal(getPreferredTheme(), 'light')
  })
})

test('resolveTheme stays self-contained for bootstrap serialization', () => {
  const serializedResolver = resolveTheme.toString()

  assert.doesNotMatch(serializedResolver, /THEME_STORAGE_KEY/)
  assert.doesNotMatch(serializedResolver, /DARK_THEME_QUERY/)
})

test('the generated bootstrap script resolves themes identically to resolveTheme', () => {
  const runBootstrap = new Function(
    'localStorage',
    'matchMedia',
    'document',
    getThemeBootstrapScript(),
  )

  for (const storedThemeValue of [null, 'light', 'dark', 'invalid']) {
    for (const prefersDarkValue of [true, false]) {
      storedTheme = storedThemeValue
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

describe('renderThemeToggle', () => {
  test('renders the light theme icon and dark theme action', () => {
    applyTheme('light')

    assert.equal(
      renderThemeToggle(),
      '<button id="theme-toggle" type="button" class="theme-toggle" aria-label="Przełącz na tryb ciemny">☀️</button>',
    )
  })

  test('renders the dark theme icon and light theme action', () => {
    applyTheme('dark')

    assert.equal(
      renderThemeToggle(),
      '<button id="theme-toggle" type="button" class="theme-toggle" aria-label="Przełącz na tryb jasny">🌙</button>',
    )
  })
})

test('getCurrentTheme uses light as the safe fallback', () => {
  documentMock.documentElement.dataset.theme = 'legacy-theme'

  assert.equal(getCurrentTheme(), 'light')
})

test('the toggle switches the theme, persists it and updates its accessible content', () => {
  let clickHandler
  const attributes = new Map()
  const button = {
    textContent: '',
    addEventListener(event, handler) {
      assert.equal(event, 'click')
      clickHandler = handler
    },
    setAttribute(name, value) {
      attributes.set(name, value)
    },
  }
  applyTheme('light')
  setupThemeToggle(button)

  clickHandler()

  assert.equal(getCurrentTheme(), 'dark')
  assert.equal(savedTheme, 'dark')
  assert.equal(button.textContent, '🌙')
  assert.equal(attributes.get('aria-label'), 'Przełącz na tryb jasny')
})
