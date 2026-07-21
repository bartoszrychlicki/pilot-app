import assert from 'node:assert/strict'
import { test } from 'node:test'

import { formatElapsed, setupStats } from '../src/stats.ts'

class FakeButton {
  listeners = new Map()

  addEventListener(event, listener) {
    this.listeners.set(event, listener)
  }

  click() {
    this.listeners.get('click')?.()
  }
}

function createElements() {
  return {
    clicks: { textContent: '0' },
    resets: { textContent: '0' },
    time: { textContent: '00:00' },
  }
}

test('formatElapsed formats elapsed milliseconds as mm:ss', async (t) => {
  for (const [milliseconds, expected] of [
    [0, '00:00'],
    [5000, '00:05'],
    [65000, '01:05'],
    [3599000, '59:59'],
    [3600000, '60:00'],
  ]) {
    await t.test(`${milliseconds} ms`, () => {
      assert.equal(formatElapsed(milliseconds), expected)
    })
  }
})

test('counts counter button clicks', () => {
  const counterButton = new FakeButton()
  const resetButton = new FakeButton()
  const elements = createElements()
  const stats = setupStats(counterButton, resetButton, elements)

  counterButton.click()
  counterButton.click()
  counterButton.click()

  assert.equal(elements.clicks.textContent, '3')
  stats.stop()
})

test('counts reset button clicks', () => {
  const counterButton = new FakeButton()
  const resetButton = new FakeButton()
  const elements = createElements()
  const stats = setupStats(counterButton, resetButton, elements)

  resetButton.click()
  resetButton.click()

  assert.equal(elements.resets.textContent, '2')
  stats.stop()
})

test('updates elapsed time on an interval tick', () => {
  const elements = createElements()
  let currentTime = 1000
  let tick

  const stats = setupStats(new FakeButton(), new FakeButton(), elements, {
    now: () => currentTime,
    setIntervalFn(callback, delay) {
      assert.equal(delay, 1000)
      tick = callback
      return 1
    },
    clearIntervalFn() {},
  })

  currentTime += 65000
  tick()

  assert.equal(elements.time.textContent, '01:05')
  stats.stop()
})

test('stop clears the stats interval', () => {
  let clearCalls = 0
  const intervalHandle = 42
  const stats = setupStats(new FakeButton(), new FakeButton(), createElements(), {
    setIntervalFn() {
      return intervalHandle
    },
    clearIntervalFn(handle) {
      clearCalls += 1
      assert.equal(handle, intervalHandle)
    },
  })

  stats.stop()

  assert.equal(clearCalls, 1)
})
