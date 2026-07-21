import assert from 'node:assert/strict'
import test from 'node:test'

import { renderChangelog } from '../src/changelog.ts'

test('renders the BAR-96 through BAR-106 changelog entries in order', () => {
  const changelog = renderChangelog()
  const ticketIds = ['BAR-96', 'BAR-98', 'BAR-99', 'BAR-100', 'BAR-105', 'BAR-106']

  for (const ticketId of ticketIds) {
    assert.match(changelog, new RegExp(`<strong>${ticketId}:</strong>`))
  }

  const ticketPositions = ticketIds.map((ticketId) => changelog.indexOf(ticketId))
  assert.deepEqual(ticketPositions, [...ticketPositions].sort((a, b) => a - b))
})
