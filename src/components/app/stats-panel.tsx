import { Badge, Card, StatCard } from '@/components/br/primitives'
import type { SessionStatsController } from '@/hooks/use-session-stats'
import { formatDuration } from '@/lib/stats'

export function StatsPanel({ stats }: { stats: SessionStatsController }) {
  return (
    <Card className="stats-card" aria-label="Statystyki sesji">
      <div className="stats-card__heading">
        <h3>Ta sesja</h3>
        <Badge dot variant="success">
          Live
        </Badge>
      </div>
      <div className="stats-grid">
        <StatCard label="Kliknięcia" value={stats.clicks} />
        <StatCard label="Resety" value={stats.resets} />
        <StatCard label="Czas sesji" value={formatDuration(stats.elapsedMs)} />
      </div>
    </Card>
  )
}
