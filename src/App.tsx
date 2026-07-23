import { ChangelogSection } from '@/components/app/changelog-section'
import { CounterCard } from '@/components/app/counter-card'
import { SiteFooter } from '@/components/app/site-footer'
import { StatsPanel } from '@/components/app/stats-panel'
import { ThemeToggle } from '@/components/app/theme-toggle'
import { Hero } from '@/components/br/hero'
import { Section, SectionHead } from '@/components/br/section-head'
import { Topbar } from '@/components/br/topbar'
import { useSessionStats } from '@/hooks/use-session-stats'

const TOPBAR_LINKS = [
  { label: 'Start', href: '#welcome', active: true },
  { label: 'Licznik', href: '#counter' },
  { label: 'Changelog', href: '#changelog' },
]

export function App() {
  const stats = useSessionStats()

  return (
    <div className="app-shell">
      <div className="app-topbar">
        <Topbar brand="pilot-app" links={TOPBAR_LINKS} />
        <div className="app-topbar__action">
          <ThemeToggle />
        </div>
      </div>
      <main className="app-main">
        <div id="welcome" className="app-hero">
          <Hero />
        </div>
        <Section id="counter">
          <SectionHead
            idx="01"
            eyebrow="Demo"
            title="Witamy w pilot-app"
            lede="Prosta aplikacja demonstracyjna, w której rozwijamy i prezentujemy kolejne funkcje projektu."
          />
          <div className="app-dashboard">
            <CounterCard
              clickCount={stats.clicks}
              onIncrement={stats.recordIncrement}
              onReset={stats.recordReset}
            />
            <StatsPanel stats={stats} />
          </div>
        </Section>
        <ChangelogSection />
      </main>
      <SiteFooter />
    </div>
  )
}
