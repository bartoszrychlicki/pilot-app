import { useState } from 'react'
import { Section, SectionHead } from '@/components/br/section-head'
import {
  CHANGELOG_ENTRIES,
  CHANGELOG_STORAGE_KEY,
  resolveChangelogOpen,
} from '@/lib/changelog'

function readInitialOpenState(): boolean {
  try {
    return resolveChangelogOpen(localStorage.getItem(CHANGELOG_STORAGE_KEY))
  } catch {
    return false
  }
}

export function ChangelogSection() {
  const [open, setOpen] = useState(readInitialOpenState)

  return (
    <Section id="changelog">
      <SectionHead
        idx="02"
        eyebrow="Historia"
        title="Changelog"
        lede="Zmiany zachowane z poprzedniej wersji aplikacji."
      />
      <details
        className="changelog-details"
        open={open}
        onToggle={(event) => {
          const nextOpen = event.currentTarget.open
          setOpen(nextOpen)
          try {
            localStorage.setItem(CHANGELOG_STORAGE_KEY, String(nextOpen))
          } catch {
            // The native details element remains functional without storage.
          }
        }}
      >
        <summary>Dokonane zmiany w projekcie ({CHANGELOG_ENTRIES.length})</summary>
        <ol className="changelog-list">
          {CHANGELOG_ENTRIES.map((entry) => (
            <li key={entry.id}>
              <strong>{entry.id}:</strong> {entry.description}
            </li>
          ))}
        </ol>
      </details>
    </Section>
  )
}
