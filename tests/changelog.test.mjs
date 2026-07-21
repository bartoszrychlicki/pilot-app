import assert from 'node:assert/strict'
import test from 'node:test'

import { renderChangelog, resolveChangelogOpen, setupChangelog } from '../src/changelog.ts'

test('resolves the persisted changelog state', () => {
  assert.equal(resolveChangelogOpen(null), false)
  assert.equal(resolveChangelogOpen('true'), true)
  assert.equal(resolveChangelogOpen('false'), false)
  assert.equal(resolveChangelogOpen('garbage'), false)
})

test('renders the changelog collapsed by default', () => {
  const changelog = renderChangelog(false)

  assert.match(changelog, /<details id="changelog-details">/)
  assert.match(changelog, /<summary>Dokonane zmiany w projekcie<\/summary>/)
  assert.doesNotMatch(changelog, /<details[^>]* open/)
})

test('renders the changelog open when requested', () => {
  assert.match(renderChangelog(true), /<details id="changelog-details" open>/)
})

test('persists the changelog state when it is toggled', (t) => {
  let toggleHandler
  let savedOpen
  const originalLocalStorage = Object.getOwnPropertyDescriptor(globalThis, 'localStorage')
  const details = {
    open: false,
    addEventListener(event, handler) {
      assert.equal(event, 'toggle')
      toggleHandler = handler
    },
  }
  const localStorageMock = {
    setItem(key, value) {
      assert.equal(key, 'pilot-changelog-open')
      savedOpen = value
    },
  }
  Object.defineProperty(globalThis, 'localStorage', {
    configurable: true,
    value: localStorageMock,
  })
  t.after(() => {
    if (originalLocalStorage) {
      Object.defineProperty(globalThis, 'localStorage', originalLocalStorage)
    } else {
      delete globalThis.localStorage
    }
  })
  setupChangelog(details)

  details.open = true
  toggleHandler()

  assert.equal(savedOpen, 'true')
})

test('renders the BAR-96 through BAR-106 changelog entries in order', () => {
  const changelog = renderChangelog()
  const ticketIds = ['BAR-96', 'BAR-98', 'BAR-99', 'BAR-100', 'BAR-105', 'BAR-106']

  for (const ticketId of ticketIds) {
    assert.match(changelog, new RegExp(`<strong>${ticketId}:</strong>`))
  }

  const ticketPositions = ticketIds.map((ticketId) => changelog.indexOf(ticketId))
  assert.deepEqual(ticketPositions, [...ticketPositions].sort((a, b) => a - b))
})
