export const CHANGELOG_STORAGE_KEY = 'pilot-changelog-open'

export const CHANGELOG_ENTRIES: ReadonlyArray<{ id: string; description: string }> = [
  { id: 'TEST-2', description: 'Dodano stopkę z nazwą i wersją aplikacji.' },
  { id: 'TEST-3', description: 'Dodano przycisk resetujący licznik.' },
  { id: 'TEST-4', description: 'Dodano bieżący rok w stopce.' },
  { id: 'BAR-95', description: 'Zastąpiono domyślny ekran Vite ekranem powitalnym.' },
  { id: 'BAR-96', description: 'Dodano znak © przed rokiem w stopce.' },
  { id: 'BAR-98', description: 'Spolszczono etykietę przycisku licznika.' },
  { id: 'BAR-99', description: 'Ustawiono polski język strony i meta description.' },
  { id: 'BAR-100', description: 'Dodano logo aplikacji (wordmark) na stronie głównej.' },
  { id: 'BAR-105', description: 'Dodano link do GitHub w stopce.' },
  {
    id: 'BAR-106',
    description: 'Dodano animację kliknięcia i inteligentny stan przycisku Reset dla licznika.',
  },
  {
    id: 'BAR-165',
    description: 'Dodano design system BR-UI i przeniesiono domyślny ekran do React.',
  },
]

export function resolveChangelogOpen(stored: string | null): boolean {
  return stored === 'true'
}
