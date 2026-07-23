export const RELEASES_URL = 'https://github.com/bartoszrychlicki/pilot-app/releases'
export const REPOSITORY_URL = 'https://github.com/bartoszrychlicki/pilot-app'

export function getFooterYear(date: Date = new Date()): number {
  return date.getFullYear()
}
