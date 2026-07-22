type Theme = 'light' | 'dark'

const THEME_STORAGE_KEY = 'pilot-theme'
const DARK_THEME_QUERY = '(prefers-color-scheme: dark)'

// This function is serialized into the bootstrap script via `.toString()`.
// Keep it self-contained: it must not reference module-level variables or other closures.
export function resolveTheme(storedTheme: string | null, prefersDark: boolean): Theme {
  if (storedTheme === 'light' || storedTheme === 'dark') {
    return storedTheme
  }

  return prefersDark ? 'dark' : 'light'
}

export function getPreferredTheme(): Theme {
  return resolveTheme(
    localStorage.getItem(THEME_STORAGE_KEY),
    window.matchMedia(DARK_THEME_QUERY).matches,
  )
}

export function getThemeBootstrapScript(): string {
  return `(function(){var resolveTheme=${resolveTheme.toString()};var storedTheme=localStorage.getItem(${JSON.stringify(THEME_STORAGE_KEY)});var prefersDark=matchMedia(${JSON.stringify(DARK_THEME_QUERY)}).matches;var theme=resolveTheme(storedTheme,prefersDark);document.documentElement.dataset.theme=theme})()`
}

export function applyTheme(theme: Theme): void {
  document.documentElement.dataset.theme = theme
}

export function getCurrentTheme(): Theme {
  return document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light'
}

function updateThemeToggle(button: HTMLButtonElement, theme: Theme): void {
  button.textContent = theme === 'dark' ? '🌙' : '☀️'
  const label = theme === 'dark' ? 'Przełącz na tryb jasny' : 'Przełącz na tryb ciemny'
  button.setAttribute('aria-label', label)
  button.setAttribute('title', label)
}

export function renderThemeToggle(): string {
  const theme = getCurrentTheme()
  const icon = theme === 'dark' ? '🌙' : '☀️'
  const label = theme === 'dark' ? 'Przełącz na tryb jasny' : 'Przełącz na tryb ciemny'

  return `<button id="theme-toggle" type="button" class="theme-toggle" aria-label="${label}" title="${label}">${icon}</button>`
}

export function setupThemeToggle(button: HTMLButtonElement): void {
  button.addEventListener('click', () => {
    const currentTheme = getCurrentTheme()
    const nextTheme = currentTheme === 'dark' ? 'light' : 'dark'

    applyTheme(nextTheme)
    localStorage.setItem(THEME_STORAGE_KEY, nextTheme)
    updateThemeToggle(button, nextTheme)
  })
}
