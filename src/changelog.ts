const CHANGELOG_STORAGE_KEY = 'pilot-changelog-open'

const CHANGELOG_ENTRIES: ReadonlyArray<{ id: string; description: string }> = [
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
]

export function resolveChangelogOpen(stored: string | null): boolean {
  return stored === 'true'
}

function getChangelogOpen(): boolean {
  try {
    return resolveChangelogOpen(localStorage.getItem(CHANGELOG_STORAGE_KEY))
  } catch {
    return false
  }
}

function renderChangelogEntry(entry: { id: string; description: string }): string {
  return `<li><strong>${entry.id}:</strong> ${entry.description}</li>`
}

export function renderChangelog(open: boolean = getChangelogOpen()): string {
  return `
    <details id="changelog-details"${open ? ' open' : ''}>
      <summary>Dokonane zmiany w projekcie (${CHANGELOG_ENTRIES.length})</summary>
      <ul>${CHANGELOG_ENTRIES.map(renderChangelogEntry).join('')}</ul>
    </details>
  `
}

export function setupChangelog(details: HTMLDetailsElement): void {
  details.addEventListener('toggle', () => {
    try {
      localStorage.setItem(CHANGELOG_STORAGE_KEY, String(details.open))
    } catch {
      // The native details toggle remains functional when storage is unavailable.
    }
  })
}
