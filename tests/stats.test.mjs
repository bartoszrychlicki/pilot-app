import assert from 'node:assert/strict'
import test from 'node:test'

import { createSessionStats, formatDuration } from '../src/lib/stats.ts'

test('formats elapsed time as minutes and seconds', () => {
  assert.equal(formatDuration(0), '00:00')
  assert.equal(formatDuration(59_000), '00:59')
  assert.equal(formatDuration(60_000), '01:00')
  assert.equal(formatDuration(3_661_000), '61:01')
})

test('records session clicks and resets', () => {
  const stats = createSessionStats(1_000)

  stats.recordIncrement()
  stats.recordIncrement()
  stats.recordIncrement()
  stats.recordReset()
  stats.recordReset()

  assert.equal(stats.getClicks(), 3)
  assert.equal(stats.getResets(), 2)
})

test('calculates elapsed time from the session start', () => {
  const stats = createSessionStats(1_000)

  assert.equal(stats.getElapsedMs(1_000), 0)
  assert.equal(stats.getElapsedMs(2_500), 1_500)
  assert.equal(stats.getElapsedMs(4_000), 3_000)
})
