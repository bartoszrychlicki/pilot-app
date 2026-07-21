import assert from 'node:assert/strict'
import test from 'node:test'

import { formatElapsed, setupStats } from '../src/stats.ts'

class FakeCounterStore {
  state = {
    value: 0,
    sessionClicks: 0,
    sessionResets: 0,
  }
  listeners = new Set()

  getState() {
    return this.state
  }

  subscribe(listener) {
    this.listeners.add(listener)
    listener(this.state)
    return () => this.listeners.delete(listener)
  }

  update(state) {
    this.state = { ...this.state, ...state }
    this.listeners.forEach((listener) => listener(this.state))
  }
}

class FakeElement {
  textContent = ''
}

test('formats elapsed time as zero-padded minutes and seconds', () => {
  assert.equal(formatElapsed(0), '00:00')
  assert.equal(formatElapsed(5000), '00:05')
  assert.equal(formatElapsed(65000), '01:05')
  assert.equal(formatElapsed(3661000), '61:01')
})

test('counts counter clicks in the stats panel', (t) => {
  t.mock.timers.enable({ apis: ['Date', 'setInterval'], now: 0 })
  const counter = new FakeCounterStore()
  const statsElement = new FakeElement()

  setupStats(counter, statsElement)
  counter.update({ value: 3, sessionClicks: 3 })

  assert.equal(statsElement.textContent, 'Kliknięcia: 3 · Resety: 0 · Czas: 00:00')
})

test('counts reset clicks in the stats panel', (t) => {
  t.mock.timers.enable({ apis: ['Date', 'setInterval'], now: 0 })
  const counter = new FakeCounterStore()
  const statsElement = new FakeElement()

  setupStats(counter, statsElement)
  counter.update({ value: 0, sessionResets: 2 })

  assert.equal(statsElement.textContent, 'Kliknięcia: 0 · Resety: 2 · Czas: 00:00')
})

test('updates elapsed time every second', (t) => {
  t.mock.timers.enable({ apis: ['Date', 'setInterval'], now: 0 })
  const counter = new FakeCounterStore()
  const statsElement = new FakeElement()

  setupStats(counter, statsElement)
  assert.equal(statsElement.textContent, 'Kliknięcia: 0 · Resety: 0 · Czas: 00:00')

  t.mock.timers.tick(1000)
  assert.equal(statsElement.textContent, 'Kliknięcia: 0 · Resety: 0 · Czas: 00:01')

  t.mock.timers.tick(60000)
  assert.equal(statsElement.textContent, 'Kliknięcia: 0 · Resety: 0 · Czas: 01:01')

  t.mock.timers.tick(3600000)
  assert.equal(statsElement.textContent, 'Kliknięcia: 0 · Resety: 0 · Czas: 61:01')
})

test('stops updates after cleanup', (t) => {
  t.mock.timers.enable({ apis: ['Date', 'setInterval'], now: 0 })
  const counter = new FakeCounterStore()
  const statsElement = new FakeElement()
  const cleanup = setupStats(counter, statsElement)

  t.mock.timers.tick(1000)
  assert.equal(statsElement.textContent, 'Kliknięcia: 0 · Resety: 0 · Czas: 00:01')

  cleanup()
  counter.update({ value: 1, sessionClicks: 1 })
  t.mock.timers.tick(1000)

  assert.equal(statsElement.textContent, 'Kliknięcia: 0 · Resety: 0 · Czas: 00:01')
})
