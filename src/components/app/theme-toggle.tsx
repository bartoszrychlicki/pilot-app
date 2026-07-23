import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { applyTheme, getCurrentTheme, THEME_STORAGE_KEY } from '@/lib/theme'

export function ThemeToggle() {
  const [theme, setTheme] = useState(getCurrentTheme)
  const label = theme === 'dark' ? 'Przełącz na tryb jasny' : 'Przełącz na tryb ciemny'

  return (
    <Button
      type="button"
      variant="outline"
      size="icon-lg"
      className="theme-toggle"
      aria-label={label}
      title={label}
      onClick={() => {
        const nextTheme = theme === 'dark' ? 'light' : 'dark'
        applyTheme(nextTheme)
        try {
          localStorage.setItem(THEME_STORAGE_KEY, nextTheme)
        } catch {
          // The visual toggle remains functional without storage.
        }
        setTheme(nextTheme)
      }}
    >
      <span aria-hidden="true">{theme === 'dark' ? '🌙' : '☀️'}</span>
    </Button>
  )
}
