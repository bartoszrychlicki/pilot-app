import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { App } from './App'
import { BRThemeProvider } from './components/br/theme-provider'
import { applyTheme, getPreferredTheme } from './lib/theme'
import './index.css'

const preferredTheme = getPreferredTheme()
applyTheme(preferredTheme)

try {
  const storedTweaks = localStorage.getItem('br-tweaks-v1')
  const tweaks = storedTweaks === null ? {} : (JSON.parse(storedTweaks) as Record<string, unknown>)
  localStorage.setItem('br-tweaks-v1', JSON.stringify({ ...tweaks, theme: preferredTheme }))
} catch {
  // BRThemeProvider has its own safe defaults when storage is unavailable.
}

createRoot(document.querySelector<HTMLDivElement>('#app')!).render(
  <StrictMode>
    <BRThemeProvider>
      <App />
    </BRThemeProvider>
  </StrictMode>,
)
