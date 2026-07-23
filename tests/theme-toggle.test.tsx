import './setup/jsdom-env.ts'

import assert from 'node:assert/strict'
import { afterEach, test } from 'node:test'
import React from 'react'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { ThemeToggle } from '../src/components/app/theme-toggle.tsx'

afterEach(() => {
  cleanup()
  localStorage.clear()
  document.documentElement.dataset.theme = 'light'
})

test('switches theme, persistence, label, title and icon', () => {
  document.documentElement.dataset.theme = 'light'
  render(<ThemeToggle />)
  const toggle = screen.getByRole('button', { name: 'Przełącz na tryb ciemny' })
  assert.equal(toggle.getAttribute('title'), 'Przełącz na tryb ciemny')
  assert.match(toggle.textContent ?? '', /☀️/)

  fireEvent.click(toggle)
  assert.equal(document.documentElement.dataset.theme, 'dark')
  assert.equal(localStorage.getItem('pilot-theme'), 'dark')
  assert.equal(toggle.getAttribute('aria-label'), 'Przełącz na tryb jasny')
  assert.equal(toggle.getAttribute('title'), 'Przełącz na tryb jasny')
  assert.match(toggle.textContent ?? '', /🌙/)
})
