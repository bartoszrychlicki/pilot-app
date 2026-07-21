type Theme = 'light' | 'dark'

export const THEME_STORAGE_KEY = 'pilot-theme'
const DARK_THEME_QUERY = '(prefers-color-scheme: dark)'

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
  return [
    '(function(){',
    `var storedTheme=localStorage.getItem(${JSON.stringify(THEME_STORAGE_KEY)});`,
    `var theme=(${resolveTheme.toString()})(storedTheme,matchMedia(${JSON.stringify(DARK_THEME_QUERY)}).matches);`,
    'document.documentElement.dataset.theme=theme',
    '})()',
  ].join('')
}

export function applyTheme(theme: Theme): void {
  document.documentElement.dataset.theme = theme
}

export function getCurrentTheme(): Theme {
  return document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light'
}

function updateThemeToggle(button: HTMLButtonElement, theme: Theme): void {
  button.textContent = theme === 'dark' ? '🌙' : '☀️'
  button.setAttribute(
    'aria-label',
    theme === 'dark' ? 'Przełącz na tryb jasny' : 'Przełącz na tryb ciemny',
  )
}

export function renderThemeToggle(): string {
  const theme = getCurrentTheme()
  const icon = theme === 'dark' ? '🌙' : '☀️'
  const label = theme === 'dark' ? 'Przełącz na tryb jasny' : 'Przełącz na tryb ciemny'

  return `<button id="theme-toggle" type="button" class="theme-toggle" aria-label="${label}">${icon}</button>`
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
