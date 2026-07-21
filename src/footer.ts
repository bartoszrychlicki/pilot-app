export function renderFooter(): string {
  const year = new Date().getFullYear()
  return `<footer>${__APP_NAME__} v${__APP_VERSION__} · © ${year} · <a href="https://github.com/bartoszrychlicki/pilot-app" target="_blank" rel="noopener">GitHub</a></footer>`
}
