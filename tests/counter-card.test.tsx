import './setup/jsdom-env.ts'

import assert from 'node:assert/strict'
import { afterEach, test } from 'node:test'
import React from 'react'
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { CounterCard } from '../src/components/app/counter-card.tsx'

afterEach(() => {
  cleanup()
  localStorage.clear()
})

test('increments, resets, persists and handles keyboard shortcuts', () => {
  localStorage.setItem('pilot-counter', '2')
  let increments = 0
  let resets = 0
  render(
    <CounterCard
      clickCount={0}
      onIncrement={() => {
        increments += 1
      }}
      onReset={() => {
        resets += 1
      }}
    />,
  )

  const counter = screen.getByRole('button', { name: /Licznik: 2/ })
  const reset = screen.getByRole('button', { name: 'Reset' })
  assert.equal(reset.hasAttribute('disabled'), false)

  fireEvent.click(counter)
  assert.match(counter.textContent ?? '', /Licznik: 3/)
  assert.equal(localStorage.getItem('pilot-counter'), '3')
  assert.equal(increments, 1)

  fireEvent.keyDown(document, { key: '=' })
  assert.match(counter.textContent ?? '', /Licznik: 4/)
  fireEvent.keyDown(document, { key: 'R' })
  assert.match(counter.textContent ?? '', /Licznik: 0/)
  assert.equal(reset.hasAttribute('disabled'), true)
  assert.equal(resets, 1)
})

test('decrements to zero, persists the value and leaves session statistics unchanged', () => {
  let increments = 0
  let resets = 0
  render(
    <CounterCard
      clickCount={0}
      onIncrement={() => {
        increments += 1
      }}
      onReset={() => {
        resets += 1
      }}
    />,
  )

  const counter = screen.getByRole('button', { name: /Licznik: 0/ })
  const decrement = screen.getByRole('button', { name: 'Zmniejsz licznik o 1' })
  assert.equal(decrement.hasAttribute('disabled'), true)

  fireEvent.click(decrement)
  assert.match(counter.textContent ?? '', /Licznik: 0/)
  assert.equal(localStorage.getItem('pilot-counter'), '0')

  fireEvent.click(counter)
  fireEvent.click(counter)
  assert.match(counter.textContent ?? '', /Licznik: 2/)
  assert.equal(increments, 2)

  fireEvent.click(decrement)
  assert.match(counter.textContent ?? '', /Licznik: 1/)
  assert.equal(localStorage.getItem('pilot-counter'), '1')
  assert.equal(increments, 2)
  assert.equal(resets, 0)

  fireEvent.click(decrement)
  assert.match(counter.textContent ?? '', /Licznik: 0/)
  assert.equal(localStorage.getItem('pilot-counter'), '0')
  assert.equal(decrement.hasAttribute('disabled'), true)
  assert.equal(increments, 2)
  assert.equal(resets, 0)
})

test('ignores shortcuts in text fields and restarts the pulse animation', () => {
  render(<CounterCard />)
  const counter = screen.getByRole('button', { name: /Licznik: 0/ })
  const input = document.createElement('input')
  document.body.append(input)

  fireEvent.keyDown(input, { key: '+' })
  assert.match(counter.textContent ?? '', /Licznik: 0/)
  fireEvent.click(counter)
  assert.equal(counter.classList.contains('counter--pulse'), true)
  fireEvent.animationEnd(counter)
  assert.equal(counter.classList.contains('counter--pulse'), false)
  input.remove()
})

test('copies through Clipboard API and reports success', async (t) => {
  let copiedValue = ''
  const originalClipboard = Object.getOwnPropertyDescriptor(navigator, 'clipboard')
  Object.defineProperty(navigator, 'clipboard', {
    configurable: true,
    value: {
      async writeText(value: string) {
        copiedValue = value
      },
    },
  })
  t.after(() => {
    if (originalClipboard !== undefined) {
      Object.defineProperty(navigator, 'clipboard', originalClipboard)
    } else {
      delete (navigator as Navigator & { clipboard?: Clipboard }).clipboard
    }
  })

  render(<CounterCard />)
  fireEvent.click(screen.getByRole('button', { name: /Licznik: 0/ }))
  fireEvent.click(screen.getByRole('button', { name: 'Kopiuj wartość licznika' }))

  await waitFor(() => assert.equal(screen.getByText('Skopiowano!').textContent, 'Skopiowano!'))
  assert.equal(copiedValue, '1')
})

test('reports an error when no clipboard implementation is available', async () => {
  Object.defineProperty(navigator, 'clipboard', { configurable: true, value: undefined })
  render(<CounterCard />)
  fireEvent.click(screen.getByRole('button', { name: 'Kopiuj wartość licznika' }))
  await waitFor(() =>
    assert.equal(screen.getByText('Nie udało się skopiować').textContent, 'Nie udało się skopiować'),
  )
})
