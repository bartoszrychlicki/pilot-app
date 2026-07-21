export function renderChangelog(): string {
  return `
    <h2>Dokonane zmiany w projekcie</h2>
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
  `
}
