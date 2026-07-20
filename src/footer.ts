export function renderFooter(): string {
  const year = new Date().getFullYear()
  return `<footer>${__APP_NAME__} v${__APP_VERSION__} · © ${year}</footer>`
}
