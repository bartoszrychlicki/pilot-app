import assert from 'node:assert/strict'
import test from 'node:test'

import { setupCounter } from '../src/counter.ts'

class FakeClassList {
  values = new Set()
  additions = []
  removals = []

  add(value) {
    this.values.add(value)
    this.additions.push(value)
  }

  remove(value) {
    this.values.delete(value)
    this.removals.push(value)
  }

  contains(value) {
    return this.values.has(value)
  }
}

class FakeButton extends EventTarget {
  classList = new FakeClassList()
  disabled = false
  innerHTML = ''
  listenerCounts = new Map()
  offsetWidthReads = 0

  addEventListener(type, listener, options) {
    this.listenerCounts.set(type, (this.listenerCounts.get(type) ?? 0) + 1)
    super.addEventListener(type, listener, options)
  }

  get offsetWidth() {
    this.offsetWidthReads += 1
    return 0
  }

  click() {
    this.dispatchEvent(new Event('click'))
  }
}

class FakeElement {
  textContent = ''
}

function createCounter() {
  const counter = new FakeButton()
  const reset = new FakeButton()
  const copy = new FakeButton()
  const feedback = new FakeElement()

  setupCounter(counter, reset, copy, feedback)

  return { counter, reset, copy, feedback }
}

test('reset is disabled only when the counter equals zero', () => {
  const { counter, reset } = createCounter()

  assert.equal(counter.innerHTML, 'Licznik: 0')
  assert.equal(reset.disabled, true)

  counter.click()
  assert.equal(counter.innerHTML, 'Licznik: 1')
  assert.equal(reset.disabled, false)

  reset.click()
  assert.equal(counter.innerHTML, 'Licznik: 0')
  assert.equal(reset.disabled, true)
})

test('counter pulse is restarted on every click and removed when animation ends', () => {
  const { counter } = createCounter()

  counter.click()
  counter.click()

  assert.equal(counter.classList.contains('counter--pulse'), true)
  assert.deepEqual(counter.classList.additions, ['counter--pulse', 'counter--pulse'])
  assert.deepEqual(counter.classList.removals, ['counter--pulse', 'counter--pulse'])
  assert.equal(counter.offsetWidthReads, 2)
  assert.equal(counter.listenerCounts.get('animationend'), 1)

  counter.dispatchEvent(new Event('animationend'))
  assert.equal(counter.classList.contains('counter--pulse'), false)
})
