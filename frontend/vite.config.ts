import { svelte } from '@sveltejs/vite-plugin-svelte'
import { readdirSync } from 'node:fs'
import { resolve } from 'node:path'
import { defineConfig } from 'vite'

const frontendDir = import.meta.dirname
const pagesDir = resolve(frontendDir, 'pages')

// Every .html file in pages/ is built into a page of the site.
const pages = readdirSync(pagesDir)
  .filter((file) => file.endsWith('.html'))
  .map((file) => resolve(pagesDir, file))

// https://vite.dev/config/
export default defineConfig({
  root: pagesDir,
  publicDir: resolve(frontendDir, 'public'),
  plugins: [svelte({ configFile: false })],
  build: {
    outDir: resolve(frontendDir, 'build'),
    emptyOutDir: true,
    rolldownOptions: {
      input: pages,
    },
  },
  server: {
    fs: {
      // pages/ is the Vite root, but pages import from components/ and lib/.
      allow: [frontendDir],
    },
    // In dev, forward API calls to the Go server (`go run .` in ../server).
    proxy: {
      '/api': 'http://localhost:8080',
    },
  },
})
