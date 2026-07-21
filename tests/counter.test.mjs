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
    callback()
  } finally {
    if (originalDescriptor) {
      Object.defineProperty(globalThis, 'localStorage', originalDescriptor)
    } else {
      delete globalThis.localStorage
    }
  }
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

    setupCounter(
      counterButton,
      resetButton,
      new FakeButton(),
      new FakeElement(),
      new FakeEventTarget(),
    )
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
        setupCounter(
          counterButton,
          new FakeButton(),
          new FakeButton(),
          new FakeElement(),
          new FakeEventTarget(),
        )

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
      setupCounter(
        counterButton,
        new FakeButton(),
        new FakeButton(),
        new FakeElement(),
        new FakeEventTarget(),
      ),
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

    assert.doesNotThrow(() =>
      setupCounter(
        counterButton,
        resetButton,
        new FakeButton(),
        new FakeElement(),
        new FakeEventTarget(),
      ),
    )
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
    setupCounter(counterButton, new FakeButton(), new FakeButton(), new FakeElement(), keyTarget)

    assert.equal(keyTarget.keydown('+'), true)
    assert.equal(counterButton.innerHTML, 'Licznik: 3')
    assert.equal(storage.value(), '3')
  })
})

test('= shortcut increments the counter', () => {
  withLocalStorage(createMemoryStorage(), () => {
    const counterButton = new FakeButton()
    const keyTarget = new FakeEventTarget()
    setupCounter(counterButton, new FakeButton(), new FakeButton(), new FakeElement(), keyTarget)

    assert.equal(keyTarget.keydown('='), true)
    assert.equal(counterButton.innerHTML, 'Licznik: 1')
  })
})

test('r and R shortcuts reset the counter', () => {
  withLocalStorage(createMemoryStorage('4'), () => {
    const counterButton = new FakeButton()
    const keyTarget = new FakeEventTarget()
    setupCounter(counterButton, new FakeButton(), new FakeButton(), new FakeElement(), keyTarget)

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
    setupCounter(counterButton, new FakeButton(), new FakeButton(), new FakeElement(), keyTarget)

    assert.equal(keyTarget.keydown('+', { tagName: 'INPUT' }), false)
    assert.equal(counterButton.innerHTML, 'Licznik: 5')
  })
})

test('shortcuts are ignored when Ctrl, Cmd, or Alt is pressed', () => {
  withLocalStorage(createMemoryStorage('5'), () => {
    const counterButton = new FakeButton()
    const keyTarget = new FakeEventTarget()
    setupCounter(counterButton, new FakeButton(), new FakeButton(), new FakeElement(), keyTarget)

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
    const cleanup = setupCounter(
      counterButton,
      new FakeButton(),
      new FakeButton(),
      new FakeElement(),
      keyTarget,
    )

    cleanup()

    assert.equal(keyTarget.keydown('+'), false)
    assert.equal(counterButton.innerHTML, 'Licznik: 2')
  })
})

test('unrecognized shortcuts do not change the counter', () => {
  withLocalStorage(createMemoryStorage('3'), () => {
    const counterButton = new FakeButton()
    const keyTarget = new FakeEventTarget()
    setupCounter(counterButton, new FakeButton(), new FakeButton(), new FakeElement(), keyTarget)

    assert.equal(keyTarget.keydown('a'), false)
    assert.equal(counterButton.innerHTML, 'Licznik: 3')
  })
})

test('copies the current counter value and clears the confirmation after two seconds', async (t) => {
  t.mock.timers.enable({ apis: ['setTimeout'] })
  const clipboardCalls = []

  await withClipboard(async (text) => clipboardCalls.push(text), async () => {
    const counterButton = new FakeButton()
    const copyButton = new FakeButton()
    const feedback = new FakeElement()

    withLocalStorage(createMemoryStorage('6'), () => {
      setupCounter(counterButton, new FakeButton(), copyButton, feedback, new FakeEventTarget())
      counterButton.click()
      copyButton.click()
    })

    await Promise.resolve()
    assert.deepEqual(clipboardCalls, ['7'])
    assert.equal(feedback.textContent, 'Skopiowano!')

    t.mock.timers.tick(1999)
    assert.equal(feedback.textContent, 'Skopiowano!')

    t.mock.timers.tick(1)
    assert.equal(feedback.textContent, '')
  })
})

test('restarts the confirmation timeout after another copy', async (t) => {
  t.mock.timers.enable({ apis: ['setTimeout'] })
  const clipboardCalls = []

  await withClipboard(async (text) => clipboardCalls.push(text), async () => {
    const copyButton = new FakeButton()
    const feedback = new FakeElement()

    withLocalStorage(createMemoryStorage(), () => {
      setupCounter(
        new FakeButton(),
        new FakeButton(),
        copyButton,
        feedback,
        new FakeEventTarget(),
      )
    })

    copyButton.click()
    await Promise.resolve()
    t.mock.timers.tick(1000)

    copyButton.click()
    await Promise.resolve()
    t.mock.timers.tick(1999)
    assert.deepEqual(clipboardCalls, ['0', '0'])
    assert.equal(feedback.textContent, 'Skopiowano!')

    t.mock.timers.tick(1)
    assert.equal(feedback.textContent, '')
  })
})
