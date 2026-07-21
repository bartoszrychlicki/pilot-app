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
  assert.ok(manifest.icons.length > 0)
  assert.equal(manifest.icons[0].sizes, 'any')
  assert.equal(manifest.icons[0].type, 'image/svg+xml')
})

test('links the manifest and theme color in the document head', async () => {
  const indexHtml = await readFile(indexUrl, 'utf8')

  assert.ok(indexHtml.includes('rel="manifest"'))
  assert.ok(indexHtml.includes('href="/manifest.webmanifest"'))
  assert.ok(indexHtml.includes('name="theme-color"'))
})
