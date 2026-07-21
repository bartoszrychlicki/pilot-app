import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import test from 'node:test'

const manifestUrl = new URL('../public/manifest.webmanifest', import.meta.url)
const indexUrl = new URL('../index.html', import.meta.url)

test('defines the installable PWA manifest', async () => {
  const manifest = JSON.parse(await readFile(manifestUrl, 'utf8'))

  assert.equal(manifest.name, 'pilot-app')
  assert.equal(manifest.short_name, 'pilot')
  assert.equal(manifest.start_url, '/')
  assert.equal(manifest.display, 'standalone')
  assert.match(manifest.theme_color, /^#[0-9a-f]{6}$/i)
  assert.match(manifest.background_color, /^#[0-9a-f]{6}$/i)
  assert.ok(Array.isArray(manifest.icons))
  assert.ok(
    manifest.icons.some(
      (icon) => icon.sizes === '192x192' && icon.type === 'image/png',
    ),
  )
  assert.ok(
    manifest.icons.some(
      (icon) => icon.sizes === '512x512' && icon.type === 'image/png',
    ),
  )
  assert.ok(
    manifest.icons.some(
      (icon) => icon.type === 'image/png' && icon.purpose === 'maskable',
    ),
  )
})

test('links the manifest and mobile installation metadata in the document head', async () => {
  const indexHtml = await readFile(indexUrl, 'utf8')

  assert.match(
    indexHtml,
    /<link\b(?=[^>]*\brel=["']manifest["'])(?=[^>]*\bhref=["']\/manifest\.webmanifest["'])[^>]*>/i,
  )
  assert.ok(indexHtml.includes('name="theme-color"'))
  assert.match(
    indexHtml,
    /<link\b(?=[^>]*\brel=["']apple-touch-icon["'])(?=[^>]*\bhref=["']\/apple-touch-icon\.png["'])[^>]*>/i,
  )
  assert.match(
    indexHtml,
    /<meta\b(?=[^>]*\bname=["']apple-mobile-web-app-capable["'])(?=[^>]*\bcontent=["']yes["'])[^>]*>/i,
  )
})
