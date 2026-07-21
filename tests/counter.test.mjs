import assert from 'node:assert/strict'
import test from 'node:test'

import { setupCounter } from '../src/counter.ts'

class FakeButton {
  innerHTML = ''
  listeners = new Map()

  addEventListener(event, listener) {
    this.listeners.set(event, listener)
  }

  click() {
    this.listeners.get('click')?.()
  }
}

function withLocalStorage(localStorage, callback) {
  const originalDescriptor = Object.getOwnPropertyDescriptor(globalThis, 'localStorage')
  Object.defineProperty(globalThis, 'localStorage', {
    configurable: true,
    value: localStorage,
  })

  try {
    callback()
  } finally {
    if (originalDescriptor) {
      Object.defineProperty(globalThis, 'localStorage', originalDescriptor)
    } else {
      delete globalThis.localStorage
    }
  }
}

function createMemoryStorage(initialValue = null) {
  let value = initialValue

  return {
    getItem() {
      return value
    },
    setItem(_key, nextValue) {
      value = nextValue
    },
    value() {
      return value
    },
  }
}

test('loads the stored counter and persists increment and reset', () => {
  const storage = createMemoryStorage('7')

  withLocalStorage(storage, () => {
    const counterButton = new FakeButton()
    const resetButton = new FakeButton()

    setupCounter(counterButton, resetButton)
    assert.equal(counterButton.innerHTML, 'Licznik: 7')

    counterButton.click()
    assert.equal(counterButton.innerHTML, 'Licznik: 8')
    assert.equal(storage.value(), '8')

    resetButton.click()
    assert.equal(counterButton.innerHTML, 'Licznik: 0')
    assert.equal(storage.value(), '0')
  })
})

test('falls back to zero for missing or invalid decimal integer values', async (t) => {
  for (const storedValue of [null, 'not-a-number', '-5', '1.5', ' ', '1e2']) {
    await t.test(String(storedValue), () => {
      const storage = createMemoryStorage(storedValue)

      withLocalStorage(storage, () => {
        const counterButton = new FakeButton()
        setupCounter(counterButton, new FakeButton())

        assert.equal(counterButton.innerHTML, 'Licznik: 0')
        assert.equal(storage.value(), '0')
      })
    })
  }
})

test('starts at zero when reading localStorage throws', () => {
  const storage = {
    getItem() {
      throw new Error('storage unavailable')
    },
    setItem() {},
  }

  withLocalStorage(storage, () => {
    const counterButton = new FakeButton()

    assert.doesNotThrow(() => setupCounter(counterButton, new FakeButton()))
    assert.equal(counterButton.innerHTML, 'Licznik: 0')
  })
})

test('keeps updating the counter when writing localStorage throws', () => {
  const storage = {
    getItem() {
      return null
    },
    setItem() {
      throw new Error('storage quota exceeded')
    },
  }

  withLocalStorage(storage, () => {
    const counterButton = new FakeButton()
    const resetButton = new FakeButton()

    assert.doesNotThrow(() => setupCounter(counterButton, resetButton))
    assert.equal(counterButton.innerHTML, 'Licznik: 0')

    assert.doesNotThrow(() => counterButton.click())
    assert.equal(counterButton.innerHTML, 'Licznik: 1')

    assert.doesNotThrow(() => resetButton.click())
    assert.equal(counterButton.innerHTML, 'Licznik: 0')
  })
})
