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

class FakeEventTarget {
  listeners = new Map()

  addEventListener(event, listener) {
    this.listeners.set(event, listener)
  }

  removeEventListener(event, listener) {
    if (this.listeners.get(event) === listener) {
      this.listeners.delete(event)
    }
  }

  keydown(key, target = this, modifiers = {}) {
    let defaultPrevented = false
    this.listeners.get('keydown')?.({
      key,
      target,
      ...modifiers,
      preventDefault() {
        defaultPrevented = true
      },
    })
    return defaultPrevented
  }
}

function withLocalStorage(localStorage, callback) {
  const originalDescriptor = Object.getOwnPropertyDescriptor(globalThis, 'localStorage')
  Object.defineProperty(globalThis, 'localStorage', {
    configurable: true,
    value: localStorage,
  })

  try {
    return callback()
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

function setupTestCounter(
  counterButton,
  resetButton = new FakeButton(),
  keyTarget = new FakeEventTarget(),
  callbacks,
) {
  const copyButton = new FakeButton()
  const feedbackElement = new FakeElement()
  const cleanup = setupCounter(
    counterButton,
    resetButton,
    copyButton,
    feedbackElement,
    keyTarget,
    callbacks,
  )

  return { cleanup, copyButton, feedbackElement }
}

async function withClipboard(writeText, callback) {
  const originalDescriptor = Object.getOwnPropertyDescriptor(globalThis, 'navigator')
  Object.defineProperty(globalThis, 'navigator', {
    configurable: true,
    value: { clipboard: { writeText } },
  })

  try {
    await callback()
  } finally {
    if (originalDescriptor) {
      Object.defineProperty(globalThis, 'navigator', originalDescriptor)
    } else {
      delete globalThis.navigator
    }
  }
}

test('loads the stored counter and persists increment and reset', () => {
  const storage = createMemoryStorage('7')

  withLocalStorage(storage, () => {
    const counterButton = new FakeButton()
    const resetButton = new FakeButton()

    setupTestCounter(counterButton, resetButton)
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
        setupTestCounter(counterButton)

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

    assert.doesNotThrow(() =>
      setupTestCounter(counterButton),
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
    const counterButton = new FakeButton()
    const resetButton = new FakeButton()

    assert.doesNotThrow(() => setupTestCounter(counterButton, resetButton))
    assert.equal(counterButton.innerHTML, 'Licznik: 0')

    assert.doesNotThrow(() => counterButton.click())
    assert.equal(counterButton.innerHTML, 'Licznik: 1')

    assert.doesNotThrow(() => resetButton.click())
    assert.equal(counterButton.innerHTML, 'Licznik: 0')
  })
})

test('+ shortcut increments the counter and persists the value', () => {
  const storage = createMemoryStorage('2')

  withLocalStorage(storage, () => {
    const counterButton = new FakeButton()
    const keyTarget = new FakeEventTarget()
    setupTestCounter(counterButton, new FakeButton(), keyTarget)

    assert.equal(keyTarget.keydown('+'), true)
    assert.equal(counterButton.innerHTML, 'Licznik: 3')
    assert.equal(storage.value(), '3')
  })
})

test('= shortcut increments the counter', () => {
  withLocalStorage(createMemoryStorage(), () => {
    const counterButton = new FakeButton()
    const keyTarget = new FakeEventTarget()
    setupTestCounter(counterButton, new FakeButton(), keyTarget)

    assert.equal(keyTarget.keydown('='), true)
    assert.equal(counterButton.innerHTML, 'Licznik: 1')
  })
})

test('r and R shortcuts reset the counter', () => {
  withLocalStorage(createMemoryStorage('4'), () => {
    const counterButton = new FakeButton()
    const keyTarget = new FakeEventTarget()
    setupTestCounter(counterButton, new FakeButton(), keyTarget)

    assert.equal(keyTarget.keydown('r'), true)
    assert.equal(counterButton.innerHTML, 'Licznik: 0')

    keyTarget.keydown('+')
    assert.equal(keyTarget.keydown('R'), true)
    assert.equal(counterButton.innerHTML, 'Licznik: 0')
  })
})

test('shortcuts are ignored when the event target is a text field', () => {
  withLocalStorage(createMemoryStorage('5'), () => {
    const counterButton = new FakeButton()
    const keyTarget = new FakeEventTarget()
    setupTestCounter(counterButton, new FakeButton(), keyTarget)

    assert.equal(keyTarget.keydown('+', { tagName: 'INPUT' }), false)
    assert.equal(counterButton.innerHTML, 'Licznik: 5')
  })
})

test('shortcuts are ignored when Ctrl, Cmd, or Alt is pressed', () => {
  withLocalStorage(createMemoryStorage('5'), () => {
    const counterButton = new FakeButton()
    const keyTarget = new FakeEventTarget()
    setupTestCounter(counterButton, new FakeButton(), keyTarget)

    assert.equal(keyTarget.keydown('r', keyTarget, { ctrlKey: true }), false)
    assert.equal(keyTarget.keydown('=', keyTarget, { metaKey: true }), false)
    assert.equal(keyTarget.keydown('+', keyTarget, { altKey: true }), false)
    assert.equal(counterButton.innerHTML, 'Licznik: 5')
  })
})

test('cleanup removes the keydown listener', () => {
  withLocalStorage(createMemoryStorage('2'), () => {
    const counterButton = new FakeButton()
    const keyTarget = new FakeEventTarget()
    const { cleanup } = setupTestCounter(counterButton, new FakeButton(), keyTarget)

    cleanup()

    assert.equal(keyTarget.keydown('+'), false)
    assert.equal(counterButton.innerHTML, 'Licznik: 2')
  })
})

test('unrecognized shortcuts do not change the counter', () => {
  withLocalStorage(createMemoryStorage('3'), () => {
    const counterButton = new FakeButton()
    const keyTarget = new FakeEventTarget()
    setupTestCounter(counterButton, new FakeButton(), keyTarget)

    assert.equal(keyTarget.keydown('a'), false)
    assert.equal(counterButton.innerHTML, 'Licznik: 3')
  })
})

test('reports increments and resets from clicks and keyboard shortcuts', () => {
  withLocalStorage(createMemoryStorage(), () => {
    const counterButton = new FakeButton()
    const resetButton = new FakeButton()
    const keyTarget = new FakeEventTarget()
    let increments = 0
    let resets = 0

    setupTestCounter(counterButton, resetButton, keyTarget, {
      onIncrement: () => {
        increments += 1
      },
      onReset: () => {
        resets += 1
      },
    })

    counterButton.click()
    keyTarget.keydown('+')
    keyTarget.keydown('=')
    resetButton.click()
    keyTarget.keydown('r')

    assert.equal(increments, 3)
    assert.equal(resets, 2)
  })
})

test('copies the current counter value and hides confirmation after two seconds', async (t) => {
  t.mock.timers.enable({ apis: ['setTimeout'] })
  const copiedValues = []

  await withClipboard(
    async (value) => {
      copiedValues.push(value)
    },
    async () => {
      await withLocalStorage(createMemoryStorage('5'), () => {
        const counterButton = new FakeButton()
        const { copyButton, feedbackElement } = setupTestCounter(counterButton)

        counterButton.click()
        counterButton.click()
        copyButton.click()

        return Promise.resolve().then(() => {
          assert.deepEqual(copiedValues, ['7'])
          assert.equal(feedbackElement.textContent, 'Skopiowano!')

          t.mock.timers.tick(1999)
          assert.equal(feedbackElement.textContent, 'Skopiowano!')

          t.mock.timers.tick(1)
          assert.equal(feedbackElement.textContent, '')
        })
      })
    },
  )
})

test('restarts the confirmation timeout after repeated copies', async (t) => {
  t.mock.timers.enable({ apis: ['setTimeout'] })

  await withClipboard(
    async () => {},
    async () => {
      const pendingAssertion = withLocalStorage(createMemoryStorage(), () => {
        const counterButton = new FakeButton()
        const { copyButton, feedbackElement } = setupTestCounter(counterButton)

        copyButton.click()
        return Promise.resolve()
          .then(() => {
            assert.equal(feedbackElement.textContent, 'Skopiowano!')
            t.mock.timers.tick(1000)
            copyButton.click()
          })
          .then(() => {
            t.mock.timers.tick(1000)
            assert.equal(feedbackElement.textContent, 'Skopiowano!')
            t.mock.timers.tick(999)
            assert.equal(feedbackElement.textContent, 'Skopiowano!')
            t.mock.timers.tick(1)
            assert.equal(feedbackElement.textContent, '')
          })
      })

      await pendingAssertion
    },
  )
})
