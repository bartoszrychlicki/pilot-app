export function renderFooter(): string {
  const year = new Date().getFullYear()
  return `<footer aria-label="Informacje o aplikacji"><div class="footer-content">${__APP_NAME__} <a href="https://github.com/bartoszrychlicki/pilot-app/releases" target="_blank" rel="noopener">v${__APP_VERSION__}</a> · © ${year} · <a href="https://github.com/bartoszrychlicki/pilot-app" target="_blank" rel="noopener">GitHub</a></div></footer>`
}
