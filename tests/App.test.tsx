import './setup/jsdom-env.ts'

import assert from 'node:assert/strict'
import { afterEach, test } from 'node:test'
import React from 'react'
import { cleanup, fireEvent, render, screen, within } from '@testing-library/react'
import { App } from '../src/App.tsx'
import { BRThemeProvider } from '../src/components/br/theme-provider.tsx'

afterEach(() => {
  cleanup()
  localStorage.clear()
})

test('renders all preserved features on one BR-UI screen', () => {
  render(
    <BRThemeProvider>
      <App />
    </BRThemeProvider>,
  )

  screen.getByText('Atelier of')
  screen.getByRole('heading', { name: 'Witamy w pilot-app' })
  const counter = screen.getByRole('button', { name: /Licznik: 0/ })
  const stats = screen.getByLabelText('Statystyki sesji')
  screen.getByText(/Dokonane zmiany w projekcie/)
  screen.getByRole('contentinfo', { name: 'Informacje o aplikacji' })
  screen.getByRole('button', { name: /Przełącz na tryb/ })

  fireEvent.click(counter)
  assert.ok(within(stats).getByText('1'))
})
