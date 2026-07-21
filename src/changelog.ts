const CHANGELOG_STORAGE_KEY = 'pilot-changelog-open'

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

export function renderChangelog(open: boolean = getChangelogOpen()): string {
  return `
    <details id="changelog-details"${open ? ' open' : ''}>
      <summary>Dokonane zmiany w projekcie</summary>
      <ul>
        <li><strong>TEST-2:</strong> Dodano stopkę z nazwą i wersją aplikacji.</li>
        <li><strong>TEST-3:</strong> Dodano przycisk resetujący licznik.</li>
        <li><strong>TEST-4:</strong> Dodano bieżący rok w stopce.</li>
        <li><strong>BAR-95:</strong> Zastąpiono domyślny ekran Vite ekranem powitalnym.</li>
        <li><strong>BAR-96:</strong> Dodano znak © przed rokiem w stopce.</li>
        <li><strong>BAR-98:</strong> Spolszczono etykietę przycisku licznika.</li>
        <li><strong>BAR-99:</strong> Ustawiono polski język strony i meta description.</li>
        <li><strong>BAR-100:</strong> Dodano logo aplikacji (wordmark) na stronie głównej.</li>
        <li><strong>BAR-105:</strong> Dodano link do GitHub w stopce.</li>
        <li><strong>BAR-106:</strong> Dodano animację kliknięcia i inteligentny stan przycisku Reset dla licznika.</li>
      </ul>
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
