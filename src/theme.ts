const THEME_KEY = 'pilot-theme'

type Theme = 'light' | 'dark'

export function getPreferredTheme(): Theme {
  const storedTheme = localStorage.getItem(THEME_KEY)

  if (storedTheme === 'light' || storedTheme === 'dark') {
    return storedTheme
  }

  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export function applyTheme(theme: Theme): void {
  document.documentElement.dataset.theme = theme
}

function updateThemeToggle(button: HTMLButtonElement, theme: Theme): void {
  button.textContent = theme === 'dark' ? '🌙' : '☀️'
  button.setAttribute(
    'aria-label',
    theme === 'dark' ? 'Przełącz na tryb jasny' : 'Przełącz na tryb ciemny',
  )
}

export function renderThemeToggle(): string {
  const theme = document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light'
  const icon = theme === 'dark' ? '🌙' : '☀️'
  const label = theme === 'dark' ? 'Przełącz na tryb jasny' : 'Przełącz na tryb ciemny'

  return `<button id="theme-toggle" type="button" class="theme-toggle" aria-label="${label}">${icon}</button>`
}

export function setupThemeToggle(button: HTMLButtonElement): void {
  button.addEventListener('click', () => {
    const currentTheme = document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light'
    const nextTheme = currentTheme === 'dark' ? 'light' : 'dark'

    applyTheme(nextTheme)
    localStorage.setItem(THEME_KEY, nextTheme)
    updateThemeToggle(button, nextTheme)
  })
}
