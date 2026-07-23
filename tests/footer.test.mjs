import assert from 'node:assert/strict'
import test from 'node:test'

import { getFooterYear, RELEASES_URL, REPOSITORY_URL } from '../src/lib/footer.ts'

test('keeps the repository and releases links', () => {
  assert.equal(REPOSITORY_URL, 'https://github.com/bartoszrychlicki/pilot-app')
  assert.equal(RELEASES_URL, 'https://github.com/bartoszrychlicki/pilot-app/releases')
})

test('returns the year for the supplied date', () => {
  assert.equal(getFooterYear(new Date('2024-06-01T00:00:00Z')), 2024)
})
