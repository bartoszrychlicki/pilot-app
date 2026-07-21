import assert from 'node:assert/strict'
import { describe, test } from 'node:test'

import { setupCounter } from '../src/counter.ts'

class FakeClassList {
  readonly values = new Set<string>()
  pulseAdditions = 0

  add(...tokens: string[]) {
    for (const token of tokens) {
      this.values.add(token)
      if (token === 'pulse') this.pulseAdditions += 1
    }
  }

  remove(...tokens: string[]) {
    for (const token of tokens) this.values.delete(token)
  }

  contains(token: string) {
    return this.values.has(token)
  }
}

class FakeButton {
  readonly classList = new FakeClassList()
  readonly offsetWidth = 0
  textContent: string | null = ''
  private readonly listeners = new Map<string, Array<() => void>>()

  addEventListener(type: string, listener: () => void) {
    const listeners = this.listeners.get(type) ?? []
    listeners.push(listener)
    this.listeners.set(type, listeners)
  }

  click() {
    for (const listener of this.listeners.get('click') ?? []) listener()
  }
}

function createCounter() {
  const counter = new FakeButton()
  const reset = new FakeButton()
  const decrement = new FakeButton()

  setupCounter(
    counter as unknown as HTMLButtonElement,
    reset as unknown as HTMLButtonElement,
    decrement as unknown as HTMLButtonElement,
  )

  return { counter, reset, decrement }
}

describe('setupCounter', () => {
  test('inicjalizuje licznik bez animacji pulsu', () => {
    const { counter } = createCounter()

    assert.equal(counter.textContent, 'Licznik: 0')
    assert.equal(counter.classList.contains('pulse'), false)
    assert.equal(counter.classList.pulseAdditions, 0)
  })

  test('zwiększa i zmniejsza licznik oraz uruchamia puls', () => {
    const { counter, decrement } = createCounter()

    counter.click()
    assert.equal(counter.textContent, 'Licznik: 1')
    assert.equal(counter.classList.contains('pulse'), true)
    assert.equal(counter.classList.pulseAdditions, 1)

    decrement.click()
    assert.equal(counter.textContent, 'Licznik: 0')
    assert.equal(counter.classList.contains('pulse'), true)
    assert.equal(counter.classList.pulseAdditions, 2)
  })

  test('nie zmniejsza licznika poniżej zera', () => {
    const { counter, decrement } = createCounter()

    decrement.click()
    decrement.click()

    assert.equal(counter.textContent, 'Licznik: 0')
  })

  test('resetuje licznik do zera i uruchamia puls', () => {
    const { counter, reset } = createCounter()

    counter.click()
    reset.click()

    assert.equal(counter.textContent, 'Licznik: 0')
    assert.equal(counter.classList.pulseAdditions, 2)
  })
})
