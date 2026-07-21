const STORAGE_KEY = 'pilot-changelog-open'

function isChangelogOpen(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEY) === 'true'
  } catch {
    return false
  }
}

export function renderChangelog(): string {
  return `
    <details id="changelog-details" class="changelog" ${isChangelogOpen() ? 'open' : ''}>
      <summary>Dokonane zmiany w projekcie</summary>
      <ul>
        <li><strong>TEST-2:</strong> Dodano stopkę z nazwą i wersją aplikacji.</li>
        <li><strong>TEST-3:</strong> Dodano przycisk resetujący licznik.</li>
        <li><strong>TEST-4:</strong> Dodano bieżący rok w stopce.</li>
        <li><strong>BAR-95:</strong> Zastąpiono domyślny ekran Vite ekranem powitalnym.</li>
        <li><strong>BAR-100:</strong> Dodano logo aplikacji (wordmark) na stronie głównej.</li>
        <li><strong>BAR-106:</strong> Dodano animację kliknięcia i inteligentny stan przycisku Reset dla licznika.</li>
      </ul>
    </details>
  `
}

export function setupChangelog(details: HTMLDetailsElement): void {
  details.addEventListener('toggle', () => {
    try {
      localStorage.setItem(STORAGE_KEY, String(details.open))
    } catch (error) {
      if (import.meta.env?.DEV) {
        console.warn('Failed to save the changelog state to localStorage.', error)
      }
    }
  })
}
