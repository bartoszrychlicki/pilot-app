import { getFooterYear, RELEASES_URL, REPOSITORY_URL } from '@/lib/footer'

export function SiteFooter() {
  return (
    <footer className="site-footer" aria-label="Informacje o aplikacji">
      <div className="site-footer__content">
        <span>{__APP_NAME__}</span>
        <a href={RELEASES_URL} target="_blank" rel="noopener">
          v{__APP_VERSION__}
        </a>
        <span>· © {getFooterYear()}</span>
        <span>·</span>
        <a href={REPOSITORY_URL} target="_blank" rel="noopener">
          GitHub
        </a>
      </div>
    </footer>
  )
}
