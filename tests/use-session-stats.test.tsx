import './setup/jsdom-env.ts'

import assert from 'node:assert/strict'
import { test } from 'node:test'
import React from 'react'
import { act, fireEvent, render, screen } from '@testing-library/react'
import { useSessionStats } from '../src/hooks/use-session-stats.ts'
import { formatDuration } from '../src/lib/stats.ts'

test('updates time every second and records interactions', (t) => {
  t.mock.timers.enable({ apis: ['setInterval'] })
  let now = 0

  function Probe() {
    const stats = useSessionStats(() => now)
    return (
      <div>
        <span data-testid="stats">
          {stats.clicks}/{stats.resets}/{formatDuration(stats.elapsedMs)}
        </span>
        <button type="button" onClick={stats.recordIncrement}>increment</button>
        <button type="button" onClick={stats.recordReset}>reset</button>
      </div>
    )
  }

  render(<Probe />)
  assert.equal(screen.getByTestId('stats').textContent, '0/0/00:00')

  now = 1000
  act(() => t.mock.timers.tick(1000))
  assert.equal(screen.getByTestId('stats').textContent, '0/0/00:01')
  fireEvent.click(screen.getByRole('button', { name: 'increment' }))
  fireEvent.click(screen.getByRole('button', { name: 'reset' }))
  assert.equal(screen.getByTestId('stats').textContent, '1/1/00:01')
})
