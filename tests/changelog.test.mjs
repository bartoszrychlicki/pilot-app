import assert from 'node:assert/strict'
import test from 'node:test'

import {
  CHANGELOG_ENTRIES,
  CHANGELOG_STORAGE_KEY,
  resolveChangelogOpen,
} from '../src/lib/changelog.ts'

test('resolves the persisted changelog state', () => {
  assert.equal(resolveChangelogOpen(null), false)
  assert.equal(resolveChangelogOpen('true'), true)
  assert.equal(resolveChangelogOpen('false'), false)
  assert.equal(resolveChangelogOpen('garbage'), false)
})

test('keeps the changelog storage key', () => {
  assert.equal(CHANGELOG_STORAGE_KEY, 'pilot-changelog-open')
})

test('keeps existing entries in order and appends BAR-165', () => {
  assert.deepEqual(
    CHANGELOG_ENTRIES.map((entry) => entry.id),
    [
      'TEST-2',
      'TEST-3',
      'TEST-4',
      'BAR-95',
      'BAR-96',
      'BAR-98',
      'BAR-99',
      'BAR-100',
      'BAR-105',
      'BAR-106',
      'BAR-165',
    ],
  )
})
