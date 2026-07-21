import assert from 'node:assert/strict'
import test from 'node:test'

import { formatElapsed, setupStats } from '../src/stats.ts'

class FakeButton {
  innerHTML = ''
  listeners = new Map()

  addEventListener(event, listener) {
    const eventListeners = this.listeners.get(event) ?? []
    eventListeners.push(listener)
    this.listeners.set(event, eventListeners)
  }

  click() {
    for (const listener of this.listeners.get('click') ?? []) {
      listener()
    }
  }
}

class FakeElement {
  innerHTML = ''
}

test('formats elapsed time as zero-padded minutes and seconds', () => {
  assert.equal(formatElapsed(0), '00:00')
  assert.equal(formatElapsed(5000), '00:05')
  assert.equal(formatElapsed(65000), '01:05')
  assert.equal(formatElapsed(3661000), '61:01')
})

test('counts counter clicks in the stats panel', (t) => {
  t.mock.timers.enable({ apis: ['Date', 'setInterval'], now: 0 })
  const counterButton = new FakeButton()
  const resetButton = new FakeButton()
  const statsElement = new FakeElement()

  setupStats(counterButton, resetButton, statsElement)
  counterButton.click()
  counterButton.click()
  counterButton.click()

  assert.equal(statsElement.innerHTML, 'Kliknięcia: 3 · Resety: 0 · Czas: 00:00')
})

test('counts reset clicks in the stats panel', (t) => {
  t.mock.timers.enable({ apis: ['Date', 'setInterval'], now: 0 })
  const counterButton = new FakeButton()
  const resetButton = new FakeButton()
  const statsElement = new FakeElement()

  setupStats(counterButton, resetButton, statsElement)
  resetButton.click()
  resetButton.click()

  assert.equal(statsElement.innerHTML, 'Kliknięcia: 0 · Resety: 2 · Czas: 00:00')
})

test('updates elapsed time every second', (t) => {
  t.mock.timers.enable({ apis: ['Date', 'setInterval'], now: 0 })
  const statsElement = new FakeElement()

  setupStats(new FakeButton(), new FakeButton(), statsElement)
  assert.equal(statsElement.innerHTML, 'Kliknięcia: 0 · Resety: 0 · Czas: 00:00')

  t.mock.timers.tick(1000)
  assert.equal(statsElement.innerHTML, 'Kliknięcia: 0 · Resety: 0 · Czas: 00:01')

  t.mock.timers.tick(60000)
  assert.equal(statsElement.innerHTML, 'Kliknięcia: 0 · Resety: 0 · Czas: 01:01')

  t.mock.timers.tick(3600000)
  assert.equal(statsElement.innerHTML, 'Kliknięcia: 0 · Resety: 0 · Czas: 61:01')
})
