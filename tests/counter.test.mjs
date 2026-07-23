import assert from 'node:assert/strict'
import test from 'node:test'

import { getClickNoun, readStoredCounter, STORAGE_KEY } from '../src/lib/counter.ts'

test('keeps the existing counter storage key', () => {
  assert.equal(STORAGE_KEY, 'pilot-counter')
})

test('reads persisted non-negative integers', () => {
  assert.equal(readStoredCounter('0'), 0)
  assert.equal(readStoredCounter('7'), 7)
  assert.equal(readStoredCounter('0012'), 12)
})

test('falls back to zero for missing and invalid values', () => {
  for (const value of [null, 'not-a-number', '-5', '1.5', ' ', '1e2']) {
    assert.equal(readStoredCounter(value), 0)
  }
})

test('uses the correct Polish click noun', () => {
  assert.equal(getClickNoun(1), 'kliknięcie')
  assert.equal(getClickNoun(2), 'kliknięcia')
  assert.equal(getClickNoun(4), 'kliknięcia')
  assert.equal(getClickNoun(5), 'kliknięć')
  assert.equal(getClickNoun(12), 'kliknięć')
  assert.equal(getClickNoun(22), 'kliknięcia')
})
