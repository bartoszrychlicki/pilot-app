import { readFileSync } from 'node:fs'
import { defineConfig } from 'vite'
import { getThemeBootstrapScript } from './src/theme.ts'

const { name, version } = JSON.parse(
  readFileSync(new URL('./package.json', import.meta.url), 'utf8'),
) as { name: string; version: string }

export default defineConfig({
  plugins: [
    {
      name: 'theme-bootstrap',
      transformIndexHtml: {
        order: 'pre',
        handler() {
          return [
            {
              tag: 'script',
              children: getThemeBootstrapScript(),
              injectTo: 'head-prepend',
            },
          ]
        },
      },
    },
  ],
  define: {
    __APP_NAME__: JSON.stringify(name),
    __APP_VERSION__: JSON.stringify(version),
  },
})
