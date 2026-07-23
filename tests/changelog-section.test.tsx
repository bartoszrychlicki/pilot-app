import './setup/jsdom-env.ts'

import assert from 'node:assert/strict'
import { afterEach, test } from 'node:test'
import React from 'react'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { ChangelogSection } from '../src/components/app/changelog-section.tsx'
import { CHANGELOG_ENTRIES } from '../src/lib/changelog.ts'

afterEach(() => {
  cleanup()
  localStorage.clear()
})

test('renders entry count and the changelog in order', () => {
  render(<ChangelogSection />)
  screen.getByText(`Dokonane zmiany w projekcie (${CHANGELOG_ENTRIES.length})`)
  const ids = screen.getAllByText(/^(TEST|BAR)-\d+:$/).map((node) => node.textContent?.slice(0, -1))
  assert.deepEqual(ids, CHANGELOG_ENTRIES.map((entry) => entry.id))
})

test('loads and persists the details open state', () => {
  localStorage.setItem('pilot-changelog-open', 'true')
  render(<ChangelogSection />)
  const details = document.querySelector('details')
  assert.ok(details)
  assert.equal(details.open, true)

  details.open = false
  fireEvent(details, new Event('toggle'))
  assert.equal(localStorage.getItem('pilot-changelog-open'), 'false')
})
