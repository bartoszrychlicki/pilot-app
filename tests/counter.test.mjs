import assert from 'node:assert/strict'
import test from 'node:test'

import { setupCounter } from '../src/counter.ts'

class FakeButton {
  innerHTML = ''
  disabled = false
  listeners = new Map()
  // stub classList: kod licznika po BAR-106 dodaje/zdejmuje klasę animacji
  classList = { add() {}, remove() {}, contains: () => false }

  addEventListener(event, listener) {
    this.listeners.set(event, listener)
  }

  click() {
    this.listeners.get('click')?.()
  }
}

class FakeElement {
  textContent = ''
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

function withNavigator(navigator, callback) {
  const originalDescriptor = Object.getOwnPropertyDescriptor(globalThis, 'navigator')
  Object.defineProperty(globalThis, 'navigator', {
    configurable: true,
    value: navigator,
  })

  try {
    return callback()
  } finally {
    if (originalDescriptor) {
      Object.defineProperty(globalThis, 'navigator', originalDescriptor)
    } else {
      delete globalThis.navigator
    }
  }
}

function createCounterElements() {
  return {
    counterButton: new FakeButton(),
    resetButton: new FakeButton(),
    copyButton: new FakeButton(),
    feedbackElement: new FakeElement(),
  }
}

test('loads the stored counter and persists increment and reset', () => {
  const storage = createMemoryStorage('7')

  withLocalStorage(storage, () => {
    const { counterButton, resetButton, copyButton, feedbackElement } = createCounterElements()

    setupCounter(counterButton, resetButton, copyButton, feedbackElement)
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
        const { counterButton, resetButton, copyButton, feedbackElement } = createCounterElements()
        setupCounter(counterButton, resetButton, copyButton, feedbackElement)

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
    const { counterButton, resetButton, copyButton, feedbackElement } = createCounterElements()

    assert.doesNotThrow(() =>
      setupCounter(counterButton, resetButton, copyButton, feedbackElement),
    )
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
    const { counterButton, resetButton, copyButton, feedbackElement } = createCounterElements()

    assert.doesNotThrow(() =>
      setupCounter(counterButton, resetButton, copyButton, feedbackElement),
    )
    assert.equal(counterButton.innerHTML, 'Licznik: 0')

    assert.doesNotThrow(() => counterButton.click())
    assert.equal(counterButton.innerHTML, 'Licznik: 1')

    assert.doesNotThrow(() => resetButton.click())
    assert.equal(counterButton.innerHTML, 'Licznik: 0')
  })
})

test('copies the current counter value and clears the confirmation after two seconds', async (t) => {
  t.mock.timers.enable({ apis: ['setTimeout'] })
  const copiedValues = []
  const storage = createMemoryStorage('5')
  const elements = createCounterElements()

  withNavigator(
    {
      clipboard: {
        async writeText(value) {
          copiedValues.push(value)
        },
      },
    },
    () => {
      withLocalStorage(storage, () => {
        setupCounter(
          elements.counterButton,
          elements.resetButton,
          elements.copyButton,
          elements.feedbackElement,
        )
        elements.counterButton.click()
        elements.counterButton.click()
        elements.copyButton.click()
      })
    },
  )

  await Promise.resolve()
  await Promise.resolve()

  assert.deepEqual(copiedValues, ['7'])
  assert.equal(elements.feedbackElement.textContent, 'Skopiowano!')

  t.mock.timers.tick(1999)
  assert.equal(elements.feedbackElement.textContent, 'Skopiowano!')

  t.mock.timers.tick(1)
  assert.equal(elements.feedbackElement.textContent, '')
})

test('keeps the confirmation visible for two seconds after the latest copy', async (t) => {
  t.mock.timers.enable({ apis: ['setTimeout'] })
  const storage = createMemoryStorage()
  const elements = createCounterElements()

  withNavigator(
    { clipboard: { writeText: async () => {} } },
    () => {
      withLocalStorage(storage, () => {
        setupCounter(
          elements.counterButton,
          elements.resetButton,
          elements.copyButton,
          elements.feedbackElement,
        )
        elements.copyButton.click()
      })
    },
  )

  await Promise.resolve()
  await Promise.resolve()
  t.mock.timers.tick(1000)

  withNavigator({ clipboard: { writeText: async () => {} } }, () => elements.copyButton.click())
  await Promise.resolve()
  await Promise.resolve()

  t.mock.timers.tick(1000)
  assert.equal(elements.feedbackElement.textContent, 'Skopiowano!')

  t.mock.timers.tick(999)
  assert.equal(elements.feedbackElement.textContent, 'Skopiowano!')

  t.mock.timers.tick(1)
  assert.equal(elements.feedbackElement.textContent, '')
})
