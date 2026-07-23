import './setup/jsdom-env.ts'

import assert from 'node:assert/strict'
import test from 'node:test'
import React from 'react'
import { render, screen, within } from '@testing-library/react'
import { SiteFooter } from '../src/components/app/site-footer.tsx'

test('renders name, version, year and secure external links', () => {
  render(<SiteFooter />)
  const footer = screen.getByRole('contentinfo', { name: 'Informacje o aplikacji' })
  assert.match(footer.textContent ?? '', /pilot-app/)
  assert.match(footer.textContent ?? '', /v0\.0\.0/)
  assert.match(footer.textContent ?? '', new RegExp(`© ${new Date().getFullYear()}`))

  const links = within(footer).getAllByRole('link')
  assert.equal(links.length, 2)
  for (const link of links) {
    assert.equal(link.getAttribute('target'), '_blank')
    assert.equal(link.getAttribute('rel'), 'noopener')
  }
})
